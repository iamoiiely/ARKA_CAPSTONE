<?php

namespace App\Http\Responses;

use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        /** @var User $user */
        $user = $request->user();

        if ($user->must_change_password) {
            return redirect()->route('password.set-new');
        }

        return redirect()->intended(route($user->homeRouteName()));
    }
}
