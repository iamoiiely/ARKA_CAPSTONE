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
import payslipManagement from '@/routes/admin/payslip-management';
import type { BreadcrumbItem } from '@/types';

type Payslip = {
    id: number;
    period_start: string;
    period_end: string;
    net_pay: string;
    status: string;
    user: { name: string };
};

type Props = {
    payslips: {
        data: Payslip[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { employee_id?: string };
    employees: { id: number; name: string }[];
};

export default function PayslipManagementIndex({
    payslips: list,
    filters,
    employees,
}: Props) {
    const apply = (overrides: Partial<typeof filters>) => {
        router.get(
            payslipManagement.index().url,
            { ...filters, ...overrides },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Payslip Management" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    eyebrow="Super Admin"
                    title="Payslip Management"
                    action={
                        <Button asChild>
                            <Link href={payslipManagement.create()}>
                                Issue Payslip
                            </Link>
                        </Button>
                    }
                />

                <div className="flex flex-wrap items-center gap-3">
                    <Select
                        value={filters.employee_id ?? 'all'}
                        onValueChange={(v) =>
                            apply({ employee_id: v === 'all' ? undefined : v })
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
                                <TableHead>Employee</TableHead>
                                <TableHead>Pay Period</TableHead>
                                <TableHead>Net Pay</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {list.data.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell>{p.user.name}</TableCell>
                                    <TableCell>
                                        {p.period_start} – {p.period_end}
                                    </TableCell>
                                    <TableCell>
                                        ₱{Number(p.net_pay).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={p.status} />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {list.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No payslips issued yet.
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
    { title: 'Payslip Management', href: payslipManagement.index() },
];

PayslipManagementIndex.layout = { breadcrumbs };
