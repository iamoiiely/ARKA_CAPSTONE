<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Payslip;
use App\Models\User;
use App\Notifications\PayslipReleased;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PayslipController extends Controller
{
    public function index(Request $request): Response
    {
        $payslips = Payslip::query()
            ->with('user')
            ->when($request->filled('employee_id'), fn ($q) => $q->where('user_id', $request->integer('employee_id')))
            ->orderByDesc('period_start')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('super-admin/payslip-management/index', [
            'payslips' => $payslips,
            'filters' => $request->only(['employee_id']),
            'employees' => User::query()->whereIn('role', ['employee', 'admin'])->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('super-admin/payslip-management/create', [
            'employees' => User::query()->whereIn('role', ['employee', 'admin'])->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'period_start' => ['required', 'date'],
            'period_end' => ['required', 'date', 'after_or_equal:period_start'],
            'earnings' => ['required', 'numeric', 'min:0'],
            'total_deductions' => ['required', 'numeric', 'min:0'],
        ]);

        $grossPay = $data['earnings'];
        $netPay = $grossPay - $data['total_deductions'];

        $payslip = Payslip::create([
            'user_id' => $data['user_id'],
            'period_start' => $data['period_start'],
            'period_end' => $data['period_end'],
            'date_issued' => now()->toDateString(),
            'earnings' => $data['earnings'],
            'gross_pay' => $grossPay,
            'total_deductions' => $data['total_deductions'],
            'net_pay' => $netPay,
            'status' => Payslip::STATUS_AVAILABLE,
        ]);

        $payslip->user->notify(new PayslipReleased($payslip));

        return to_route('admin.payslip-management.index');
    }
}
