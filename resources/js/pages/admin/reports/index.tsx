import { Head } from '@inertiajs/react';
import { AdminPlaceholder } from '@/components/admin-placeholder';

export default function Reports() {
    return (
        <>
            <Head title="Reports" />
            <AdminPlaceholder
                title="Reports"
                description="Read-only reports that update automatically from system records."
                planned={[
                    'Attendance report: Present / Late / Absent / Leave totals per employee for a date range',
                    'Leave summary: Paid / Unpaid leave totals per employee for a date range',
                    'Devotional report: Submitted / Not Submitted totals per employee for a date range',
                ]}
            />
        </>
    );
}

Reports.layout = {
    breadcrumbs: [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'Reports', href: '/admin/reports' },
    ],
};
