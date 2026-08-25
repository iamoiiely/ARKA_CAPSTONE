<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Payslip;
use App\Models\PayslipFlag;
use App\Models\User;
use App\Notifications\PayslipFlagged;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use Inertia\Response;

class PayslipController extends Controller
{
    public function index(Request $request): Response
    {
        $payslips = Payslip::query()
            ->where('user_id', $request->user()->id)
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->filled('from'), fn ($q) => $q->whereDate('period_start', '>=', $request->date('from')))
            ->when($request->filled('to'), fn ($q) => $q->whereDate('period_end', '<=', $request->date('to')))
            ->orderByDesc('period_start')
            ->paginate(15)
            ->withQueryString();

        $latest = Payslip::query()
            ->where('user_id', $request->user()->id)
            ->orderByDesc('period_start')
            ->first();

        return Inertia::render('employee/payslips/index', [
            'payslips' => $payslips,
            'latest' => $latest,
            'filters' => $request->only(['status', 'from', 'to']),
        ]);
    }

    public function show(Request $request, Payslip $payslip): Response
    {
        if ($payslip->user_id !== $request->user()->id) {
            abort(403);
        }

        return Inertia::render('employee/payslips/show', [
            'payslip' => $payslip->load('user'),
        ]);
    }

    public function flag(Request $request, Payslip $payslip): RedirectResponse
    {
        if ($payslip->user_id !== $request->user()->id) {
            abort(403);
        }

        $data = $request->validate([
            'reason' => ['required', 'string', 'max:255'],
            'note' => ['nullable', 'string', 'max:1000'],
        ]);

        $flag = PayslipFlag::create([
            'payslip_id' => $payslip->id,
            'user_id' => $request->user()->id,
            'reason' => $data['reason'],
            'note' => $data['note'] ?? null,
            'status' => PayslipFlag::STATUS_OPEN,
        ]);

        $admins = User::query()->whereIn('role', ['admin', 'super_admin'])->get();
        Notification::send($admins, new PayslipFlagged($flag));

        return back();
    }
}
