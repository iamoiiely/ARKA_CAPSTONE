<?php

namespace App\Http\Responses;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     */
    public function toResponse($request): RedirectResponse
    {
        /** @var Request $request */
        $user = $request->user();

        $redirectTo = $user instanceof User && $user->canAccessAdminDashboard()
            ? route('admin.dashboard')
            : route('dashboard');

        return redirect()->intended($redirectTo);
    }
}
