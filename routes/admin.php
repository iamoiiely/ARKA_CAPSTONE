<?php

use App\Http\Controllers\Admin\AttendanceController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DevotionalController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\ScheduleController;
use App\Http\Controllers\SuperAdmin\LeaveRequestController as SuperAdminLeaveRequestController;
use App\Http\Controllers\SuperAdmin\PayslipController as SuperAdminPayslipController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin,super_admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::redirect('/', '/admin/dashboard');
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::get('employees', [EmployeeController::class, 'index'])->name('employees.index');
    Route::get('employees/create', [EmployeeController::class, 'create'])->name('employees.create');
    Route::post('employees', [EmployeeController::class, 'store'])->name('employees.store');
    Route::get('employees/{employee}', [EmployeeController::class, 'show'])->name('employees.show');
    Route::get('employees/{employee}/edit', [EmployeeController::class, 'edit'])->name('employees.edit');
    Route::put('employees/{employee}', [EmployeeController::class, 'update'])->name('employees.update');
    Route::patch('employees/{employee}/toggle-status', [EmployeeController::class, 'toggleStatus'])->name('employees.toggle-status');

    Route::get('schedules', [ScheduleController::class, 'index'])->name('schedules.index');
    Route::get('schedules/create', [ScheduleController::class, 'create'])->name('schedules.create');
    Route::post('schedules', [ScheduleController::class, 'store'])->name('schedules.store');
    Route::post('schedules/check-overlap', [ScheduleController::class, 'checkOverlap'])->name('schedules.check-overlap');
    Route::get('schedules/{schedule}/edit', [ScheduleController::class, 'edit'])->name('schedules.edit');
    Route::put('schedules/{schedule}', [ScheduleController::class, 'update'])->name('schedules.update');
    Route::patch('schedules/{schedule}/toggle-status', [ScheduleController::class, 'toggleStatus'])->name('schedules.toggle-status');

    Route::get('attendance', [AttendanceController::class, 'index'])->name('attendance.index');
    Route::get('attendance/corrections', [AttendanceController::class, 'correctionRequests'])->name('attendance.corrections');
    Route::patch('attendance/corrections/{correction}/review', [AttendanceController::class, 'reviewCorrection'])->name('attendance.corrections.review');
    Route::get('attendance/{attendance}', [AttendanceController::class, 'show'])->name('attendance.show');
    Route::post('attendance/{attendance}/correct', [AttendanceController::class, 'correct'])->name('attendance.correct');

    Route::get('devotionals', [DevotionalController::class, 'index'])->name('devotionals.index');
    Route::get('devotionals/{devotional}', [DevotionalController::class, 'show'])->name('devotionals.show');
    Route::get('devotionals/employee/{employee}', [DevotionalController::class, 'history'])->name('devotionals.history');

    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('reports/attendance', [ReportController::class, 'attendance'])->name('reports.attendance');
    Route::get('reports/leave', [ReportController::class, 'leave'])->name('reports.leave');
    Route::get('reports/devotional', [ReportController::class, 'devotional'])->name('reports.devotional');

    Route::middleware('role:super_admin')->group(function () {
        Route::get('leave-management', [SuperAdminLeaveRequestController::class, 'index'])->name('leave-management.index');
        Route::patch('leave-management/{leaveRequest}/review', [SuperAdminLeaveRequestController::class, 'review'])->name('leave-management.review');

        Route::get('payslip-management', [SuperAdminPayslipController::class, 'index'])->name('payslip-management.index');
        Route::get('payslip-management/create', [SuperAdminPayslipController::class, 'create'])->name('payslip-management.create');
        Route::post('payslip-management', [SuperAdminPayslipController::class, 'store'])->name('payslip-management.store');
    });
});
