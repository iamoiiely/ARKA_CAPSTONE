<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaveRequestController extends Controller
{
    public function index(Request $request): Response
    {
        $leaveRequests = LeaveRequest::query()
            ->where('user_id', $request->user()->id)
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->filled('from'), fn ($q) => $q->whereDate('start_date', '>=', $request->date('from')))
            ->when($request->filled('to'), fn ($q) => $q->whereDate('start_date', '<=', $request->date('to')))
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('employee/leave-requests/index', [
            'leaveRequests' => $leaveRequests,
            'filters' => $request->only(['status', 'from', 'to']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'leave_type' => ['required', 'in:paid,unpaid'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'reason' => ['required', 'string', 'max:255'],
            'client_informed' => ['required', 'boolean'],
            'proof' => ['nullable', 'file', 'max:10240'],
        ]);

        $proofPath = null;
        if ($request->hasFile('proof')) {
            $proofPath = $request->file('proof')->store('leave-proofs', 'public');
        }

        $status = ($data['client_informed'] && ! $proofPath)
            ? LeaveRequest::STATUS_NEEDS_VERIFICATION
            : LeaveRequest::STATUS_PENDING;

        LeaveRequest::create([
            'user_id' => $request->user()->id,
            'leave_type' => $data['leave_type'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'reason' => $data['reason'],
            'client_informed' => $data['client_informed'],
            'proof_path' => $proofPath,
            'status' => $status,
        ]);

        return back();
    }

    public function cancel(LeaveRequest $leaveRequest): RedirectResponse
    {
        if ($leaveRequest->user_id !== request()->user()->id) {
            abort(403);
        }

        if (! in_array($leaveRequest->status, [LeaveRequest::STATUS_PENDING, LeaveRequest::STATUS_NEEDS_VERIFICATION], true)) {
            abort(422);
        }

        $leaveRequest->update(['status' => LeaveRequest::STATUS_CANCELLED]);

        return back();
    }
}
