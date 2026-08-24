<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreEmployeeRequest;
use App\Http\Requests\Admin\UpdateEmployeeRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    /**
     * List employees with search and filtering.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();
        $role = $request->string('role')->toString();

        $employees = User::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('employee_id', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($status, fn ($query) => $query->where('status', $status))
            ->when($role, fn ($query) => $query->where('role', $role))
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/employees/index', [
            'employees' => $employees,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'role' => $role,
            ],
        ]);
    }

    /**
     * Show the form for adding a new employee.
     */
    public function create(): Response
    {
        return Inertia::render('admin/employees/create');
    }

    /**
     * Persist a new employee created by the admin and send them a
     * password set-up link, since employees cannot self-register.
     */
    public function store(StoreEmployeeRequest $request): RedirectResponse
    {
        $validated = [
            'birthday' => null,
            'phone_number' => null,
            'job_position' => null,
            'employee_id' => null,
            ...$request->safe()->except('profile_photo'),
        ];

        $employee = User::create([
            ...$validated,
            'employee_id' => $validated['employee_id'] ?: $this->generateEmployeeId(),
            'password' => Hash::make(Str::random(40)),
        ]);

        if ($request->hasFile('profile_photo')) {
            $employee->update([
                'profile_photo_path' => $request->file('profile_photo')->store('profile-photos', 'public'),
            ]);
        }

        Password::sendResetLink(['email' => $employee->email]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Employee added. A password set-up email has been sent.')]);

        return to_route('admin.employees.index');
    }

    /**
     * Show a single employee.
     */
    public function show(User $employee): Response
    {
        return Inertia::render('admin/employees/show', [
            'employee' => $employee,
        ]);
    }

    /**
     * Show the form for editing an employee.
     */
    public function edit(User $employee): Response
    {
        return Inertia::render('admin/employees/edit', [
            'employee' => $employee,
        ]);
    }

    /**
     * Update an employee's editable information. The email address is
     * intentionally excluded since it cannot be changed after creation.
     */
    public function update(UpdateEmployeeRequest $request, User $employee): RedirectResponse
    {
        $employee->fill($request->safe()->except('profile_photo'));

        if ($request->hasFile('profile_photo')) {
            $employee->profile_photo_path = $request->file('profile_photo')->store('profile-photos', 'public');
        }

        $employee->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Employee updated.')]);

        return to_route('admin.employees.show', $employee);
    }

    /**
     * Deactivate an employee. Their account can no longer log in, but
     * their existing records remain in the system.
     */
    public function deactivate(User $employee): RedirectResponse
    {
        $employee->update(['status' => User::STATUS_INACTIVE]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Employee deactivated.')]);

        return back();
    }

    /**
     * Reactivate an employee, restoring their ability to log in.
     */
    public function activate(User $employee): RedirectResponse
    {
        $employee->update(['status' => User::STATUS_ACTIVE]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Employee activated.')]);

        return back();
    }

    /**
     * Generate a unique employee ID when one isn't provided.
     */
    private function generateEmployeeId(): string
    {
        do {
            $employeeId = 'EMP-'.random_int(10000, 99999);
        } while (User::where('employee_id', $employeeId)->exists());

        return $employeeId;
    }
}
