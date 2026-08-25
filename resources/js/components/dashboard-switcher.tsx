import { Link, usePage } from '@inertiajs/react';
import { ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { dashboard as adminDashboard } from '@/routes/admin';

/**
 * Admin-only toggle between the Admin Dashboard and this admin's own
 * Employee Dashboard view, in the same authenticated session. Super Admin
 * has no Employee Dashboard access, so it never renders for that role.
 */
export function DashboardSwitcher({ mode }: { mode: 'admin' | 'employee' }) {
    const { auth } = usePage().props;

    if (auth.user.role !== 'admin') {
        return null;
    }

    return (
        <Button variant="outline" size="sm" className="rounded-none" asChild>
            <Link href={mode === 'admin' ? dashboard() : adminDashboard()}>
                <ArrowLeftRight className="size-4" strokeWidth={1.5} />
                {mode === 'admin'
                    ? 'Switch to Employee View'
                    : 'Switch to Admin View'}
            </Link>
        </Button>
    );
}
