import { Head, Link } from '@inertiajs/react';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

type Schedule = {
    id: number;
    job_position: string;
    working_days: string[];
    start_time: string;
    end_time: string;
    status: string;
    client: { name: string };
};
type Attendance = {
    id: number;
    date: string;
    time_in: string | null;
    time_out: string | null;
    status: string;
};

type Employee = {
    id: number;
    employee_no: string;
    name: string;
    email: string;
    role: string;
    status: string;
    birthday: string | null;
    age: number | null;
    phone: string | null;
    photo_path: string | null;
    schedules: Schedule[];
    attendances: Attendance[];
};

export default function EmployeeShow({
    employee,
    temporaryPassword,
}: {
    employee: Employee;
    temporaryPassword?: string | null;
}) {
    return (
        <>
            <Head title={employee.name} />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    eyebrow="Employee Management"
                    title={employee.name}
                    action={
                        <Button variant="outline" asChild>
                            <Link href={employees.edit(employee.id)}>Edit</Link>
                        </Button>
                    }
                />

                {temporaryPassword && (
                    <Card className="rounded-none border-arka-gold">
                        <CardContent className="text-sm">
                            Temporary password:{' '}
                            <span className="font-mono font-semibold">
                                {temporaryPassword}
                            </span>{' '}
                            — share this with the employee. They'll be required
                            to change it on first login.
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-muted-foreground">
                                    Employee ID
                                </p>
                                <p className="font-mono">
                                    {employee.employee_no}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Status</p>
                                <StatusBadge status={employee.status} />
                            </div>
                            <div>
                                <p className="text-muted-foreground">Email</p>
                                <p>{employee.email}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Role</p>
                                <p className="capitalize">
                                    {employee.role.replace('_', ' ')}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">
                                    Birthday
                                </p>
                                <p>{employee.birthday ?? '—'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Age</p>
                                <p>{employee.age ?? '—'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Phone</p>
                                <p>{employee.phone ?? '—'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>Linked Schedules</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            {employee.schedules.length === 0 && (
                                <p className="text-muted-foreground">
                                    No schedules yet.
                                </p>
                            )}
                            {employee.schedules.map((s) => (
                                <div
                                    key={s.id}
                                    className="flex items-center justify-between border-b pb-2 last:border-b-0"
                                >
                                    <span>
                                        {s.client.name} — {s.job_position}
                                    </span>
                                    <StatusBadge status={s.status} />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <Card className="rounded-none">
                    <CardHeader>
                        <CardTitle>Recent Attendance</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Time In</TableHead>
                                    <TableHead>Time Out</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employee.attendances.map((a) => (
                                    <TableRow key={a.id}>
                                        <TableCell>{a.date}</TableCell>
                                        <TableCell>
                                            {a.time_in ?? '—'}
                                        </TableCell>
                                        <TableCell>
                                            {a.time_out ?? '—'}
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={a.status} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Employees', href: employees.index() },
];

EmployeeShow.layout = { breadcrumbs };
