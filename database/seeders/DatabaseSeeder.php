<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->superAdmin()->create([
            'email' => 'superadmin@arka.test',
        ]);

        User::factory()->admin()->create([
            'email' => 'admin@arka.test',
        ]);

        User::factory()->create([
            'email' => 'employee@arka.test',
        ]);
    }
}
