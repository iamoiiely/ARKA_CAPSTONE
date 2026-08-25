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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('employee_no')->unique();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('role', 25);
            $table->date('birthday')->nullable();
            $table->string('phone')->nullable();
            $table->string('photo_path')->nullable();
            $table->string('status', 20)->default('active');
            $table->boolean('must_change_password')->default(false);
            $table->unsignedInteger('break_allowance_minutes')->default(45);
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
