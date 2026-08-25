import { Link } from '@inertiajs/react';
import {
    BookOpen,
    CalendarCheck,
    Clock,
    CreditCard,
    LayoutGrid,
    Palmtree,
    UserRound,
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
import { dashboard } from '@/routes';
import attendance from '@/routes/attendance';
import devotional from '@/routes/devotional';
import leaveRequests from '@/routes/leave-requests';
import payslips from '@/routes/payslips';
import { edit } from '@/routes/profile';
import timeTracker from '@/routes/time-tracker';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
    { title: 'Time Tracker', href: timeTracker.index(), icon: Clock },
    { title: 'Devotional', href: devotional.index(), icon: BookOpen },
    {
        title: 'Attendance Summary',
        href: attendance.index(),
        icon: CalendarCheck,
    },
    { title: 'Leave Request', href: leaveRequests.index(), icon: Palmtree },
    { title: 'Payslip', href: payslips.index(), icon: CreditCard },
    { title: 'Profile', href: edit(), icon: UserRound },
];

export function EmployeeSidebar() {
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
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
