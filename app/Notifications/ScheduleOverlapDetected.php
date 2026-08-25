<?php

namespace App\Notifications;

use App\Models\Schedule;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ScheduleOverlapDetected extends Notification
{
    use Queueable;

    public function __construct(private readonly Schedule $schedule) {}

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
            'title' => 'Schedule overlap detected',
            'message' => "{$this->schedule->user->name}'s new schedule overlaps with an existing active schedule.",
            'url' => route('admin.schedules.index'),
        ];
    }
}
