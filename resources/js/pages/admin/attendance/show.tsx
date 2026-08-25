import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes/admin';
import attendance from '@/routes/admin/attendance';
import type { BreadcrumbItem } from '@/types';

type Correction = {
    id: number;
    source: string;
    original_time_in: string | null;
    original_time_out: string | null;
    requested_time_in: string | null;
    requested_time_out: string | null;
    reason: string;
    status: string;
    created_at: string;
};

type Attendance = {
    id: number;
    date: string;
    time_in: string | null;
    time_out: string | null;
    status: string;
    user: { name: string };
    corrections: Correction[];
};

export default function AttendanceShow({
    attendance: record,
}: {
    attendance: Attendance;
}) {
    return (
        <>
            <Head title={`Attendance — ${record.user.name}`} />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    eyebrow="Attendance Management"
                    title={`${record.user.name} — ${record.date}`}
                />

                <Card className="rounded-none">
                    <CardHeader>
                        <CardTitle>Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                        <div>
                            <p className="text-muted-foreground">Time In</p>
                            <p className="font-mono">{record.time_in ?? '—'}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Time Out</p>
                            <p className="font-mono">
                                {record.time_out ?? '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Status</p>
                            <StatusBadge status={record.status} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-none">
                    <CardHeader>
                        <CardTitle>Correct Attendance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form
                            {...attendance.correct.form(record.id)}
                            resetOnSuccess
                            className="max-w-md space-y-4"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="time_in">
                                                Corrected Time In
                                            </Label>
                                            <Input
                                                id="time_in"
                                                type="time"
                                                name="time_in"
                                            />
                                            <InputError
                                                message={errors.time_in}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="time_out">
                                                Corrected Time Out
                                            </Label>
                                            <Input
                                                id="time_out"
                                                type="time"
                                                name="time_out"
                                            />
                                            <InputError
                                                message={errors.time_out}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="reason">
                                            Reason for correction
                                        </Label>
                                        <Textarea
                                            id="reason"
                                            name="reason"
                                            required
                                        />
                                        <InputError message={errors.reason} />
                                    </div>
                                    <Button type="submit" disabled={processing}>
                                        {processing && <Spinner />}
                                        Save
                                    </Button>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>

                <Card className="rounded-none">
                    <CardHeader>
                        <CardTitle>Correction History</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {record.corrections.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                No corrections recorded.
                            </p>
                        )}
                        {record.corrections.map((c) => (
                            <div
                                key={c.id}
                                className="border-b pb-3 text-sm last:border-b-0"
                            >
                                <p>
                                    Original: {c.original_time_in ?? '—'} –{' '}
                                    {c.original_time_out ?? '—'} · Corrected to{' '}
                                    {c.requested_time_in ?? '—'} –{' '}
                                    {c.requested_time_out ?? '—'}
                                </p>
                                <p className="text-muted-foreground">
                                    {c.reason}
                                </p>
                                <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                    <StatusBadge status={c.status} /> ·{' '}
                                    {new Date(c.created_at).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Attendance', href: attendance.index() },
];

AttendanceShow.layout = { breadcrumbs };
