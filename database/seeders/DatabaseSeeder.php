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
            'name' => 'Super Admin',
            'email' => 'superadmin@arka.test',
            'employee_id' => 'EMP-00001',
        ]);

        User::factory()->admin()->create([
            'name' => 'Admin User',
            'email' => 'admin@arka.test',
            'employee_id' => 'EMP-00002',
        ]);

        User::factory()->create([
            'name' => 'Employee User',
            'email' => 'employee@arka.test',
            'employee_id' => 'EMP-00003',
        ]);
    }
}
