<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('name')->nullable()->after('id');
            $table->string('employee_id')->nullable()->unique()->after('role');
            $table->date('birthday')->nullable()->after('employee_id');
            $table->string('phone_number', 30)->nullable()->after('birthday');
            $table->string('job_position')->nullable()->after('phone_number');
            $table->string('profile_photo_path')->nullable()->after('job_position');
            $table->string('status', 20)->default('active')->after('profile_photo_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'name',
                'employee_id',
                'birthday',
                'phone_number',
                'job_position',
                'profile_photo_path',
                'status',
            ]);
        });
    }
};
