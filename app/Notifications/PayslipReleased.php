<?php

namespace App\Notifications;

use App\Models\Payslip;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class PayslipReleased extends Notification
{
    use Queueable;

    public function __construct(private readonly Payslip $payslip) {}

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
            'title' => 'Payslip released',
            'message' => sprintf(
                'Your payslip for %s - %s is now available.',
                $this->payslip->period_start->format('M j'),
                $this->payslip->period_end->format('M j'),
            ),
            'url' => route('payslips.show', $this->payslip),
        ];
    }
}
