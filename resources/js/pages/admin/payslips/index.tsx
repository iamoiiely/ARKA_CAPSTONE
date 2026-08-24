import { Head } from '@inertiajs/react';
import { AdminPlaceholder } from '@/components/admin-placeholder';

export default function Payslips() {
    return (
        <>
            <Head title="Payslip Management" />
            <AdminPlaceholder
                title="Payslip Management"
                description="Super Admin access only."
                planned={['Generate, release, and manage employee payslips.']}
            />
        </>
    );
}

Payslips.layout = {
    breadcrumbs: [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'Payslips', href: '/admin/payslips' },
    ],
};
