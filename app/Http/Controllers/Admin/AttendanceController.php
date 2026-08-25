<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\AttendanceCorrection;
use App\Models\User;
use App\Notifications\AttendanceCorrectionReviewed;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function index(Request $request): Response
    {
        $today = now()->toDateString();
        $todaysAttendance = Attendance::query()->where('date', $today)->get();

        $attendance = Attendance::query()
            ->with('user')
            ->when($request->filled('employee_id'), fn ($q) => $q->where('user_id', $request->integer('employee_id')))
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->filled('from'), fn ($q) => $q->whereDate('date', '>=', $request->date('from')))
            ->when($request->filled('to'), fn ($q) => $q->whereDate('date', '<=', $request->date('to')))
            ->orderByDesc('date')
            ->paginate(20)
            ->withQueryString();

        $employeeCount = User::query()->where('role', User::ROLE_EMPLOYEE)->count();

        return Inertia::render('admin/attendance/index', [
            'summary' => [
                'present' => $todaysAttendance->where('status', Attendance::STATUS_PRESENT)->count(),
                'late' => $todaysAttendance->where('status', Attendance::STATUS_LATE)->count(),
                'absent' => max(0, $employeeCount - $todaysAttendance->count()),
                'onLeave' => $todaysAttendance->where('status', Attendance::STATUS_LEAVE)->count(),
                'incomplete' => $todaysAttendance->where('status', Attendance::STATUS_INCOMPLETE)->count(),
            ],
            'attendance' => $attendance,
            'filters' => $request->only(['employee_id', 'status', 'from', 'to']),
            'employees' => User::query()->whereIn('role', ['employee', 'admin'])->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function show(Attendance $attendance): Response
    {
        return Inertia::render('admin/attendance/show', [
            'attendance' => $attendance->load('user', 'corrections'),
        ]);
    }

    public function correct(Request $request, Attendance $attendance): RedirectResponse
    {
        $data = $request->validate([
            'time_in' => ['nullable', 'date_format:H:i'],
            'time_out' => ['nullable', 'date_format:H:i'],
            'reason' => ['required', 'string', 'max:1000'],
        ]);

        $originalTimeIn = $attendance->time_in?->format('H:i');
        $originalTimeOut = $attendance->time_out?->format('H:i');

        AttendanceCorrection::create([
            'attendance_id' => $attendance->id,
            'user_id' => $attendance->user_id,
            'date' => $attendance->date->toDateString(),
            'source' => AttendanceCorrection::SOURCE_ADMIN,
            'field_corrected' => $data['time_in'] && $data['time_out'] ? 'both' : ($data['time_in'] ? 'time_in' : 'time_out'),
            'original_time_in' => $originalTimeIn,
            'original_time_out' => $originalTimeOut,
            'requested_time_in' => $data['time_in'] ?? $originalTimeIn,
            'requested_time_out' => $data['time_out'] ?? $originalTimeOut,
            'reason' => $data['reason'],
            'status' => AttendanceCorrection::STATUS_APPROVED,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        $attendance->update([
            'time_in' => $data['time_in'] ? $attendance->date->toDateString().' '.$data['time_in'] : $attendance->time_in,
            'time_out' => $data['time_out'] ? $attendance->date->toDateString().' '.$data['time_out'] : $attendance->time_out,
            'status' => Attendance::STATUS_PRESENT,
        ]);

        return back();
    }

    public function correctionRequests(Request $request): Response
    {
        $incoming = AttendanceCorrection::query()
            ->where('source', AttendanceCorrection::SOURCE_EMPLOYEE)
            ->where('status', AttendanceCorrection::STATUS_PENDING)
            ->with('user')
            ->orderByDesc('created_at')
            ->paginate(15, ['*'], 'incoming_page')
            ->withQueryString();

        $log = AttendanceCorrection::query()
            ->with(['user', 'reviewer'])
            ->whereIn('status', [AttendanceCorrection::STATUS_APPROVED, AttendanceCorrection::STATUS_REJECTED])
            ->orderByDesc('updated_at')
            ->paginate(15, ['*'], 'log_page')
            ->withQueryString();

        return Inertia::render('admin/attendance/corrections', [
            'incoming' => $incoming,
            'log' => $log,
        ]);
    }

    public function reviewCorrection(Request $request, AttendanceCorrection $correction): RedirectResponse
    {
        $data = $request->validate([
            'decision' => ['required', 'in:approved,rejected'],
        ]);

        $correction->update([
            'status' => $data['decision'],
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        if ($data['decision'] === AttendanceCorrection::STATUS_APPROVED && $correction->attendance_id) {
            $attendance = Attendance::find($correction->attendance_id);
            $attendance?->update([
                'time_in' => $correction->requested_time_in ? $correction->date->toDateString().' '.$correction->requested_time_in : $attendance->time_in,
                'time_out' => $correction->requested_time_out ? $correction->date->toDateString().' '.$correction->requested_time_out : $attendance->time_out,
                'status' => Attendance::STATUS_PRESENT,
            ]);
        }

        $correction->user->notify(new AttendanceCorrectionReviewed($correction));

        return back();
    }
}
