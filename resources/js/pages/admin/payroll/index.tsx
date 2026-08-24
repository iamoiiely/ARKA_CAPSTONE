import { Head } from '@inertiajs/react';
import { AdminPlaceholder } from '@/components/admin-placeholder';

export default function Payroll() {
    return (
        <>
            <Head title="Payroll / Pay Management" />
            <AdminPlaceholder
                title="Payroll / Pay Management"
                description="Super Admin access only."
                planned={['Manage pay rates, pay periods, and payroll processing.']}
            />
        </>
    );
}

Payroll.layout = {
    breadcrumbs: [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'Payroll', href: '/admin/payroll' },
    ],
};
