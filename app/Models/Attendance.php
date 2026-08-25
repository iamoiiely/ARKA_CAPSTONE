<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['user_id', 'date', 'time_in', 'time_out', 'break_minutes', 'status', 'leave_type'])]
class Attendance extends Model
{
    use HasFactory;

    public const STATUS_PRESENT = 'present';

    public const STATUS_LATE = 'late';

    public const STATUS_ABSENT = 'absent';

    public const STATUS_LEAVE = 'leave';

    public const STATUS_INCOMPLETE = 'incomplete';

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
            'time_in' => 'datetime',
            'time_out' => 'datetime',
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
     * @return HasMany<AttendanceCorrection, $this>
     */
    public function corrections(): HasMany
    {
        return $this->hasMany(AttendanceCorrection::class);
    }

    public function totalHours(): ?float
    {
        if (! $this->time_in || ! $this->time_out) {
            return null;
        }

        return round(max(0, $this->time_in->diffInMinutes($this->time_out) - $this->break_minutes) / 60, 2);
    }
}
