<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'attendance_id', 'user_id', 'date', 'source', 'field_corrected',
    'original_time_in', 'original_time_out', 'requested_time_in', 'requested_time_out',
    'reason', 'status', 'reviewed_by', 'reviewed_at',
])]
class AttendanceCorrection extends Model
{
    use HasFactory;

    public const SOURCE_ADMIN = 'admin';

    public const SOURCE_EMPLOYEE = 'employee';

    public const STATUS_PENDING = 'pending';

    public const STATUS_APPROVED = 'approved';

    public const STATUS_REJECTED = 'rejected';

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
            'reviewed_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Attendance, $this>
     */
    public function attendance(): BelongsTo
    {
        return $this->belongsTo(Attendance::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
