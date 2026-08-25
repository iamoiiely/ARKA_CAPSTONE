import { Head, Link, router } from '@inertiajs/react';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
import { Card, CardContent } from '@/components/ui/card';
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
import devotionals from '@/routes/admin/devotionals';
import type { BreadcrumbItem } from '@/types';

type Devotional = {
    id: number;
    date: string;
    title: string;
    user: { name: string };
};

type Props = {
    devotionals: {
        data: Devotional[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { employee_id?: string; search?: string };
    employees: { id: number; name: string }[];
    summary: { submitted: number; total: number };
};

export default function DevotionalsIndex({
    devotionals: list,
    filters,
    employees,
    summary,
}: Props) {
    const applyFilters = (overrides: Partial<typeof filters>) => {
        router.get(
            devotionals.index().url,
            { ...filters, ...overrides },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Devotional Management" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    eyebrow="Devotional Management"
                    title="Devotionals"
                />

                <Card className="rounded-none">
                    <CardContent className="text-sm">
                        <span className="font-semibold">
                            {summary.submitted} of {summary.total}
                        </span>{' '}
                        employees submitted today.
                    </CardContent>
                </Card>

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
                </div>

                <div className="border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Devotional Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {list.data.map((d) => (
                                <TableRow key={d.id}>
                                    <TableCell>{d.user.name}</TableCell>
                                    <TableCell>{d.date}</TableCell>
                                    <TableCell>{d.title}</TableCell>
                                    <TableCell>
                                        <StatusBadge status="submitted" />
                                    </TableCell>
                                    <TableCell>
                                        <Link
                                            href={devotionals.show(d.id)}
                                            className="text-primary hover:underline"
                                        >
                                            View
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {list.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No devotionals found.
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
    { title: 'Devotionals', href: devotionals.index() },
];

DevotionalsIndex.layout = { breadcrumbs };
