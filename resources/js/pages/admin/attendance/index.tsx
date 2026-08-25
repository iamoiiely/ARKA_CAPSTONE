import { Head, Link, router } from '@inertiajs/react';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';
import { StatTile } from '@/components/stat-tile';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import attendance from '@/routes/admin/attendance';
import type { BreadcrumbItem } from '@/types';

type Row = {
    id: number;
    date: string;
    time_in: string | null;
    time_out: string | null;
    status: string;
    user: { name: string };
};

type Props = {
    summary: {
        present: number;
        late: number;
        absent: number;
        onLeave: number;
        incomplete: number;
    };
    attendance: {
        data: Row[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        employee_id?: string;
        status?: string;
        from?: string;
        to?: string;
    };
    employees: { id: number; name: string }[];
};

export default function AttendanceIndex({
    summary,
    attendance: list,
    filters,
    employees,
}: Props) {
    const applyFilters = (overrides: Partial<typeof filters>) => {
        router.get(
            attendance.index().url,
            { ...filters, ...overrides },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Attendance Management" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    eyebrow="Attendance Management"
                    title="Attendance"
                    action={
                        <Button variant="outline" asChild>
                            <Link href={attendance.corrections()}>
                                Correction Requests
                            </Link>
                        </Button>
                    }
                />

                <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                    <StatTile label="Present" value={summary.present} />
                    <StatTile label="Late" value={summary.late} />
                    <StatTile label="Absent" value={summary.absent} />
                    <StatTile label="On Leave" value={summary.onLeave} />
                    <StatTile label="Incomplete" value={summary.incomplete} />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Select
                        value={filters.employee_id ?? 'all'}
                        onValueChange={(v) =>
                            applyFilters({
                                employee_id: v === 'all' ? undefined : v,
                            })
                        }
                    >
                        <SelectTrigger className="w-48 rounded-none">
                            <SelectValue placeholder="Employee" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All employees</SelectItem>
                            {employees.map((e) => (
                                <SelectItem key={e.id} value={String(e.id)}>
                                    {e.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={filters.status ?? 'all'}
                        onValueChange={(v) =>
                            applyFilters({
                                status: v === 'all' ? undefined : v,
                            })
                        }
                    >
                        <SelectTrigger className="w-40 rounded-none">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>
                            <SelectItem value="present">Present</SelectItem>
                            <SelectItem value="late">Late</SelectItem>
                            <SelectItem value="absent">Absent</SelectItem>
                            <SelectItem value="leave">Leave</SelectItem>
                            <SelectItem value="incomplete">
                                Incomplete
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <Input
                        type="date"
                        className="w-40 rounded-none"
                        defaultValue={filters.from}
                        onChange={(e) => applyFilters({ from: e.target.value })}
                    />
                    <Input
                        type="date"
                        className="w-40 rounded-none"
                        defaultValue={filters.to}
                        onChange={(e) => applyFilters({ to: e.target.value })}
                    />
                </div>

                <div className="border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Time In</TableHead>
                                <TableHead>Time Out</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {list.data.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.user.name}</TableCell>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell className="font-mono text-xs">
                                        {row.time_in ?? '—'}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">
                                        {row.time_out ?? '—'}
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={row.status} />
                                    </TableCell>
                                    <TableCell>
                                        <Link
                                            href={attendance.show(row.id)}
                                            className="text-primary hover:underline"
                                        >
                                            {row.status === 'incomplete'
                                                ? 'Fix this'
                                                : 'View'}
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {list.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No attendance records found.
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
    { title: 'Attendance', href: attendance.index() },
];

AttendanceIndex.layout = { breadcrumbs };
