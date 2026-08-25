import { Head, Link, usePage } from '@inertiajs/react';
import { PageHeader } from '@/components/page-header';
import { StatTile } from '@/components/stat-tile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard as adminDashboard } from '@/routes/admin';
import attendance from '@/routes/admin/attendance';
import devotionals from '@/routes/admin/devotionals';
import employees from '@/routes/admin/employees';
import type { Auth } from '@/types';

type Props = {
    employeeOverview: { active: number; inactive: number; newThisWeek: number };
    todaysAttendance: {
        present: number;
        late: number;
        absent: number;
        incomplete: number;
    };
    incompleteAlerts: {
        id: number;
        employee: string;
        time_in: string | null;
    }[];
    activeSchedulesToday: { count: number; byClient: Record<string, number> };
    pendingDevotionals: number;
    recentNotifications: {
        id: string;
        data: { title: string; message: string };
        created_at: string;
    }[];
};

export default function AdminDashboard({
    employeeOverview,
    todaysAttendance,
    incompleteAlerts,
    activeSchedulesToday,
    pendingDevotionals,
    recentNotifications,
}: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const hour = new Date().getHours();
    const greeting =
        hour < 12
            ? 'Good morning'
            : hour < 18
              ? 'Good afternoon'
              : 'Good evening';

    const summaryParts: string[] = [];

    if (incompleteAlerts.length > 0) {
        summaryParts.push(
            `${incompleteAlerts.length} attendance record${incompleteAlerts.length === 1 ? '' : 's'} need${incompleteAlerts.length === 1 ? 's' : ''} a correction.`,
        );
    }

    if (pendingDevotionals > 0) {
        summaryParts.push(
            `${pendingDevotionals} employee${pendingDevotionals === 1 ? '' : 's'} haven't submitted today's devotional.`,
        );
    }

    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader eyebrow="Admin Dashboard" title="Home" />

                <div>
                    <p className="text-lg font-medium">
                        {greeting}, {auth.user.name.split(' ')[0]}.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {summaryParts.length > 0
                            ? summaryParts.join(' ')
                            : 'Everything looks on track today.'}
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="rounded-none md:col-span-2">
                        <CardHeader>
                            <CardTitle>Employee Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-3 gap-3">
                            <StatTile
                                label="Active"
                                value={employeeOverview.active}
                            />
                            <StatTile
                                label="Inactive"
                                value={employeeOverview.inactive}
                            />
                            <StatTile
                                label="New this week"
                                value={employeeOverview.newThisWeek}
                            />
                        </CardContent>
                        <CardContent>
                            <Link
                                href={employees.index()}
                                className="text-sm text-primary hover:underline"
                            >
                                View all →
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>Today's Attendance Snapshot</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            <StatTile
                                label="Present"
                                value={todaysAttendance.present}
                            />
                            <StatTile
                                label="Late"
                                value={todaysAttendance.late}
                            />
                            <StatTile
                                label="Absent"
                                value={todaysAttendance.absent}
                            />
                            <StatTile
                                label="Incomplete"
                                value={todaysAttendance.incomplete}
                            />
                        </CardContent>
                        <CardContent>
                            <Link
                                href={attendance.index()}
                                className="text-sm text-primary hover:underline"
                            >
                                View details →
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>Incomplete Attendance Alerts</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {incompleteAlerts.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    No missing clock-outs today.
                                </p>
                            )}
                            {incompleteAlerts.map((a) => (
                                <div
                                    key={a.id}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <span>{a.employee}</span>
                                    <Link
                                        href={attendance.show(a.id)}
                                        className="text-primary hover:underline"
                                    >
                                        Fix this
                                    </Link>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>Active Schedules Today</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-2xl font-semibold">
                                {activeSchedulesToday.count}
                            </p>
                            {Object.entries(activeSchedulesToday.byClient).map(
                                ([client, count]) => (
                                    <div
                                        key={client}
                                        className="flex items-center justify-between text-sm text-muted-foreground"
                                    >
                                        <span>{client}</span>
                                        <span>{count}</span>
                                    </div>
                                ),
                            )}
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>Pending Devotionals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold">
                                {pendingDevotionals}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                not yet submitted today
                            </p>
                        </CardContent>
                        <CardContent>
                            <Link
                                href={devotionals.index()}
                                className="text-sm text-primary hover:underline"
                            >
                                View list →
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                <Card className="rounded-none">
                    <CardHeader>
                        <CardTitle>Recent Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {recentNotifications.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                Nothing new.
                            </p>
                        )}
                        {recentNotifications.map((n) => (
                            <div
                                key={n.id}
                                className="border-b pb-2 text-sm last:border-b-0"
                            >
                                <p className="font-medium">{n.data.title}</p>
                                <p className="text-muted-foreground">
                                    {n.data.message}
                                </p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: adminDashboard() }],
};
