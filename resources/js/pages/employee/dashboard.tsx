import { Head, Link, usePage } from '@inertiajs/react';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';
import devotional from '@/routes/devotional';
import leaveRequests from '@/routes/leave-requests';
import payslips from '@/routes/payslips';
import timeTracker from '@/routes/time-tracker';
import type { Auth, BreadcrumbItem } from '@/types';

type Props = {
    activeTimers: {
        count: number;
        totalMinutesToday: number;
        timers: { id: number; client: { name: string }; status: string }[];
    };
    todaysWorkStatus: {
        id: number;
        client: { name: string };
        status: string;
    }[];
    attendanceSummary: {
        present: number;
        late: number;
        absent: number;
        overtime: number;
    };
    pendingLeaveRequest: {
        id: number;
        leave_type: string;
        status: string;
        start_date: string;
        end_date: string;
    } | null;
    latestPayslip: {
        id: number;
        period_start: string;
        period_end: string;
        net_pay: string;
    } | null;
    devotional: { submittedToday: boolean; compliance: string };
};

export default function EmployeeDashboard({
    activeTimers,
    todaysWorkStatus,
    attendanceSummary,
    pendingLeaveRequest,
    latestPayslip,
    devotional: devotionalStatus,
}: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const hour = new Date().getHours();
    const greeting =
        hour < 12
            ? 'Good morning'
            : hour < 18
              ? 'Good afternoon'
              : 'Good evening';

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader eyebrow="Employee Dashboard" title="Home" />
                <p className="-mt-4 text-sm text-muted-foreground">
                    {greeting}, {auth.user.name.split(' ')[0]}.
                </p>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>Active Time Tracker</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold">
                                {activeTimers.count} running
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {Math.round(
                                    (activeTimers.totalMinutesToday / 60) * 10,
                                ) / 10}
                                h today
                            </p>
                            <Link
                                href={timeTracker.index()}
                                className="mt-2 inline-block text-sm text-primary hover:underline"
                            >
                                Open Time Tracker →
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>Today's Work Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            {todaysWorkStatus.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    No sessions started today.
                                </p>
                            )}
                            {todaysWorkStatus.map((log) => (
                                <div
                                    key={log.id}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <span>{log.client.name}</span>
                                    <StatusBadge status={log.status} />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>Quick Attendance Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                Present{' '}
                                <span className="float-right font-medium">
                                    {attendanceSummary.present}
                                </span>
                            </div>
                            <div>
                                Late{' '}
                                <span className="float-right font-medium">
                                    {attendanceSummary.late}
                                </span>
                            </div>
                            <div>
                                Absent{' '}
                                <span className="float-right font-medium">
                                    {attendanceSummary.absent}
                                </span>
                            </div>
                            <div>
                                Overtime{' '}
                                <span className="float-right font-medium">
                                    {attendanceSummary.overtime}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>Pending Leave Request</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {pendingLeaveRequest ? (
                                <>
                                    <p className="text-sm">
                                        {pendingLeaveRequest.start_date} –{' '}
                                        {pendingLeaveRequest.end_date}
                                    </p>
                                    <StatusBadge
                                        status={pendingLeaveRequest.status}
                                        className="mt-1"
                                    />
                                </>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No leave requests yet.
                                </p>
                            )}
                            <Link
                                href={leaveRequests.index()}
                                className="mt-2 block text-sm text-primary hover:underline"
                            >
                                View leave requests →
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>Latest Payslip</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {latestPayslip ? (
                                <>
                                    <p className="text-sm">
                                        {latestPayslip.period_start} –{' '}
                                        {latestPayslip.period_end}
                                    </p>
                                    <p className="text-lg font-semibold">
                                        ₱
                                        {Number(
                                            latestPayslip.net_pay,
                                        ).toLocaleString()}
                                    </p>
                                    <Link
                                        href={payslips.show(latestPayslip.id)}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        View →
                                    </Link>
                                </>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No payslips yet.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>Devotional Submission Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <StatusBadge
                                status={
                                    devotionalStatus.submittedToday
                                        ? 'submitted'
                                        : 'pending'
                                }
                            />
                            <p className="mt-2 text-sm text-muted-foreground">
                                {devotionalStatus.compliance} this month
                            </p>
                            <Link
                                href={devotional.index()}
                                className="mt-2 block text-sm text-primary hover:underline"
                            >
                                Open Devotional →
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
];

EmployeeDashboard.layout = { breadcrumbs };
