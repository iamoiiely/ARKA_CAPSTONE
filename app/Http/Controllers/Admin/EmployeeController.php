<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\NewEmployeeAccountCreated;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function index(Request $request): Response
    {
        $employees = User::query()
            ->whereIn('role', [User::ROLE_EMPLOYEE, User::ROLE_ADMIN])
            ->when($request->filled('search'), function ($q) use ($request) {
                $search = $request->string('search');
                $q->where(fn ($q) => $q->where('name', 'like', "%{$search}%")
                    ->orWhere('employee_no', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%"));
            })
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->filled('role'), fn ($q) => $q->where('role', $request->string('role')))
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/employees/index', [
            'employees' => $employees,
            'filters' => $request->only(['search', 'status', 'role']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/employees/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'birthday' => ['nullable', 'date', 'before:today'],
            'phone' => ['nullable', 'string', 'max:30'],
            'photo' => ['nullable', 'image', 'max:5120'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'role' => ['required', 'in:employee,admin'],
            'temporary_password' => ['nullable', 'string', 'min:8'],
        ]);

        $employeeNo = 'EMP-'.str_pad((string) (User::query()->count() + 1), 4, '0', STR_PAD_LEFT);
        while (User::query()->where('employee_no', $employeeNo)->exists()) {
            $employeeNo = 'EMP-'.str_pad((string) ((int) substr($employeeNo, 4) + 1), 4, '0', STR_PAD_LEFT);
        }

        $temporaryPassword = $data['temporary_password'] ?? Str::password(12);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('profile-photos', 'public');
        }

        $employee = User::create([
            'employee_no' => $employeeNo,
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($temporaryPassword),
            'role' => $data['role'],
            'birthday' => $data['birthday'] ?? null,
            'phone' => $data['phone'] ?? null,
            'photo_path' => $photoPath,
            'status' => User::STATUS_ACTIVE,
            'must_change_password' => true,
        ]);

        $admins = User::query()->whereIn('role', ['admin', 'super_admin'])->where('id', '!=', $request->user()->id)->get();
        Notification::send($admins, new NewEmployeeAccountCreated($employee));

        return to_route('admin.employees.show', $employee)->with('temporaryPassword', $temporaryPassword);
    }

    public function show(Request $request, User $employee): Response
    {
        $employee->load(['schedules.client', 'attendances' => fn ($q) => $q->latest('date')->limit(10)]);

        return Inertia::render('admin/employees/show', [
            'employee' => $employee,
            'temporaryPassword' => $request->session()->get('temporaryPassword'),
        ]);
    }

    public function edit(User $employee): Response
    {
        return Inertia::render('admin/employees/edit', [
            'employee' => $employee,
        ]);
    }

    public function update(Request $request, User $employee): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'birthday' => ['nullable', 'date', 'before:today'],
            'phone' => ['nullable', 'string', 'max:30'],
            'photo' => ['nullable', 'image', 'max:5120'],
        ]);

        $employee->fill([
            'name' => $data['name'],
            'birthday' => $data['birthday'] ?? null,
            'phone' => $data['phone'] ?? null,
        ]);

        if ($request->hasFile('photo')) {
            $employee->photo_path = $request->file('photo')->store('profile-photos', 'public');
        }

        $employee->save();

        return to_route('admin.employees.show', $employee);
    }

    public function toggleStatus(User $employee): RedirectResponse
    {
        $employee->update([
            'status' => $employee->isActive() ? User::STATUS_INACTIVE : User::STATUS_ACTIVE,
        ]);

        return back();
    }
}
