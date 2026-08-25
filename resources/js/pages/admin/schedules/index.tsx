import { Head, Link, router } from '@inertiajs/react';
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
import schedules from '@/routes/admin/schedules';
import type { BreadcrumbItem } from '@/types';

type Schedule = {
    id: number;
    job_position: string;
    working_days: string[];
    start_time: string;
    end_time: string;
    schedule_type: string;
    status: string;
    user: { name: string };
    client: { name: string };
};

type Props = {
    schedules: {
        data: Schedule[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        employee_id?: string;
        status?: string;
        day?: string;
        search?: string;
    };
    employees: { id: number; name: string }[];
};

export default function SchedulesIndex({
    schedules: list,
    filters,
    employees,
}: Props) {
    const applyFilters = (overrides: Partial<typeof filters>) => {
        router.get(
            schedules.index().url,
            { ...filters, ...overrides },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Scheduling" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    eyebrow="Scheduling"
                    title="Schedules"
                    action={
                        <Button asChild>
                            <Link href={schedules.create()}>Add Schedule</Link>
                        </Button>
                    }
                />

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
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={filters.day ?? 'all'}
                        onValueChange={(v) =>
                            applyFilters({ day: v === 'all' ? undefined : v })
                        }
                    >
                        <SelectTrigger className="w-36 rounded-none">
                            <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All days</SelectItem>
                            {[
                                'Mon',
                                'Tue',
                                'Wed',
                                'Thu',
                                'Fri',
                                'Sat',
                                'Sun',
                            ].map((d) => (
                                <SelectItem key={d} value={d}>
                                    {d}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Job Position</TableHead>
                                <TableHead>Working Days</TableHead>
                                <TableHead>Start</TableHead>
                                <TableHead>End</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {list.data.map((s) => (
                                <TableRow key={s.id}>
                                    <TableCell>{s.user.name}</TableCell>
                                    <TableCell>{s.client.name}</TableCell>
                                    <TableCell>{s.job_position}</TableCell>
                                    <TableCell className="font-mono text-xs">
                                        {s.working_days.join(', ')}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">
                                        {s.start_time}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">
                                        {s.end_time}
                                    </TableCell>
                                    <TableCell className="capitalize">
                                        {s.schedule_type}
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={s.status} />
                                    </TableCell>
                                    <TableCell className="space-x-3">
                                        <Link
                                            href={schedules.edit(s.id)}
                                            className="text-primary hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            type="button"
                                            className="text-muted-foreground hover:underline"
                                            onClick={() =>
                                                router.patch(
                                                    schedules.toggleStatus(s.id)
                                                        .url,
                                                    {},
                                                    { preserveScroll: true },
                                                )
                                            }
                                        >
                                            {s.status === 'active'
                                                ? 'Deactivate'
                                                : 'Activate'}
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {list.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={9}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No schedules found.
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
    { title: 'Schedules', href: schedules.index() },
];

SchedulesIndex.layout = { breadcrumbs };
