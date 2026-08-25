<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Schedule;
use App\Models\TimeLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class TimeTrackerController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $today = Carbon::today();

        $schedules = Schedule::query()
            ->where('user_id', $user->id)
            ->where('status', Schedule::STATUS_ACTIVE)
            ->with('client')
            ->get();

        $todaysLogs = TimeLog::query()
            ->where('user_id', $user->id)
            ->where('date', $today->toDateString())
            ->with('client')
            ->get();

        return Inertia::render('employee/time-tracker/index', [
            'schedules' => $schedules,
            'todaysLogs' => $todaysLogs,
        ]);
    }

    public function history(Request $request): Response
    {
        $user = $request->user();

        $logs = TimeLog::query()
            ->where('user_id', $user->id)
            ->with('client')
            ->when($request->filled('client_id'), fn ($q) => $q->where('client_id', $request->integer('client_id')))
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->filled('from'), fn ($q) => $q->whereDate('date', '>=', $request->date('from')))
            ->when($request->filled('to'), fn ($q) => $q->whereDate('date', '<=', $request->date('to')))
            ->orderByDesc('date')
            ->orderByDesc('time_in')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('employee/time-tracker/history', [
            'logs' => $logs,
            'filters' => $request->only(['client_id', 'status', 'from', 'to']),
        ]);
    }

    public function start(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'client_id' => ['required', 'exists:clients,id'],
        ]);

        $user = $request->user();

        $alreadyRunning = TimeLog::query()
            ->where('user_id', $user->id)
            ->where('client_id', $data['client_id'])
            ->whereIn('status', [TimeLog::STATUS_RUNNING, TimeLog::STATUS_ON_BREAK])
            ->exists();

        if ($alreadyRunning) {
            throw ValidationException::withMessages(['client_id' => 'A timer is already running for this client.']);
        }

        $schedule = Schedule::query()
            ->where('user_id', $user->id)
            ->where('client_id', $data['client_id'])
            ->where('status', Schedule::STATUS_ACTIVE)
            ->first();

        TimeLog::create([
            'user_id' => $user->id,
            'client_id' => $data['client_id'],
            'schedule_id' => $schedule?->id,
            'date' => Carbon::today()->toDateString(),
            'time_in' => now(),
            'status' => TimeLog::STATUS_RUNNING,
        ]);

        return back();
    }

    public function break(TimeLog $timeLog): RedirectResponse
    {
        $this->authorizeOwnership($timeLog);

        if ($timeLog->status === TimeLog::STATUS_ON_BREAK) {
            $elapsed = $timeLog->break_started_at->diffInMinutes(now());
            $timeLog->update([
                'break_minutes' => $timeLog->break_minutes + $elapsed,
                'break_started_at' => null,
                'status' => TimeLog::STATUS_RUNNING,
            ]);
        } elseif ($timeLog->status === TimeLog::STATUS_RUNNING) {
            $timeLog->update([
                'break_started_at' => now(),
                'status' => TimeLog::STATUS_ON_BREAK,
            ]);
        }

        return back();
    }

    public function stop(TimeLog $timeLog): RedirectResponse
    {
        $this->authorizeOwnership($timeLog);

        if ($timeLog->status === TimeLog::STATUS_ON_BREAK) {
            $elapsed = $timeLog->break_started_at->diffInMinutes(now());
            $timeLog->break_minutes += $elapsed;
            $timeLog->break_started_at = null;
        }

        $timeLog->time_out = now();
        $timeLog->status = TimeLog::STATUS_COMPLETED;
        $timeLog->save();

        $this->syncAttendanceForDate($timeLog->user_id, $timeLog->date->toDateString());

        return back();
    }

    private function authorizeOwnership(TimeLog $timeLog): void
    {
        if ($timeLog->user_id !== request()->user()->id) {
            abort(403);
        }
    }

    private function syncAttendanceForDate(int $userId, string $date): void
    {
        $logs = TimeLog::query()->where('user_id', $userId)->where('date', $date)->get();

        if ($logs->isEmpty()) {
            return;
        }

        $timeIn = $logs->min('time_in');
        $hasOpenLog = $logs->contains(fn (TimeLog $log) => $log->time_out === null);
        $timeOut = $hasOpenLog ? null : $logs->max('time_out');
        $breakMinutes = $logs->sum('break_minutes');

        $scheduledStart = $logs->first()->schedule?->start_time;
        $isLate = $scheduledStart && $timeIn->format('H:i:s') > $scheduledStart;

        Attendance::updateOrCreate(
            ['user_id' => $userId, 'date' => $date],
            [
                'time_in' => $timeIn,
                'time_out' => $timeOut,
                'break_minutes' => $breakMinutes,
                'status' => match (true) {
                    $hasOpenLog => Attendance::STATUS_INCOMPLETE,
                    $isLate => Attendance::STATUS_LATE,
                    default => Attendance::STATUS_PRESENT,
                },
            ],
        );
    }
}
