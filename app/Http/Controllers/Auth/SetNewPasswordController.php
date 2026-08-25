<?php

namespace App\Http\Controllers\Auth;

use App\Concerns\PasswordValidationRules;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SetNewPasswordController extends Controller
{
    use PasswordValidationRules;

    /**
     * Show the forced "set a new password" screen for first-time logins.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('auth/set-new-password');
    }

    /**
     * Persist the employee's new password and clear the forced-change flag.
     */
    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => $this->passwordRules(),
        ]);

        /** @var User $user */
        $user = $request->user();

        $user->forceFill([
            'password' => $request->string('password'),
            'must_change_password' => false,
        ])->save();

        return redirect()->route($user->homeRouteName());
    }
}
