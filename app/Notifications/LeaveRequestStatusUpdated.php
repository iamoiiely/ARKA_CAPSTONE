<?php

namespace App\Notifications;

use App\Models\LeaveRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class LeaveRequestStatusUpdated extends Notification
{
    use Queueable;

    public function __construct(private readonly LeaveRequest $leaveRequest) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $statusLabel = match ($this->leaveRequest->status) {
            LeaveRequest::STATUS_APPROVED => 'approved',
            LeaveRequest::STATUS_REJECTED => 'rejected',
            LeaveRequest::STATUS_NEEDS_VERIFICATION => 'flagged as needing verification',
            default => $this->leaveRequest->status,
        };

        return [
            'title' => 'Leave request '.$statusLabel,
            'message' => sprintf(
                'Your %s leave request (%s - %s) was %s.',
                $this->leaveRequest->leave_type,
                $this->leaveRequest->start_date->format('M j'),
                $this->leaveRequest->end_date->format('M j'),
                $statusLabel,
            ),
            'url' => route('leave-requests.index'),
        ];
    }
}
