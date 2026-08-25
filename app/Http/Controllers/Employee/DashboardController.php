<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Devotional;
use App\Models\LeaveRequest;
use App\Models\Payslip;
use App\Models\TimeLog;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $today = Carbon::today();

        $runningLogs = TimeLog::query()
            ->where('user_id', $user->id)
            ->whereIn('status', [TimeLog::STATUS_RUNNING, TimeLog::STATUS_ON_BREAK])
            ->with('client')
            ->get();

        $todaysLogs = TimeLog::query()
            ->where('user_id', $user->id)
            ->where('date', $today->toDateString())
            ->with('client')
            ->get();

        $monthAttendance = Attendance::query()
            ->where('user_id', $user->id)
            ->whereBetween('date', [$today->copy()->startOfMonth(), $today->copy()->endOfMonth()])
            ->get();

        $pendingLeave = LeaveRequest::query()
            ->where('user_id', $user->id)
            ->latest()
            ->first();

        $latestPayslip = Payslip::query()
            ->where('user_id', $user->id)
            ->latest('period_end')
            ->first();

        $todaysDevotional = Devotional::query()
            ->where('user_id', $user->id)
            ->where('date', $today->toDateString())
            ->first();

        $monthDevotionalCount = Devotional::query()
            ->where('user_id', $user->id)
            ->whereBetween('date', [$today->copy()->startOfMonth(), $today->copy()->endOfMonth()])
            ->count();

        $workingDaysSoFar = $today->copy()->startOfMonth()->diffInWeekdays($today) + 1;

        return Inertia::render('employee/dashboard', [
            'activeTimers' => [
                'count' => $runningLogs->count(),
                'totalMinutesToday' => $todaysLogs->sum(fn (TimeLog $log) => $log->totalMinutes()),
                'timers' => $runningLogs,
            ],
            'todaysWorkStatus' => $todaysLogs,
            'attendanceSummary' => [
                'present' => $monthAttendance->where('status', Attendance::STATUS_PRESENT)->count(),
                'late' => $monthAttendance->where('status', Attendance::STATUS_LATE)->count(),
                'absent' => $monthAttendance->where('status', Attendance::STATUS_ABSENT)->count(),
                'overtime' => 0,
            ],
            'pendingLeaveRequest' => $pendingLeave,
            'latestPayslip' => $latestPayslip,
            'devotional' => [
                'submittedToday' => $todaysDevotional !== null,
                'compliance' => "{$monthDevotionalCount}/{$workingDaysSoFar} days",
            ],
        ]);
    }
}
