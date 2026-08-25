<?php

use App\Http\Controllers\Auth\SetNewPasswordController;
use App\Http\Controllers\NotificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function (Request $request) {
    $user = $request->user();

    return $user ? redirect()->route($user->homeRouteName()) : redirect()->route('login');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('password/set-new', [SetNewPasswordController::class, 'edit'])->name('password.set-new');
    Route::post('password/set-new', [SetNewPasswordController::class, 'update'])->name('password.set-new.update');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications/mark-all-read', [NotificationController::class, 'markAllRead'])->name('notifications.mark-all-read');
});

require __DIR__.'/settings.php';
require __DIR__.'/employee.php';
require __DIR__.'/admin.php';
