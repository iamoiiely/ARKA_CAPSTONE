<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Client;
use App\Models\Devotional;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $today = Carbon::today();

        $employeeCount = User::query()->where('role', User::ROLE_EMPLOYEE);

        $todaysAttendance = Attendance::query()->where('date', $today->toDateString())->get();

        $incompleteToday = Attendance::query()
            ->where('date', $today->toDateString())
            ->where('status', Attendance::STATUS_INCOMPLETE)
            ->with('user')
            ->get();

        $activeSchedulesToday = Schedule::query()
            ->where('status', Schedule::STATUS_ACTIVE)
            ->whereJsonContains('working_days', $today->format('D'))
            ->with('client')
            ->get();

        $pendingDevotionalCount = User::query()->where('role', User::ROLE_EMPLOYEE)->count()
            - Devotional::query()->where('date', $today->toDateString())->count();

        $recentNotifications = $request->user()->notifications()->latest()->limit(3)->get();

        return Inertia::render('admin/dashboard', [
            'employeeOverview' => [
                'active' => (clone $employeeCount)->where('status', User::STATUS_ACTIVE)->count(),
                'inactive' => (clone $employeeCount)->where('status', User::STATUS_INACTIVE)->count(),
                'newThisWeek' => (clone $employeeCount)->where('created_at', '>=', Carbon::now()->subWeek())->count(),
            ],
            'todaysAttendance' => [
                'present' => $todaysAttendance->where('status', Attendance::STATUS_PRESENT)->count(),
                'late' => $todaysAttendance->where('status', Attendance::STATUS_LATE)->count(),
                'absent' => $employeeCount->count() - $todaysAttendance->count(),
                'incomplete' => $todaysAttendance->where('status', Attendance::STATUS_INCOMPLETE)->count(),
            ],
            'incompleteAlerts' => $incompleteToday->map(fn (Attendance $a) => [
                'id' => $a->id,
                'employee' => $a->user->name,
                'time_in' => $a->time_in?->format('H:i'),
            ]),
            'activeSchedulesToday' => [
                'count' => $activeSchedulesToday->count(),
                'byClient' => $activeSchedulesToday->groupBy('client.name')->map->count(),
            ],
            'pendingDevotionals' => max(0, $pendingDevotionalCount),
            'recentNotifications' => $recentNotifications,
        ]);
    }
}
