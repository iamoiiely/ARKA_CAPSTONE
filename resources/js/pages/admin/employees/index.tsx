import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';
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
import employees from '@/routes/admin/employees';
import type { BreadcrumbItem } from '@/types';

type Employee = {
    id: number;
    employee_no: string;
    name: string;
    role: string;
    status: string;
};

type Props = {
    employees: {
        data: Employee[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search?: string; status?: string; role?: string };
};

export default function EmployeesIndex({ employees: list, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const applyFilters = (overrides: Partial<typeof filters> = {}) => {
        router.get(
            employees.index().url,
            { search, ...filters, ...overrides },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Employee Management" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    eyebrow="Employee Management"
                    title="Employees"
                    action={
                        <Button asChild>
                            <Link href={employees.create()}>Add Employee</Link>
                        </Button>
                    }
                />

                <div className="flex flex-wrap items-center gap-3">
                    <Input
                        placeholder="Search name, ID, or email"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                        className="max-w-xs rounded-none"
                    />
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
                        value={filters.role ?? 'all'}
                        onValueChange={(v) =>
                            applyFilters({ role: v === 'all' ? undefined : v })
                        }
                    >
                        <SelectTrigger className="w-40 rounded-none">
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All roles</SelectItem>
                            <SelectItem value="employee">Employee</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => applyFilters()}>
                        Search
                    </Button>
                </div>

                <div className="border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee ID</TableHead>
                                <TableHead>Full Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Account Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {list.data.map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell className="font-mono text-xs">
                                        {employee.employee_no}
                                    </TableCell>
                                    <TableCell>{employee.name}</TableCell>
                                    <TableCell className="capitalize">
                                        {employee.role.replace('_', ' ')}
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={employee.status} />
                                    </TableCell>
                                    <TableCell className="space-x-3">
                                        <Link
                                            href={employees.show(employee.id)}
                                            className="text-primary hover:underline"
                                        >
                                            View
                                        </Link>
                                        <Link
                                            href={employees.edit(employee.id)}
                                            className="text-primary hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            type="button"
                                            className="text-muted-foreground hover:underline"
                                            onClick={() => {
                                                if (
                                                    confirm(
                                                        `${employee.status === 'active' ? 'Deactivate' : 'Activate'} ${employee.name}?`,
                                                    )
                                                ) {
                                                    router.patch(
                                                        employees.toggleStatus(
                                                            employee.id,
                                                        ).url,
                                                        {},
                                                        {
                                                            preserveScroll: true,
                                                        },
                                                    );
                                                }
                                            }}
                                        >
                                            {employee.status === 'active'
                                                ? 'Deactivate'
                                                : 'Activate'}
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {list.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No employees found.
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
    { title: 'Employees', href: employees.index() },
];

EmployeesIndex.layout = { breadcrumbs };
