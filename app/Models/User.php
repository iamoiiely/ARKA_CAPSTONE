<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string|null $name
 * @property string $email
 * @property string $password
 * @property string $role
 * @property string|null $employee_id
 * @property Carbon|null $birthday
 * @property string|null $phone_number
 * @property string|null $job_position
 * @property string|null $profile_photo_path
 * @property string $status
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'password', 'role', 'employee_id', 'birthday', 'phone_number', 'job_position', 'profile_photo_path', 'status'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    public const ROLE_EMPLOYEE = 'employee';

    public const ROLE_ADMIN = 'admin';

    public const ROLE_SUPER_ADMIN = 'super_admin';

    public const STATUS_ACTIVE = 'active';

    public const STATUS_INACTIVE = 'inactive';

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = ['age'];

    /**
     * The roles that grant access to the admin dashboard.
     *
     * @return array<int, string>
     */
    public static function adminRoles(): array
    {
        return [self::ROLE_ADMIN, self::ROLE_SUPER_ADMIN];
    }

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === self::ROLE_SUPER_ADMIN;
    }

    public function canAccessAdminDashboard(): bool
    {
        return in_array($this->role, self::adminRoles(), true);
    }

    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    /**
     * The user's age, derived from their birthday.
     */
    protected function age(): Attribute
    {
        return Attribute::make(
            get: fn (): ?int => $this->birthday?->age,
        );
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'birthday' => 'date:Y-m-d',
        ];
    }
}
