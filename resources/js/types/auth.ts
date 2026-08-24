export type User = {
    id: number;
    name: string | null;
    email: string;
    role: 'employee' | 'admin' | 'super_admin';
    employee_id: string | null;
    birthday: string | null;
    age: number | null;
    phone_number: string | null;
    job_position: string | null;
    profile_photo_path: string | null;
    status: 'active' | 'inactive';
    avatar?: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};


