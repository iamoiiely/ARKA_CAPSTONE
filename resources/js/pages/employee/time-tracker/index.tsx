import { Head, Link, router } from '@inertiajs/react';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard } from '@/routes';
import timeTracker from '@/routes/time-tracker';
import type { BreadcrumbItem } from '@/types';

type Schedule = {
    id: number;
    job_position: string;
    expected_working_hours: number;
    client_id: number;
    client: { id: number; name: string };
};
type TimeLog = {
    id: number;
    client_id: number;
    time_in: string;
    time_out: string | null;
    break_minutes: number;
    status: string;
    client: { name: string };
};

type Props = {
    schedules: Schedule[];
    todaysLogs: TimeLog[];
};

export default function TimeTrackerIndex({ schedules, todaysLogs }: Props) {
    const activeCount = todaysLogs.filter(
        (l) => l.status === 'running' || l.status === 'on_break',
    ).length;
    const totalMinutes = todaysLogs.reduce((sum, l) => {
        const end = l.time_out ? new Date(l.time_out) : new Date();
        const mins = Math.max(
            0,
            (end.getTime() - new Date(l.time_in).getTime()) / 60000 -
                l.break_minutes,
        );

        return sum + mins;
    }, 0);

    const logFor = (clientId: number) =>
        todaysLogs.find(
            (l) =>
                l.client_id === clientId &&
                (l.status === 'running' || l.status === 'on_break'),
        );

    return (
        <>
            <Head title="Time Tracker" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    eyebrow="Time Tracker"
                    title="Clients"
                    action={
                        <Button variant="outline" asChild>
                            <Link href={timeTracker.history()}>
                                View History
                            </Link>
                        </Button>
                    }
                />

                <Card className="rounded-none">
                    <CardContent className="flex items-center gap-6 text-sm">
                        <span>
                            <span className="font-semibold">{activeCount}</span>{' '}
                            active timers
                        </span>
                        <span>
                            <span className="font-semibold">
                                {Math.round((totalMinutes / 60) * 10) / 10}h
                            </span>{' '}
                            total today
                        </span>
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {schedules.map((schedule) => {
                        const log = logFor(schedule.client_id);

                        return (
                            <Card key={schedule.id} className="rounded-none">
                                <CardHeader>
                                    <CardTitle>
                                        {schedule.client.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <p className="text-muted-foreground">
                                        {schedule.job_position}
                                    </p>
                                    <p className="text-muted-foreground">
                                        Scheduled{' '}
                                        {schedule.expected_working_hours}h
                                    </p>
                                    <StatusBadge
                                        status={log?.status ?? 'stopped'}
                                    />
                                    <div className="flex gap-2 pt-2">
                                        {!log && (
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    router.post(
                                                        timeTracker.start().url,
                                                        {
                                                            client_id:
                                                                schedule.client_id,
                                                        },
                                                        {
                                                            preserveScroll: true,
                                                        },
                                                    )
                                                }
                                            >
                                                Start
                                            </Button>
                                        )}
                                        {log && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        router.post(
                                                            timeTracker.break(
                                                                log.id,
                                                            ).url,
                                                            {},
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
                                                    }
                                                >
                                                    {log.status === 'on_break'
                                                        ? 'Resume'
                                                        : 'Break'}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() =>
                                                        router.post(
                                                            timeTracker.stop(
                                                                log.id,
                                                            ).url,
                                                            {},
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
                                                    }
                                                >
                                                    Stop
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                    {schedules.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            No active schedules assigned.
                        </p>
                    )}
                </div>

                <Card className="rounded-none">
                    <CardHeader>
                        <CardTitle>Today's Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Start</TableHead>
                                    <TableHead>End</TableHead>
                                    <TableHead>Break Used</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {todaysLogs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>{log.client.name}</TableCell>
                                        <TableCell className="font-mono text-xs">
                                            {new Date(
                                                log.time_in,
                                            ).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">
                                            {log.time_out
                                                ? new Date(
                                                      log.time_out,
                                                  ).toLocaleTimeString([], {
                                                      hour: '2-digit',
                                                      minute: '2-digit',
                                                  })
                                                : '—'}
                                        </TableCell>
                                        <TableCell>
                                            {log.break_minutes} min
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={log.status} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {todaysLogs.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="py-8 text-center text-muted-foreground"
                                        >
                                            No sessions today yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Time Tracker', href: timeTracker.index() },
];

TimeTrackerIndex.layout = { breadcrumbs };
