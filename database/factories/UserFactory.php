<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $sequence = mt_rand(1000, 999999);

        return [
            'employee_no' => 'EMP-'.$sequence,
            'name' => 'User '.$sequence,
            'email' => 'user'.$sequence.'@arka.test',
            'password' => static::$password ??= Hash::make('password'),
            'role' => User::ROLE_EMPLOYEE,
            'birthday' => now()->subYears(25)->subDays($sequence % 3650),
            'phone' => '09'.str_pad((string) ($sequence % 1_000_000_000), 9, '0', STR_PAD_LEFT),
            'status' => User::STATUS_ACTIVE,
            'must_change_password' => false,
            'break_allowance_minutes' => 45,
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the user is an admin.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => User::ROLE_ADMIN,
        ]);
    }

    /**
     * Indicate that the user is a super admin.
     */
    public function superAdmin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => User::ROLE_SUPER_ADMIN,
        ]);
    }

    /**
     * Indicate that the user must change their password on next login.
     */
    public function mustChangePassword(): static
    {
        return $this->state(fn (array $attributes) => [
            'must_change_password' => true,
        ]);
    }

    /**
     * Indicate that the user's account is deactivated.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => User::STATUS_INACTIVE,
        ]);
    }
}
