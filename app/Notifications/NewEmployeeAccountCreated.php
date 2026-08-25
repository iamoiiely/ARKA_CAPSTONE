<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewEmployeeAccountCreated extends Notification
{
    use Queueable;

    public function __construct(private readonly User $employee) {}

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
            'title' => 'New employee account created',
            'message' => "{$this->employee->name} ({$this->employee->employee_no}) is awaiting their first login.",
            'url' => route('admin.employees.show', $this->employee),
        ];
    }
}
