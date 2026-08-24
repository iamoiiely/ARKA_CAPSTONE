<?php

namespace App\Http\Requests\Admin;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmployeeRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'birthday' => ['nullable', 'date', 'before:today'],
            'phone_number' => ['nullable', 'string', 'max:30'],
            'job_position' => ['nullable', 'string', 'max:255'],
            'employee_id' => ['nullable', 'string', 'max:255', Rule::unique(User::class)->ignore($this->route('employee'))],
            'role' => ['required', Rule::in([User::ROLE_EMPLOYEE, User::ROLE_ADMIN])],
            'status' => ['required', Rule::in([User::STATUS_ACTIVE, User::STATUS_INACTIVE])],
            'profile_photo' => ['nullable', 'image', 'max:10240'],
        ];
    }
}
