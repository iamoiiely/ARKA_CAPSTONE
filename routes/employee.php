<?php

use App\Http\Controllers\Employee\AttendanceController;
use App\Http\Controllers\Employee\DashboardController;
use App\Http\Controllers\Employee\DevotionalController;
use App\Http\Controllers\Employee\LeaveRequestController;
use App\Http\Controllers\Employee\PayslipController;
use App\Http\Controllers\Employee\TimeTrackerController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:employee,admin'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::get('time-tracker', [TimeTrackerController::class, 'index'])->name('time-tracker.index');
    Route::get('time-tracker/history', [TimeTrackerController::class, 'history'])->name('time-tracker.history');
    Route::post('time-tracker/start', [TimeTrackerController::class, 'start'])->name('time-tracker.start');
    Route::post('time-tracker/{timeLog}/break', [TimeTrackerController::class, 'break'])->name('time-tracker.break');
    Route::post('time-tracker/{timeLog}/stop', [TimeTrackerController::class, 'stop'])->name('time-tracker.stop');

    Route::get('devotional', [DevotionalController::class, 'index'])->name('devotional.index');
    Route::post('devotional', [DevotionalController::class, 'store'])->name('devotional.store');

    Route::get('attendance', [AttendanceController::class, 'index'])->name('attendance.index');
    Route::post('attendance/corrections', [AttendanceController::class, 'storeCorrection'])->name('attendance.corrections.store');

    Route::get('leave-requests', [LeaveRequestController::class, 'index'])->name('leave-requests.index');
    Route::post('leave-requests', [LeaveRequestController::class, 'store'])->name('leave-requests.store');
    Route::patch('leave-requests/{leaveRequest}/cancel', [LeaveRequestController::class, 'cancel'])->name('leave-requests.cancel');

    Route::get('payslips', [PayslipController::class, 'index'])->name('payslips.index');
    Route::get('payslips/{payslip}', [PayslipController::class, 'show'])->name('payslips.show');
    Route::post('payslips/{payslip}/flag', [PayslipController::class, 'flag'])->name('payslips.flag');
});
