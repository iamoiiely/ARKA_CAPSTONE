export type User = {
    id: number;
    employee_no: string;
    name: string;
    email: string;
    role: 'employee' | 'admin' | 'super_admin';
    birthday?: string | null;
    age?: number | null;
    phone?: string | null;
    photo_path?: string | null;
    status: 'active' | 'inactive';
    must_change_password: boolean;
    avatar?: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type AppNotification = {
    id: string;
    type: string;
    data: {
        title: string;
        message: string;
        url?: string;
    };
    read_at: string | null;
    created_at: string;
};
