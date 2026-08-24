<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if ($user && in_array($user->role, $roles, true)) {
            return $next($request);
        }

        $fallback = $user && $user->canAccessAdminDashboard()
            ? route('admin.dashboard')
            : route('dashboard');

        return redirect($fallback)->with('error', 'You do not have access to that page.');
    }
}
