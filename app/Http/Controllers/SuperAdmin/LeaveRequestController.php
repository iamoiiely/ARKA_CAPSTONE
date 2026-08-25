<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use App\Notifications\LeaveRequestStatusUpdated;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaveRequestController extends Controller
{
    public function index(Request $request): Response
    {
        $leaveRequests = LeaveRequest::query()
            ->with('user')
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->filled('employee_id'), fn ($q) => $q->where('user_id', $request->integer('employee_id')))
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('super-admin/leave-management/index', [
            'leaveRequests' => $leaveRequests,
            'filters' => $request->only(['status', 'employee_id']),
        ]);
    }

    public function review(Request $request, LeaveRequest $leaveRequest): RedirectResponse
    {
        $data = $request->validate([
            'decision' => ['required', 'in:approved,rejected'],
        ]);

        $leaveRequest->update([
            'status' => $data['decision'],
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        $leaveRequest->user->notify(new LeaveRequestStatusUpdated($leaveRequest));

        return back();
    }
}
