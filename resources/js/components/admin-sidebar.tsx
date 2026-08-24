import { Link, usePage } from '@inertiajs/react';
import {
    Banknote,
    CalendarClock,
    ClipboardList,
    FileText,
    LayoutGrid,
    Receipt,
    Settings,
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
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid },
    { title: 'Employee Management', href: '/admin/employees', icon: Users },
    { title: 'Scheduling', href: '/admin/scheduling', icon: CalendarClock },
    { title: 'Attendance Management', href: '/admin/attendance', icon: ClipboardList },
    { title: 'Devotional Management', href: '/admin/devotional', icon: FileText },
    { title: 'Reports', href: '/admin/reports', icon: FileText },
];

const superAdminNavItems: NavItem[] = [
    { title: 'Leave Requests', href: '/admin/leave-requests', icon: ClipboardList },
    { title: 'Payroll', href: '/admin/payroll', icon: Banknote },
    { title: 'Payslips', href: '/admin/payslips', icon: Receipt },
    { title: 'System Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
    const { auth } = usePage().props;
    const isSuperAdmin = auth.user?.role === 'super_admin';
    const isAdmin = auth.user?.role === 'admin';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    {isAdmin && (
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={{ children: 'Switch to Employee Dashboard' }}>
                                <Link href="/dashboard" prefetch>
                                    <span>Switch to Employee Dashboard</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                {isSuperAdmin && <NavMain items={superAdminNavItems} />}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
