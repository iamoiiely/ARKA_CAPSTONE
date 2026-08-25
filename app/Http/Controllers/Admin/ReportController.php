<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Devotional;
use App\Models\LeaveRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/reports/index', [
            'employees' => User::query()->whereIn('role', ['employee', 'admin'])->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function attendance(Request $request): Response
    {
        $data = $request->validate([
            'employee_id' => ['nullable', 'exists:users,id'],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date'],
            'status' => ['nullable', 'in:present,late,absent,leave,incomplete'],
        ]);

        $records = Attendance::query()
            ->with('user')
            ->when($data['employee_id'] ?? null, fn ($q, $id) => $q->where('user_id', $id))
            ->when($data['from'] ?? null, fn ($q, $d) => $q->whereDate('date', '>=', $d))
            ->when($data['to'] ?? null, fn ($q, $d) => $q->whereDate('date', '<=', $d))
            ->when($data['status'] ?? null, fn ($q, $s) => $q->where('status', $s))
            ->orderBy('date')
            ->get();

        $summary = $records->groupBy('user.name')->map(fn ($rows) => [
            'present' => $rows->where('status', Attendance::STATUS_PRESENT)->count(),
            'late' => $rows->where('status', Attendance::STATUS_LATE)->count(),
            'absent' => $rows->where('status', Attendance::STATUS_ABSENT)->count(),
            'leave' => $rows->where('status', Attendance::STATUS_LEAVE)->count(),
        ]);

        return Inertia::render('admin/reports/attendance', [
            'summary' => $summary,
            'details' => $records->map(fn (Attendance $a) => [
                'date' => $a->date->toDateString(),
                'employee' => $a->user->name,
                'time_in' => $a->time_in?->format('H:i'),
                'time_out' => $a->time_out?->format('H:i'),
                'status' => $a->status,
            ]),
            'filters' => $data,
            'employees' => User::query()->whereIn('role', ['employee', 'admin'])->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function leave(Request $request): Response
    {
        $data = $request->validate([
            'employee_id' => ['nullable', 'exists:users,id'],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date'],
            'leave_type' => ['nullable', 'in:paid,unpaid'],
        ]);

        $records = LeaveRequest::query()
            ->with('user')
            ->when($data['employee_id'] ?? null, fn ($q, $id) => $q->where('user_id', $id))
            ->when($data['from'] ?? null, fn ($q, $d) => $q->whereDate('start_date', '>=', $d))
            ->when($data['to'] ?? null, fn ($q, $d) => $q->whereDate('start_date', '<=', $d))
            ->when($data['leave_type'] ?? null, fn ($q, $t) => $q->where('leave_type', $t))
            ->orderBy('start_date')
            ->get();

        $summary = $records->groupBy('user.name')->map(fn ($rows) => [
            'paid' => $rows->where('leave_type', 'paid')->where('status', LeaveRequest::STATUS_APPROVED)->count(),
            'unpaid' => $rows->where('leave_type', 'unpaid')->where('status', LeaveRequest::STATUS_APPROVED)->count(),
            'total' => $rows->where('status', LeaveRequest::STATUS_APPROVED)->count(),
        ]);

        return Inertia::render('admin/reports/leave', [
            'summary' => $summary,
            'details' => $records->map(fn (LeaveRequest $l) => [
                'employee' => $l->user->name,
                'date' => $l->start_date->toDateString(),
                'type' => $l->leave_type,
                'status' => $l->status,
            ]),
            'filters' => $data,
            'employees' => User::query()->whereIn('role', ['employee', 'admin'])->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function devotional(Request $request): Response
    {
        $data = $request->validate([
            'employee_id' => ['nullable', 'exists:users,id'],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date'],
        ]);

        $employees = User::query()
            ->where('role', User::ROLE_EMPLOYEE)
            ->when($data['employee_id'] ?? null, fn ($q, $id) => $q->where('id', $id))
            ->get();

        $devotionals = Devotional::query()
            ->with('user')
            ->when($data['employee_id'] ?? null, fn ($q, $id) => $q->where('user_id', $id))
            ->when($data['from'] ?? null, fn ($q, $d) => $q->whereDate('date', '>=', $d))
            ->when($data['to'] ?? null, fn ($q, $d) => $q->whereDate('date', '<=', $d))
            ->orderBy('date')
            ->get();

        $summary = $employees->mapWithKeys(fn (User $employee) => [
            $employee->name => [
                'submitted' => $devotionals->where('user_id', $employee->id)->count(),
            ],
        ]);

        return Inertia::render('admin/reports/devotional', [
            'summary' => $summary,
            'details' => $devotionals->map(fn (Devotional $d) => [
                'date' => $d->date->toDateString(),
                'employee' => $d->user->name,
                'title' => $d->title,
            ]),
            'filters' => $data,
            'employees' => User::query()->whereIn('role', ['employee', 'admin'])->orderBy('name')->get(['id', 'name']),
        ]);
    }
}
