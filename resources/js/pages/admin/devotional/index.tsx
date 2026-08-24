import { Head } from '@inertiajs/react';
import { AdminPlaceholder } from '@/components/admin-placeholder';

export default function DevotionalManagement() {
    return (
        <>
            <Head title="Devotional Management" />
            <AdminPlaceholder
                title="Devotional Management"
                description="Track daily devotional submissions across all employees."
                planned={[
                    'Devotional list: employee name, date, devotional title, status (Submitted / Not Submitted)',
                    'Search and filter',
                    'View devotional (uploaded file)',
                    'Devotional summary card and per-employee devotional history',
                ]}
            />
        </>
    );
}

DevotionalManagement.layout = {
    breadcrumbs: [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'Devotional Management', href: '/admin/devotional' },
    ],
};
