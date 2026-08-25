import { usePage } from '@inertiajs/react';
import { AdminSidebar } from '@/components/admin-sidebar';
import { EmployeeSidebar } from '@/components/employee-sidebar';

/**
 * Used only by shared, role-agnostic pages (settings, notifications) so they
 * still show the sidebar that matches the signed-in user's role.
 */
export function AppSidebar() {
    const { auth } = usePage().props;

    return auth.user.role === 'employee' ? (
        <EmployeeSidebar />
    ) : (
        <AdminSidebar />
    );
}
