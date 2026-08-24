<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the admin dashboard overview.
     */
    public function index(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalEmployees' => User::where('role', User::ROLE_EMPLOYEE)->count(),
                'totalAdmins' => User::where('role', User::ROLE_ADMIN)->count(),
                'activeAccounts' => User::where('status', User::STATUS_ACTIVE)->count(),
                'inactiveAccounts' => User::where('status', User::STATUS_INACTIVE)->count(),
            ],
        ]);
    }
}
