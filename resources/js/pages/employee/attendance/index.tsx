import { Form, Head, router } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';
import { StatTile } from '@/components/stat-tile';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import attendance from '@/routes/attendance';
import corrections from '@/routes/attendance/corrections';
import type { BreadcrumbItem } from '@/types';

type Row = {
    id: number;
    date: string;
    time_in: string | null;
    time_out: string | null;
    total_hours: number | null;
    status: string;
};
type Correction = {
    id: number;
    date: string;
    field_corrected: string;
    requested_time_in: string | null;
    requested_time_out: string | null;
    reason: string;
    status: string;
};

type Props = {
    summary: {
        present: number;
        absent: number;
        late: number;
        overtime: number;
        paidLeave: number;
        unpaidLeave: number;
    };
    history: {
        data: Row[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    myCorrections: {
        data: Correction[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { from?: string; to?: string };
};

export default function AttendanceIndex({
    summary,
    history,
    myCorrections,
    filters,
}: Props) {
    const [open, setOpen] = useState(false);

    const apply = (overrides: Partial<typeof filters>) => {
        router.get(
            attendance.index().url,
            { ...filters, ...overrides },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Attendance Summary" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    eyebrow="Attendance Summary"
                    title="My Attendance"
                    action={
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button>Request Correction</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Request Attendance Correction
                                    </DialogTitle>
                                </DialogHeader>
                                <Form
                                    {...corrections.store.form()}
                                    onSuccess={() => setOpen(false)}
                                    resetOnSuccess
                                    className="space-y-4"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="date">
                                                    Date
                                                </Label>
                                                <Input
                                                    id="date"
                                                    type="date"
                                                    name="date"
                                                    required
                                                />
                                                <InputError
                                                    message={errors.date}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="field_corrected">
                                                    Field to correct
                                                </Label>
                                                <Select
                                                    name="field_corrected"
                                                    defaultValue="time_out"
                                                >
                                                    <SelectTrigger
                                                        id="field_corrected"
                                                        className="rounded-none"
                                                    >
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="time_in">
                                                            Time In
                                                        </SelectItem>
                                                        <SelectItem value="time_out">
                                                            Time Out
                                                        </SelectItem>
                                                        <SelectItem value="both">
                                                            Both
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="requested_time_in">
                                                        Requested Time In
                                                    </Label>
                                                    <Input
                                                        id="requested_time_in"
                                                        type="time"
                                                        name="requested_time_in"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="requested_time_out">
                                                        Requested Time Out
                                                    </Label>
                                                    <Input
                                                        id="requested_time_out"
                                                        type="time"
                                                        name="requested_time_out"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="reason">
                                                    Reason
                                                </Label>
                                                <Textarea
                                                    id="reason"
                                                    name="reason"
                                                    required
                                                />
                                                <InputError
                                                    message={errors.reason}
                                                />
                                            </div>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing && <Spinner />}
                                                Submit Request
                                            </Button>
                                        </>
                                    )}
                                </Form>
                            </DialogContent>
                        </Dialog>
                    }
                />

                <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
                    <StatTile label="Present" value={summary.present} />
                    <StatTile label="Absent" value={summary.absent} />
                    <StatTile label="Late" value={summary.late} />
                    <StatTile label="Overtime" value={summary.overtime} />
                    <StatTile label="Paid Leave" value={summary.paidLeave} />
                    <StatTile
                        label="Unpaid Leave"
                        value={summary.unpaidLeave}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Input
                        type="date"
                        className="w-40 rounded-none"
                        defaultValue={filters.from}
                        onChange={(e) => apply({ from: e.target.value })}
                    />
                    <Input
                        type="date"
                        className="w-40 rounded-none"
                        defaultValue={filters.to}
                        onChange={(e) => apply({ to: e.target.value })}
                    />
                </div>

                <div className="border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Time In</TableHead>
                                <TableHead>Time Out</TableHead>
                                <TableHead>Hours</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {history.data.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell className="font-mono text-xs">
                                        {row.time_in ?? '—'}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">
                                        {row.time_out ?? '—'}
                                    </TableCell>
                                    <TableCell>
                                        {row.total_hours ?? '—'}
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={row.status} />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {history.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No attendance history yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <Pagination links={history.links} />
                </div>

                <Card className="rounded-none">
                    <CardHeader>
                        <CardTitle>My Correction Requests</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Field</TableHead>
                                    <TableHead>Requested Change</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {myCorrections.data.map((c) => (
                                    <TableRow key={c.id}>
                                        <TableCell>{c.date}</TableCell>
                                        <TableCell className="capitalize">
                                            {c.field_corrected.replace(
                                                '_',
                                                ' ',
                                            )}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">
                                            {c.requested_time_in ?? '—'} –{' '}
                                            {c.requested_time_out ?? '—'}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {c.reason}
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={c.status} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {myCorrections.data.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="py-8 text-center text-muted-foreground"
                                        >
                                            No requests submitted yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <Pagination links={myCorrections.links} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Attendance Summary', href: attendance.index() },
];

AttendanceIndex.layout = { breadcrumbs };
