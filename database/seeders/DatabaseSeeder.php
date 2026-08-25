<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\AttendanceCorrection;
use App\Models\Client;
use App\Models\Devotional;
use App\Models\LeaveRequest;
use App\Models\Payslip;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $superAdmin = User::factory()->superAdmin()->create([
            'employee_no' => 'EMP-0001',
            'name' => 'Sofia Reyes',
            'email' => 'superadmin@arka.test',
        ]);

        $admin = User::factory()->admin()->create([
            'employee_no' => 'EMP-0002',
            'name' => 'Marco Villanueva',
            'email' => 'admin@arka.test',
        ]);

        $employees = collect([
            ['name' => 'Elena Cruz', 'email' => 'elena.cruz@arka.test'],
            ['name' => 'Jose Ramirez', 'email' => 'jose.ramirez@arka.test'],
            ['name' => 'Anna Bautista', 'email' => 'anna.bautista@arka.test'],
            ['name' => 'Carlo Santos', 'email' => 'carlo.santos@arka.test'],
        ])->map(fn (array $data, int $i) => User::factory()->create([
            'employee_no' => 'EMP-'.str_pad((string) ($i + 3), 4, '0', STR_PAD_LEFT),
            'name' => $data['name'],
            'email' => $data['email'],
        ]));

        // A freshly-added employee awaiting their forced first-login password change.
        $newHire = User::factory()->mustChangePassword()->create([
            'employee_no' => 'EMP-0007',
            'name' => 'Diego Fernandez',
            'email' => 'diego.fernandez@arka.test',
        ]);

        User::factory()->inactive()->create([
            'employee_no' => 'EMP-0008',
            'name' => 'Retired Account',
            'email' => 'inactive@arka.test',
        ]);

        $clients = collect(['Northbridge Logistics', 'Camden Retail Group', 'Solara Health Clinic'])
            ->map(fn (string $name) => Client::create(['name' => $name]));

        $jobPositions = ['Warehouse Associate', 'Customer Service Rep', 'Front Desk Assistant'];
        $workingDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

        $employees->push($newHire)->each(function (User $employee, int $i) use ($clients, $jobPositions, $workingDays) {
            $schedule = Schedule::create([
                'user_id' => $employee->id,
                'client_id' => $clients[$i % $clients->count()]->id,
                'job_position' => $jobPositions[$i % count($jobPositions)],
                'working_days' => $workingDays,
                'start_time' => '09:00',
                'end_time' => '17:00',
                'schedule_type' => Schedule::TYPE_FLEXIBLE,
                'expected_working_hours' => 8,
                'start_date' => Carbon::now()->subMonths(2),
                'status' => Schedule::STATUS_ACTIVE,
            ]);

            // Two weeks of attendance history.
            for ($day = 14; $day >= 1; $day--) {
                $date = Carbon::now()->subDays($day);

                if ($date->isWeekend()) {
                    continue;
                }

                $roll = ($i + $day) % 10;
                $timeIn = $date->copy()->setTime(9, $roll < 2 ? 20 : 0);
                $timeOut = $roll === 3 ? null : $date->copy()->setTime(17, 0);

                $attendance = Attendance::create([
                    'user_id' => $employee->id,
                    'date' => $date->toDateString(),
                    'time_in' => $timeIn,
                    'time_out' => $timeOut,
                    'break_minutes' => 30,
                    'status' => match (true) {
                        $timeOut === null => Attendance::STATUS_INCOMPLETE,
                        $roll < 2 => Attendance::STATUS_LATE,
                        default => Attendance::STATUS_PRESENT,
                    },
                ]);

                if ($roll === 3) {
                    AttendanceCorrection::create([
                        'attendance_id' => $attendance->id,
                        'user_id' => $employee->id,
                        'date' => $date->toDateString(),
                        'source' => AttendanceCorrection::SOURCE_EMPLOYEE,
                        'field_corrected' => 'time_out',
                        'original_time_in' => $timeIn->format('H:i'),
                        'original_time_out' => null,
                        'requested_time_in' => $timeIn->format('H:i'),
                        'requested_time_out' => '17:00',
                        'reason' => 'Forgot to clock out, left on time as scheduled.',
                        'status' => AttendanceCorrection::STATUS_PENDING,
                    ]);
                }
            }

            // Devotional submissions for most of the last 7 days.
            for ($day = 7; $day >= 1; $day--) {
                if ($day === 2) {
                    continue;
                }

                $date = Carbon::now()->subDays($day);

                Devotional::create([
                    'user_id' => $employee->id,
                    'date' => $date->toDateString(),
                    'title' => 'Daily Reflection - '.$date->format('M j'),
                    'file_path' => 'devotionals/sample.pdf',
                    'file_name' => 'devotional-'.$date->toDateString().'.pdf',
                    'file_size' => 245_000,
                    'submitted_at' => $date->copy()->setTime(8, 15),
                ]);
            }

            LeaveRequest::create([
                'user_id' => $employee->id,
                'leave_type' => $i % 2 === 0 ? LeaveRequest::TYPE_PAID : LeaveRequest::TYPE_UNPAID,
                'start_date' => Carbon::now()->addDays(5 + $i)->toDateString(),
                'end_date' => Carbon::now()->addDays(6 + $i)->toDateString(),
                'reason' => 'Family Matter',
                'client_informed' => $i % 2 === 0,
                'status' => LeaveRequest::STATUS_PENDING,
            ]);

            foreach ([1, 2] as $periodsAgo) {
                $periodStart = Carbon::now()->startOfMonth()->subMonths($periodsAgo - 1)->subDays($periodsAgo === 1 ? 0 : 15);
                Payslip::create([
                    'user_id' => $employee->id,
                    'period_start' => $periodStart->toDateString(),
                    'period_end' => $periodStart->copy()->addDays(14)->toDateString(),
                    'date_issued' => $periodStart->copy()->addDays(16)->toDateString(),
                    'earnings' => 18500,
                    'gross_pay' => 18500,
                    'total_deductions' => 1850,
                    'net_pay' => 16650,
                    'status' => Payslip::STATUS_AVAILABLE,
                ]);
            }
        });

        $this->command?->info('Seeded ARKA demo data.');
        $this->command?->info('Super Admin: superadmin@arka.test / password');
        $this->command?->info('Admin: admin@arka.test / password');
        $this->command?->info('Employee: elena.cruz@arka.test / password');
        $this->command?->info('New hire (forced password change): diego.fernandez@arka.test / password');
    }
}
