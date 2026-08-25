<?php

namespace App\Notifications;

use App\Models\AttendanceCorrection;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AttendanceCorrectionReviewed extends Notification
{
    use Queueable;

    public function __construct(private readonly AttendanceCorrection $correction) {}

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
        return [
            'title' => 'Attendance correction '.$this->correction->status,
            'message' => sprintf(
                'Your correction request for %s was %s.',
                $this->correction->date->format('M j, Y'),
                $this->correction->status,
            ),
            'url' => route('attendance.index'),
        ];
    }
}
