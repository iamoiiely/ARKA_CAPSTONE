import { Form, Head, router } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
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
import { dashboard } from '@/routes';
import leaveRequests from '@/routes/leave-requests';
import type { BreadcrumbItem } from '@/types';

type LeaveRequest = {
    id: number;
    leave_type: string;
    start_date: string;
    end_date: string;
    reason: string;
    status: string;
};

type Props = {
    leaveRequests: {
        data: LeaveRequest[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { status?: string; from?: string; to?: string };
};

export default function LeaveRequestsIndex({
    leaveRequests: list,
    filters,
}: Props) {
    const [open, setOpen] = useState(false);
    const [clientInformed, setClientInformed] = useState(false);

    const apply = (overrides: Partial<typeof filters>) => {
        router.get(
            leaveRequests.index().url,
            { ...filters, ...overrides },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Leave Request" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    eyebrow="Leave Request"
                    title="My Leave Requests"
                    action={
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button>New Leave Request</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>New Leave Request</DialogTitle>
                                </DialogHeader>
                                <Form
                                    {...leaveRequests.store.form()}
                                    onSuccess={() => setOpen(false)}
                                    resetOnSuccess
                                    encType="multipart/form-data"
                                    className="space-y-4"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="leave_type">
                                                    Leave Type
                                                </Label>
                                                <Select
                                                    name="leave_type"
                                                    defaultValue="paid"
                                                >
                                                    <SelectTrigger
                                                        id="leave_type"
                                                        className="rounded-none"
                                                    >
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="paid">
                                                            Paid
                                                        </SelectItem>
                                                        <SelectItem value="unpaid">
                                                            Unpaid
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="start_date">
                                                        Start Date
                                                    </Label>
                                                    <Input
                                                        id="start_date"
                                                        type="date"
                                                        name="start_date"
                                                        required
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.start_date
                                                        }
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="end_date">
                                                        End Date
                                                    </Label>
                                                    <Input
                                                        id="end_date"
                                                        type="date"
                                                        name="end_date"
                                                        required
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.end_date
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="reason">
                                                    Reason
                                                </Label>
                                                <Select
                                                    name="reason"
                                                    defaultValue="Personal Matter"
                                                >
                                                    <SelectTrigger
                                                        id="reason"
                                                        className="rounded-none"
                                                    >
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Paid Holiday">
                                                            Paid Holiday
                                                        </SelectItem>
                                                        <SelectItem value="Emergency">
                                                            Emergency
                                                        </SelectItem>
                                                        <SelectItem value="Family Matter">
                                                            Family Matter
                                                        </SelectItem>
                                                        <SelectItem value="Personal Matter">
                                                            Personal Matter
                                                        </SelectItem>
                                                        <SelectItem value="Medical">
                                                            Medical
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="client_informed"
                                                    name="client_informed"
                                                    value="1"
                                                    checked={clientInformed}
                                                    onChange={(e) =>
                                                        setClientInformed(
                                                            e.target.checked,
                                                        )
                                                    }
                                                    className="size-4"
                                                />
                                                <Label htmlFor="client_informed">
                                                    Client Informed
                                                </Label>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="proof">
                                                    Proof of Client Confirmation
                                                    (optional)
                                                </Label>
                                                <Input
                                                    id="proof"
                                                    type="file"
                                                    name="proof"
                                                />
                                                {clientInformed && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Without proof, this
                                                        request will be flagged
                                                        "Needs Verification" for
                                                        Super Admin review.
                                                    </p>
                                                )}
                                            </div>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing && <Spinner />}
                                                Submit Leave Request
                                            </Button>
                                        </>
                                    )}
                                </Form>
                            </DialogContent>
                        </Dialog>
                    }
                />

                <div className="flex flex-wrap items-center gap-3">
                    <Select
                        value={filters.status ?? 'all'}
                        onValueChange={(v) =>
                            apply({ status: v === 'all' ? undefined : v })
                        }
                    >
                        <SelectTrigger className="w-48 rounded-none">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>
                            <SelectItem value="pending_approval">
                                Pending Approval
                            </SelectItem>
                            <SelectItem value="needs_verification">
                                Needs Verification
                            </SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {list.data.map((lr) => (
                                <TableRow key={lr.id}>
                                    <TableCell>
                                        {lr.start_date} – {lr.end_date}
                                    </TableCell>
                                    <TableCell className="capitalize">
                                        {lr.leave_type}
                                    </TableCell>
                                    <TableCell>{lr.reason}</TableCell>
                                    <TableCell>
                                        <StatusBadge status={lr.status} />
                                    </TableCell>
                                    <TableCell>
                                        {(lr.status === 'pending_approval' ||
                                            lr.status ===
                                                'needs_verification') && (
                                            <button
                                                type="button"
                                                className="text-muted-foreground hover:underline"
                                                onClick={() =>
                                                    confirm(
                                                        'Cancel this leave request?',
                                                    ) &&
                                                    router.patch(
                                                        leaveRequests.cancel(
                                                            lr.id,
                                                        ).url,
                                                        {},
                                                        {
                                                            preserveScroll: true,
                                                        },
                                                    )
                                                }
                                            >
                                                Cancel Request
                                            </button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {list.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No leave requests yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <Pagination links={list.links} />
                </div>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Leave Request', href: leaveRequests.index() },
];

LeaveRequestsIndex.layout = { breadcrumbs };
