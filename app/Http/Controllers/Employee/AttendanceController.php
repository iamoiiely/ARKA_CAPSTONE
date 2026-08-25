<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\AttendanceCorrection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $today = Carbon::today();

        $monthAttendance = Attendance::query()
            ->where('user_id', $user->id)
            ->whereBetween('date', [$today->copy()->startOfMonth(), $today->copy()->endOfMonth()])
            ->get();

        $history = Attendance::query()
            ->where('user_id', $user->id)
            ->when($request->filled('from'), fn ($q) => $q->whereDate('date', '>=', $request->date('from')))
            ->when($request->filled('to'), fn ($q) => $q->whereDate('date', '<=', $request->date('to')))
            ->orderByDesc('date')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Attendance $attendance) => [
                'id' => $attendance->id,
                'date' => $attendance->date->toDateString(),
                'time_in' => $attendance->time_in?->format('H:i'),
                'time_out' => $attendance->time_out?->format('H:i'),
                'total_hours' => $attendance->totalHours(),
                'status' => $attendance->status,
            ]);

        $myCorrections = AttendanceCorrection::query()
            ->where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->paginate(10, ['*'], 'corrections_page')
            ->withQueryString();

        return Inertia::render('employee/attendance/index', [
            'summary' => [
                'present' => $monthAttendance->where('status', Attendance::STATUS_PRESENT)->count(),
                'absent' => $monthAttendance->where('status', Attendance::STATUS_ABSENT)->count(),
                'late' => $monthAttendance->where('status', Attendance::STATUS_LATE)->count(),
                'overtime' => 0,
                'paidLeave' => $monthAttendance->where('status', Attendance::STATUS_LEAVE)->where('leave_type', 'paid')->count(),
                'unpaidLeave' => $monthAttendance->where('status', Attendance::STATUS_LEAVE)->where('leave_type', 'unpaid')->count(),
            ],
            'history' => $history,
            'myCorrections' => $myCorrections,
            'filters' => $request->only(['from', 'to']),
        ]);
    }

    public function storeCorrection(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'date' => ['required', 'date'],
            'field_corrected' => ['required', 'in:time_in,time_out,both'],
            'requested_time_in' => ['nullable', 'date_format:H:i'],
            'requested_time_out' => ['nullable', 'date_format:H:i'],
            'reason' => ['required', 'string', 'max:1000'],
        ]);

        $user = $request->user();
        $attendance = Attendance::query()->where('user_id', $user->id)->where('date', $data['date'])->first();

        AttendanceCorrection::create([
            'attendance_id' => $attendance?->id,
            'user_id' => $user->id,
            'date' => $data['date'],
            'source' => AttendanceCorrection::SOURCE_EMPLOYEE,
            'field_corrected' => $data['field_corrected'],
            'original_time_in' => $attendance?->time_in?->format('H:i'),
            'original_time_out' => $attendance?->time_out?->format('H:i'),
            'requested_time_in' => $data['requested_time_in'] ?? null,
            'requested_time_out' => $data['requested_time_out'] ?? null,
            'reason' => $data['reason'],
            'status' => AttendanceCorrection::STATUS_PENDING,
        ]);

        return back();
    }
}
