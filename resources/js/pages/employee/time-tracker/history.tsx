import { Head, router } from '@inertiajs/react';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
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

type Log = {
    id: number;
    date: string;
    time_in: string;
    time_out: string | null;
    break_minutes: number;
    status: string;
    client: { name: string };
};

type Props = {
    logs: {
        data: Log[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        client_id?: string;
        status?: string;
        from?: string;
        to?: string;
    };
};

export default function TimeTrackerHistory({ logs, filters }: Props) {
    const apply = (overrides: Partial<typeof filters>) => {
        router.get(
            timeTracker.history().url,
            { ...filters, ...overrides },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Time History" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader eyebrow="Time Tracker" title="Time History" />

                <div className="flex flex-wrap items-center gap-3">
                    <input
                        type="date"
                        className="h-9 border border-input bg-transparent px-3 text-sm"
                        defaultValue={filters.from}
                        onChange={(e) => apply({ from: e.target.value })}
                    />
                    <input
                        type="date"
                        className="h-9 border border-input bg-transparent px-3 text-sm"
                        defaultValue={filters.to}
                        onChange={(e) => apply({ to: e.target.value })}
                    />
                </div>

                <div className="border">
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
                            {logs.data.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell>{log.client.name}</TableCell>
                                    <TableCell className="font-mono text-xs">
                                        {new Date(log.time_in).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">
                                        {log.time_out
                                            ? new Date(
                                                  log.time_out,
                                              ).toLocaleString()
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
                            {logs.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No history yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <Pagination links={logs.links} />
                </div>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Time Tracker', href: timeTracker.index() },
    { title: 'History', href: timeTracker.history() },
];

TimeTrackerHistory.layout = { breadcrumbs };
