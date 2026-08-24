<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:'.User::ROLE_ADMIN.','.User::ROLE_SUPER_ADMIN])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('employees', [EmployeeController::class, 'index'])->name('employees.index');
        Route::get('employees/create', [EmployeeController::class, 'create'])->name('employees.create');
        Route::post('employees', [EmployeeController::class, 'store'])->name('employees.store');
        Route::get('employees/{employee}', [EmployeeController::class, 'show'])->name('employees.show');
        Route::get('employees/{employee}/edit', [EmployeeController::class, 'edit'])->name('employees.edit');
        Route::put('employees/{employee}', [EmployeeController::class, 'update'])->name('employees.update');
        Route::patch('employees/{employee}/activate', [EmployeeController::class, 'activate'])->name('employees.activate');
        Route::patch('employees/{employee}/deactivate', [EmployeeController::class, 'deactivate'])->name('employees.deactivate');

        Route::inertia('scheduling', 'admin/scheduling/index')->name('scheduling.index');
        Route::inertia('attendance', 'admin/attendance/index')->name('attendance.index');
        Route::inertia('devotional', 'admin/devotional/index')->name('devotional.index');
        Route::inertia('reports', 'admin/reports/index')->name('reports.index');

        Route::middleware('role:'.User::ROLE_SUPER_ADMIN)->group(function () {
            Route::inertia('leave-requests', 'admin/leave-requests/index')->name('leave-requests.index');
            Route::inertia('payroll', 'admin/payroll/index')->name('payroll.index');
            Route::inertia('payslips', 'admin/payslips/index')->name('payslips.index');
            Route::inertia('settings', 'admin/settings/index')->name('settings.index');
        });
    });
