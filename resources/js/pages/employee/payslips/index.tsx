import { Head, Link, router } from '@inertiajs/react';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { dashboard } from '@/routes';
import payslips from '@/routes/payslips';
import type { BreadcrumbItem } from '@/types';

type Payslip = {
    id: number;
    period_start: string;
    period_end: string;
    date_issued: string | null;
    net_pay: string;
    status: string;
};

type Props = {
    payslips: {
        data: Payslip[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    latest: Payslip | null;
    filters: { status?: string };
};

export default function PayslipsIndex({
    payslips: list,
    latest,
    filters,
}: Props) {
    const apply = (overrides: Partial<typeof filters>) => {
        router.get(
            payslips.index().url,
            { ...filters, ...overrides },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Payslip" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader eyebrow="Payslip" title="My Payslips" />

                {latest && (
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>Latest Payslip</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between text-sm">
                            <div>
                                <p>
                                    {latest.period_start} – {latest.period_end}
                                </p>
                                <p className="text-lg font-semibold">
                                    ₱{Number(latest.net_pay).toLocaleString()}
                                </p>
                            </div>
                            <Link
                                href={payslips.show(latest.id)}
                                className="text-primary hover:underline"
                            >
                                View
                            </Link>
                        </CardContent>
                    </Card>
                )}

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
                            <SelectItem value="processing">
                                Processing
                            </SelectItem>
                            <SelectItem value="available">Available</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pay Period</TableHead>
                                <TableHead>Date Issued</TableHead>
                                <TableHead>Net Pay</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {list.data.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell>
                                        {p.period_start} – {p.period_end}
                                    </TableCell>
                                    <TableCell>
                                        {p.date_issued ?? '—'}
                                    </TableCell>
                                    <TableCell>
                                        ₱{Number(p.net_pay).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={p.status} />
                                    </TableCell>
                                    <TableCell>
                                        <Link
                                            href={payslips.show(p.id)}
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
                                        No payslips yet.
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
    { title: 'Payslip', href: payslips.index() },
];

PayslipsIndex.layout = { breadcrumbs };
