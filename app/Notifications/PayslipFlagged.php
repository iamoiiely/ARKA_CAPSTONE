<?php

namespace App\Notifications;

use App\Models\PayslipFlag;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class PayslipFlagged extends Notification
{
    use Queueable;

    public function __construct(private readonly PayslipFlag $flag) {}

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
            'title' => 'Payslip issue flagged',
            'message' => "{$this->flag->user->name} flagged an issue with a payslip: {$this->flag->reason}.",
            'url' => route('admin.reports.index'),
        ];
    }
}
