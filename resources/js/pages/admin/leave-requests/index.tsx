import { Head } from '@inertiajs/react';
import { AdminPlaceholder } from '@/components/admin-placeholder';

export default function LeaveRequests() {
    return (
        <>
            <Head title="Leave Request Management" />
            <AdminPlaceholder
                title="Leave Request Management"
                description="Super Admin access only."
                planned={[
                    'Review employee leave requests (Pending Approval, Needs Verification, Approved, Rejected)',
                    'Approve, reject, or request verification for leave requests',
                ]}
            />
        </>
    );
}

LeaveRequests.layout = {
    breadcrumbs: [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'Leave Requests', href: '/admin/leave-requests' },
    ],
};
