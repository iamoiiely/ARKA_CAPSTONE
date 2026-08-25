import { Head, router } from '@inertiajs/react';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';
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
import { dashboard } from '@/routes/admin';
import attendance from '@/routes/admin/attendance';
import type { BreadcrumbItem } from '@/types';

type Correction = {
    id: number;
    date: string;
    field_corrected: string;
    original_time_in: string | null;
    original_time_out: string | null;
    requested_time_in: string | null;
    requested_time_out: string | null;
    reason: string;
    status: string;
    created_at: string;
    user: { name: string };
    reviewer?: { name: string } | null;
};

type PaginatedLinks = { url: string | null; label: string; active: boolean }[];

type Props = {
    incoming: { data: Correction[]; links: PaginatedLinks };
    log: { data: Correction[]; links: PaginatedLinks };
};

export default function AttendanceCorrections({ incoming, log }: Props) {
    const review = (id: number, decision: 'approved' | 'rejected') => {
        router.patch(
            attendance.corrections.review(id).url,
            { decision },
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Correction Requests" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    eyebrow="Attendance Management"
                    title="Correction Requests"
                />

                <Card className="rounded-none">
                    <CardHeader>
                        <CardTitle>Incoming Correction Requests</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Requested Change</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {incoming.data.map((c) => (
                                    <TableRow key={c.id}>
                                        <TableCell>{c.user.name}</TableCell>
                                        <TableCell>{c.date}</TableCell>
                                        <TableCell className="font-mono text-xs">
                                            {c.requested_time_in ?? '—'} –{' '}
                                            {c.requested_time_out ?? '—'}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {c.reason}
                                        </TableCell>
                                        <TableCell className="space-x-3">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    review(c.id, 'approved')
                                                }
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() =>
                                                    review(c.id, 'rejected')
                                                }
                                            >
                                                Reject
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {incoming.data.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="py-8 text-center text-muted-foreground"
                                        >
                                            No pending requests.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <Pagination links={incoming.links} />
                    </CardContent>
                </Card>

                <Card className="rounded-none">
                    <CardHeader>
                        <CardTitle>Correction Requests Log</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Field</TableHead>
                                    <TableHead>Original</TableHead>
                                    <TableHead>Corrected</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Corrected By</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {log.data.map((c) => (
                                    <TableRow key={c.id}>
                                        <TableCell>{c.date}</TableCell>
                                        <TableCell>{c.user.name}</TableCell>
                                        <TableCell className="capitalize">
                                            {c.field_corrected.replace(
                                                '_',
                                                ' ',
                                            )}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">
                                            {c.original_time_in ?? '—'} –{' '}
                                            {c.original_time_out ?? '—'}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">
                                            {c.requested_time_in ?? '—'} –{' '}
                                            {c.requested_time_out ?? '—'}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {c.reason}
                                        </TableCell>
                                        <TableCell>
                                            {c.reviewer?.name ?? '—'}
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={c.status} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {log.data.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={8}
                                            className="py-8 text-center text-muted-foreground"
                                        >
                                            No corrections yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <Pagination links={log.links} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Attendance', href: attendance.index() },
    { title: 'Correction Requests', href: attendance.corrections() },
];

AttendanceCorrections.layout = { breadcrumbs };
