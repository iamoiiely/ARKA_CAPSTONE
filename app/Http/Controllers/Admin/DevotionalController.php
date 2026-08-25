<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Devotional;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DevotionalController extends Controller
{
    public function index(Request $request): Response
    {
        $today = now()->toDateString();

        $submittedTodayIds = Devotional::query()->where('date', $today)->pluck('user_id');
        $employees = User::query()->where('role', User::ROLE_EMPLOYEE)->pluck('id');

        $devotionals = Devotional::query()
            ->with('user')
            ->when($request->filled('employee_id'), fn ($q) => $q->where('user_id', $request->integer('employee_id')))
            ->when($request->filled('search'), function ($q) use ($request) {
                $search = $request->string('search');
                $q->whereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%"));
            })
            ->orderByDesc('date')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/devotionals/index', [
            'devotionals' => $devotionals,
            'filters' => $request->only(['employee_id', 'search']),
            'employees' => User::query()->where('role', User::ROLE_EMPLOYEE)->orderBy('name')->get(['id', 'name']),
            'summary' => [
                'submitted' => $submittedTodayIds->count(),
                'total' => $employees->count(),
            ],
        ]);
    }

    public function show(Devotional $devotional): Response
    {
        return Inertia::render('admin/devotionals/show', [
            'devotional' => $devotional->load('user'),
        ]);
    }

    public function history(User $employee): Response
    {
        $devotionals = Devotional::query()
            ->where('user_id', $employee->id)
            ->orderByDesc('date')
            ->paginate(20);

        return Inertia::render('admin/devotionals/history', [
            'employee' => $employee,
            'devotionals' => $devotionals,
        ]);
    }
}
