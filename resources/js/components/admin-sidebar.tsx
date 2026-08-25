import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    BookOpen,
    CalendarCheck,
    CalendarClock,
    ClipboardList,
    CreditCard,
    LayoutGrid,
    UserRound,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes/admin';
import attendance from '@/routes/admin/attendance';
import devotionals from '@/routes/admin/devotionals';
import employees from '@/routes/admin/employees';
import leaveManagement from '@/routes/admin/leave-management';
import payslipManagement from '@/routes/admin/payslip-management';
import reports from '@/routes/admin/reports';
import schedules from '@/routes/admin/schedules';
import { edit } from '@/routes/profile';
import type { NavItem } from '@/types';

export function AdminSidebar() {
    const { auth } = usePage().props;
    const isSuperAdmin = auth.user.role === 'super_admin';

    const mainNavItems: NavItem[] = [
        { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
        { title: 'Employee Management', href: employees.index(), icon: Users },
        { title: 'Scheduling', href: schedules.index(), icon: CalendarClock },
        {
            title: 'Attendance Management',
            href: attendance.index(),
            icon: CalendarCheck,
        },
        {
            title: 'Devotional Management',
            href: devotionals.index(),
            icon: BookOpen,
        },
        { title: 'Reports', href: reports.index(), icon: BarChart3 },
        { title: 'Profile', href: edit(), icon: UserRound },
    ];

    const superAdminNavItems: NavItem[] = [
        {
            title: 'Leave Request Management',
            href: leaveManagement.index(),
            icon: ClipboardList,
        },
        {
            title: 'Payslip Management',
            href: payslipManagement.index(),
            icon: CreditCard,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                {isSuperAdmin && (
                    <NavMain items={superAdminNavItems} label="Super Admin" />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
