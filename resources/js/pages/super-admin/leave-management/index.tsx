import { Head, router } from '@inertiajs/react';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard } from '@/routes/admin';
import leaveManagement from '@/routes/admin/leave-management';
import type { BreadcrumbItem } from '@/types';

type LeaveRequest = {
    id: number;
    leave_type: string;
    start_date: string;
    end_date: string;
    reason: string;
    client_informed: boolean;
    proof_path: string | null;
    status: string;
    user: { name: string };
};

type Props = {
    leaveRequests: {
        data: LeaveRequest[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { status?: string };
};

export default function LeaveManagementIndex({
    leaveRequests: list,
    filters,
}: Props) {
    const apply = (overrides: Partial<typeof filters>) => {
        router.get(
            leaveManagement.index().url,
            { ...filters, ...overrides },
            { preserveState: true, replace: true },
        );
    };

    const review = (id: number, decision: 'approved' | 'rejected') => {
        router.patch(
            leaveManagement.review(id).url,
            { decision },
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Leave Request Management" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    eyebrow="Super Admin"
                    title="Leave Request Management"
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
                                <TableHead>Employee</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Dates</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Proof</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {list.data.map((lr) => (
                                <TableRow key={lr.id}>
                                    <TableCell>{lr.user.name}</TableCell>
                                    <TableCell className="capitalize">
                                        {lr.leave_type}
                                    </TableCell>
                                    <TableCell>
                                        {lr.start_date} – {lr.end_date}
                                    </TableCell>
                                    <TableCell>{lr.reason}</TableCell>
                                    <TableCell>
                                        {lr.proof_path ? (
                                            <a
                                                href={`/storage/${lr.proof_path}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-primary hover:underline"
                                            >
                                                View
                                            </a>
                                        ) : (
                                            '—'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={lr.status} />
                                    </TableCell>
                                    <TableCell className="space-x-2">
                                        {(lr.status === 'pending_approval' ||
                                            lr.status ===
                                                'needs_verification') && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        review(
                                                            lr.id,
                                                            'approved',
                                                        )
                                                    }
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        review(
                                                            lr.id,
                                                            'rejected',
                                                        )
                                                    }
                                                >
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {list.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No leave requests found.
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
    { title: 'Leave Request Management', href: leaveManagement.index() },
];

LeaveManagementIndex.layout = { breadcrumbs };
