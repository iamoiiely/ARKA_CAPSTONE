import { Head, Link } from '@inertiajs/react';
import { Banknote, CalendarClock, ClipboardList, FileText, Receipt, Settings, Users } from 'lucide-react';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Stats = {
    totalEmployees: number;
    totalAdmins: number;
    activeAccounts: number;
    inactiveAccounts: number;
};

export default function AdminDashboard({ stats }: { stats: Stats }) {
    const statTiles = [
        { label: 'Employees', value: stats.totalEmployees },
        { label: 'Admins', value: stats.totalAdmins },
        { label: 'Active Accounts', value: stats.activeAccounts },
        { label: 'Inactive Accounts', value: stats.inactiveAccounts },
    ];

    const quickLinks = [
        { title: 'Employee Management', description: 'Add, search, and manage employee accounts.', href: '/admin/employees', icon: Users },
        { title: 'Scheduling', description: 'Assign clients, shifts, and working hours.', href: '/admin/scheduling', icon: CalendarClock },
        { title: 'Attendance Management', href: '/admin/attendance', description: 'Review time in/out records and statuses.', icon: ClipboardList },
        { title: 'Devotional Management', href: '/admin/devotional', description: 'Track daily devotional submissions.', icon: FileText },
        { title: 'Reports', href: '/admin/reports', description: 'Generate attendance, leave, and devotional reports.', icon: FileText },
    ];

    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <Heading
                    title="Admin Dashboard"
                    description="Overview of your organization's employees and activity."
                />

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statTiles.map((tile) => (
                        <Card key={tile.label}>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {tile.label}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-semibold">{tile.value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {quickLinks.map((link) => (
                        <Link key={link.href} href={link.href} prefetch>
                            <Card className="h-full transition-colors hover:border-primary/50">
                                <CardHeader>
                                    <link.icon className="mb-2 size-6 text-muted-foreground" />
                                    <CardTitle>{link.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {link.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [{ title: 'Admin Dashboard', href: '/admin/dashboard' }],
};
