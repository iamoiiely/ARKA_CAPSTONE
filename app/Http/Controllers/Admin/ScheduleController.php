<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Schedule;
use App\Models\User;
use App\Notifications\ScheduleOverlapDetected;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleController extends Controller
{
    public function index(Request $request): Response
    {
        $schedules = Schedule::query()
            ->with(['user', 'client'])
            ->when($request->filled('employee_id'), fn ($q) => $q->where('user_id', $request->integer('employee_id')))
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->filled('day'), fn ($q) => $q->whereJsonContains('working_days', $request->string('day')->toString()))
            ->when($request->filled('search'), function ($q) use ($request) {
                $search = $request->string('search');
                $q->whereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%"));
            })
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/schedules/index', [
            'schedules' => $schedules,
            'filters' => $request->only(['employee_id', 'status', 'day', 'search']),
            'employees' => User::query()->whereIn('role', ['employee', 'admin'])->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/schedules/create', [
            'employees' => User::query()->whereIn('role', ['employee', 'admin'])->where('status', User::STATUS_ACTIVE)->orderBy('name')->get(['id', 'name']),
            'clients' => Client::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        $schedule = Schedule::create($data);

        $this->flagOverlapIfAny($schedule);

        return to_route('admin.schedules.index');
    }

    public function edit(Schedule $schedule): Response
    {
        return Inertia::render('admin/schedules/edit', [
            'schedule' => $schedule,
            'employees' => User::query()->whereIn('role', ['employee', 'admin'])->orderBy('name')->get(['id', 'name']),
            'clients' => Client::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Schedule $schedule): RedirectResponse
    {
        $data = $this->validated($request);

        $schedule->update($data);

        $this->flagOverlapIfAny($schedule);

        return to_route('admin.schedules.index');
    }

    public function checkOverlap(Request $request): JsonResponse
    {
        $data = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'working_days' => ['required', 'array', 'min:1'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i'],
            'exclude_schedule_id' => ['nullable', 'integer'],
        ]);

        $overlaps = Schedule::query()
            ->where('user_id', $data['user_id'])
            ->where('status', Schedule::STATUS_ACTIVE)
            ->when($data['exclude_schedule_id'] ?? null, fn ($q, $id) => $q->where('id', '!=', $id))
            ->get()
            ->contains(fn (Schedule $other) => $other->overlapsWith($data['working_days'], $data['start_time'], $data['end_time']));

        return response()->json(['overlaps' => $overlaps]);
    }

    public function toggleStatus(Schedule $schedule): RedirectResponse
    {
        $schedule->update([
            'status' => $schedule->status === Schedule::STATUS_ACTIVE ? Schedule::STATUS_INACTIVE : Schedule::STATUS_ACTIVE,
        ]);

        return back();
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        return $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'client_id' => ['required', 'exists:clients,id'],
            'job_position' => ['required', 'string', 'max:255'],
            'working_days' => ['required', 'array', 'min:1'],
            'working_days.*' => ['in:Mon,Tue,Wed,Thu,Fri,Sat,Sun'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'schedule_type' => ['required', 'in:flexible,strict'],
            'expected_working_hours' => ['required', 'numeric', 'min:0', 'max:24'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'status' => ['required', 'in:active,inactive'],
        ]);
    }

    private function flagOverlapIfAny(Schedule $schedule): void
    {
        $overlaps = Schedule::query()
            ->where('user_id', $schedule->user_id)
            ->where('id', '!=', $schedule->id)
            ->where('status', Schedule::STATUS_ACTIVE)
            ->get()
            ->contains(fn (Schedule $other) => $other->overlapsWith($schedule->working_days, $schedule->start_time, $schedule->end_time));

        if ($overlaps) {
            $admins = User::query()->whereIn('role', ['admin', 'super_admin'])->get();
            Notification::send($admins, new ScheduleOverlapDetected($schedule));
        }
    }
}
