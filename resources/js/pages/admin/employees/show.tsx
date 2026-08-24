import { Head, Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { User } from '@/types';

function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div>
            <dt className="text-xs font-medium text-muted-foreground uppercase">{label}</dt>
            <dd className="mt-1 text-sm">{value ?? '—'}</dd>
        </div>
    );
}

export default function ShowEmployee({ employee }: { employee: User }) {
    return (
        <>
            <Head title={employee.name ?? employee.email} />
            <div className="flex flex-1 flex-col gap-6 p-4 md:max-w-2xl md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading title={employee.name ?? 'Employee'} description={employee.email} />
                    <Button asChild>
                        <Link href={`/admin/employees/${employee.id}/edit`}>
                            <Pencil />
                            Edit
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardContent>
                        <dl className="grid gap-6 sm:grid-cols-2">
                            <Field label="Full Name" value={employee.name} />
                            <Field label="Employee ID" value={employee.employee_id} />
                            <Field label="Email Address" value={employee.email} />
                            <Field label="Phone Number" value={employee.phone_number} />
                            <Field label="Birthday" value={employee.birthday} />
                            <Field label="Age" value={employee.age} />
                            <Field label="Job Position" value={employee.job_position} />
                            <Field
                                label="Role"
                                value={<span className="capitalize">{employee.role.replace('_', ' ')}</span>}
                            />
                            <Field
                                label="Account Status"
                                value={
                                    <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                                        {employee.status}
                                    </Badge>
                                }
                            />
                        </dl>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ShowEmployee.layout = {
    breadcrumbs: [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'Employee Management', href: '/admin/employees' },
        { title: 'View Employee', href: '#' },
    ],
};
