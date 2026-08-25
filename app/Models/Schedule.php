<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'user_id', 'client_id', 'job_position', 'working_days', 'start_time', 'end_time',
    'schedule_type', 'expected_working_hours', 'start_date', 'end_date', 'status',
])]
class Schedule extends Model
{
    use HasFactory;

    public const TYPE_FLEXIBLE = 'flexible';

    public const TYPE_STRICT = 'strict';

    public const STATUS_ACTIVE = 'active';

    public const STATUS_INACTIVE = 'inactive';

    protected function casts(): array
    {
        return [
            'working_days' => 'array',
            'start_date' => 'date:Y-m-d',
            'end_date' => 'date:Y-m-d',
            'expected_working_hours' => 'decimal:2',
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
     * Whether this schedule's days/times overlap with the given days/times.
     *
     * @param  array<int, string>  $days
     */
    public function overlapsWith(array $days, string $startTime, string $endTime): bool
    {
        if (empty(array_intersect($this->working_days, $days))) {
            return false;
        }

        return $startTime < $this->end_time && $endTime > $this->start_time;
    }
}
