import { Head, Link, router } from '@inertiajs/react';
import { Eye, Pencil, Plus, Search } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { User } from '@/types';

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Paginated<T> = {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
};

type Props = {
    employees: Paginated<User>;
    filters: {
        search: string;
        status: string;
        role: string;
    };
};

export default function EmployeesIndex({ employees, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const applyFilters = (overrides: Partial<Props['filters']> = {}) => {
        router.get(
            '/admin/employees',
            {
                search,
                status: filters.status,
                role: filters.role,
                ...overrides,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleSearchSubmit = (event: FormEvent) => {
        event.preventDefault();
        applyFilters({ search });
    };

    return (
        <>
            <Head title="Employee Management" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading
                        title="Employee Management"
                        description="Add, search, and manage employee accounts."
                    />
                    <Button asChild>
                        <Link href="/admin/employees/create">
                            <Plus />
                            Add Employee
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search by name, employee ID, or email"
                                className="w-72 pl-9"
                            />
                        </div>
                        <Button type="submit" variant="secondary">
                            Search
                        </Button>
                    </form>

                    <Select
                        value={filters.status || 'all'}
                        onValueChange={(value) => applyFilters({ status: value === 'all' ? '' : value })}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.role || 'all'}
                        onValueChange={(value) => applyFilters({ role: value === 'all' ? '' : value })}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="employee">Employee</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="overflow-x-auto rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-sidebar-border/70 bg-muted/50 dark:border-sidebar-border">
                            <tr>
                                <th className="px-4 py-3 font-medium">Employee</th>
                                <th className="px-4 py-3 font-medium">Employee ID</th>
                                <th className="px-4 py-3 font-medium">Email</th>
                                <th className="px-4 py-3 font-medium">Role</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.data.map((employee) => (
                                <tr
                                    key={employee.id}
                                    className="border-b border-sidebar-border/70 last:border-0 dark:border-sidebar-border"
                                >
                                    <td className="px-4 py-3">{employee.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {employee.employee_id ?? '—'}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{employee.email}</td>
                                    <td className="px-4 py-3 capitalize">{employee.role.replace('_', ' ')}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                                            {employee.status}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Button asChild variant="ghost" size="icon">
                                                <Link href={`/admin/employees/${employee.id}`}>
                                                    <Eye className="size-4" />
                                                </Link>
                                            </Button>
                                            <Button asChild variant="ghost" size="icon">
                                                <Link href={`/admin/employees/${employee.id}/edit`}>
                                                    <Pencil className="size-4" />
                                                </Link>
                                            </Button>
                                            {employee.status === 'active' ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        router.patch(`/admin/employees/${employee.id}/deactivate`)
                                                    }
                                                >
                                                    Deactivate
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        router.patch(`/admin/employees/${employee.id}/activate`)
                                                    }
                                                >
                                                    Activate
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {employees.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                        No employees found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {employees.last_page > 1 && (
                    <div className="flex flex-wrap items-center gap-1">
                        {employees.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

EmployeesIndex.layout = {
    breadcrumbs: [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'Employee Management', href: '/admin/employees' },
    ],
};
