<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'user_id', 'period_start', 'period_end', 'date_issued', 'earnings',
    'gross_pay', 'total_deductions', 'net_pay', 'status',
])]
class Payslip extends Model
{
    use HasFactory;

    public const STATUS_PROCESSING = 'processing';

    public const STATUS_AVAILABLE = 'available';

    protected function casts(): array
    {
        return [
            'period_start' => 'date:Y-m-d',
            'period_end' => 'date:Y-m-d',
            'date_issued' => 'date:Y-m-d',
            'earnings' => 'decimal:2',
            'gross_pay' => 'decimal:2',
            'total_deductions' => 'decimal:2',
            'net_pay' => 'decimal:2',
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
     * @return HasMany<PayslipFlag, $this>
     */
    public function flags(): HasMany
    {
        return $this->hasMany(PayslipFlag::class);
    }
}
