import type { ReactNode } from 'react';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { DashboardSwitcher } from '@/components/dashboard-switcher';
import { EmployeeSidebar } from '@/components/employee-sidebar';
import { LiveClock } from '@/components/live-clock';
import { NotificationBell } from '@/components/notification-bell';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem } from '@/types';

export default function EmployeeLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: ReactNode;
}) {
    return (
        <AppShell variant="sidebar">
            <EmployeeSidebar />
            <AppContent variant="sidebar" className="min-w-0 overflow-x-clip">
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border/50 px-6 md:px-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                    <div className="flex items-center gap-3">
                        <LiveClock />
                        <NotificationBell />
                        <DashboardSwitcher mode="employee" />
                    </div>
                </header>
                {children}
            </AppContent>
        </AppShell>
    );
}
