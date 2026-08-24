import { Head } from '@inertiajs/react';
import { AdminPlaceholder } from '@/components/admin-placeholder';

export default function Scheduling() {
    return (
        <>
            <Head title="Scheduling" />
            <AdminPlaceholder
                title="Scheduling"
                description="Assign employees to clients, positions, and working hours."
                planned={[
                    'Schedule list: employee, client, job position, working days, start/end time, schedule type, status',
                    'Search by employee name, client, job position, schedule, or employee ID',
                    'Filter by employee, status, day, and work assignment',
                    'Add schedule: select employee and client, working days (Mon–Sun), start/end time, schedule type (flexible/strict), expected working hours, start/end date',
                    'Edit schedule and activate/deactivate schedule',
                ]}
            />
        </>
    );
}

Scheduling.layout = {
    breadcrumbs: [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'Scheduling', href: '/admin/scheduling' },
    ],
};
