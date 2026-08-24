import { Head } from '@inertiajs/react';
import { AdminPlaceholder } from '@/components/admin-placeholder';

export default function Attendance() {
    return (
        <>
            <Head title="Attendance Management" />
            <AdminPlaceholder
                title="Attendance Management"
                description="Review employee time in/out records and attendance status."
                planned={[
                    'Attendance summary: Present, Late, Absent, On Leave, Incomplete counts',
                    'Attendance list: employee name, date, time in, time out, status',
                    'Search and filter by date range, employee, and attendance status',
                    'View attendance details: employee, date, client, scheduled time, actual time in/out, total hours, status',
                ]}
            />
        </>
    );
}

Attendance.layout = {
    breadcrumbs: [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'Attendance Management', href: '/admin/attendance' },
    ],
};
