<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'user_id', 'client_id', 'schedule_id', 'date', 'time_in', 'time_out',
    'break_minutes', 'break_started_at', 'status',
])]
class TimeLog extends Model
{
    use HasFactory;

    public const STATUS_RUNNING = 'running';

    public const STATUS_ON_BREAK = 'on_break';

    public const STATUS_COMPLETED = 'completed';

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
            'time_in' => 'datetime',
            'time_out' => 'datetime',
            'break_started_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Client, $this>
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * @return BelongsTo<Schedule, $this>
     */
    public function schedule(): BelongsTo
    {
        return $this->belongsTo(Schedule::class);
    }

    public function totalMinutes(): int
    {
        $end = $this->time_out ?? now();

        return max(0, $this->time_in->diffInMinutes($end) - $this->break_minutes);
    }
}
