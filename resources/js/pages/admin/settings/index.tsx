import { Head } from '@inertiajs/react';
import { AdminPlaceholder } from '@/components/admin-placeholder';

export default function SystemSettings() {
    return (
        <>
            <Head title="System Settings" />
            <AdminPlaceholder
                title="System Settings"
                description="Super Admin access only."
                planned={['Configure system-wide settings, such as per-employee break allowances.']}
            />
        </>
    );
}

SystemSettings.layout = {
    breadcrumbs: [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'System Settings', href: '/admin/settings' },
    ],
};
