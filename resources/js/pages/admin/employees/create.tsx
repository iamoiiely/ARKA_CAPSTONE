import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes/admin';
import employees from '@/routes/admin/employees';
import type { BreadcrumbItem } from '@/types';

export default function EmployeeCreate() {
    return (
        <>
            <Head title="Add Employee" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    eyebrow="Employee Management"
                    title="Add Employee"
                />

                <Form
                    {...employees.store.form()}
                    encType="multipart/form-data"
                    className="max-w-2xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <Card className="rounded-none">
                                <CardHeader>
                                    <CardTitle>Personal Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" name="name" required />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="birthday">
                                                Birthday
                                            </Label>
                                            <Input
                                                id="birthday"
                                                type="date"
                                                name="birthday"
                                            />
                                            <InputError
                                                message={errors.birthday}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="phone">
                                                Phone Number
                                            </Label>
                                            <Input id="phone" name="phone" />
                                            <InputError
                                                message={errors.phone}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">
                                            Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Locked after save — the employee
                                            can't log in until this record
                                            exists.
                                        </p>
                                        <InputError message={errors.email} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="photo">
                                            Profile Photo
                                        </Label>
                                        <Input
                                            id="photo"
                                            type="file"
                                            name="photo"
                                            accept="image/*"
                                        />
                                        <InputError message={errors.photo} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-none">
                                <CardHeader>
                                    <CardTitle>
                                        Employment Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="role">Role</Label>
                                        <Select
                                            name="role"
                                            defaultValue="employee"
                                        >
                                            <SelectTrigger
                                                id="role"
                                                className="rounded-none"
                                            >
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="employee">
                                                    Employee
                                                </SelectItem>
                                                <SelectItem value="admin">
                                                    Admin
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.role} />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Employee ID is auto-generated on save.
                                        Job Position isn't set here — it lives
                                        on each schedule entry.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="rounded-none">
                                <CardHeader>
                                    <CardTitle>Account Access</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="temporary_password">
                                            Temporary Password (leave blank to
                                            auto-generate)
                                        </Label>
                                        <Input
                                            id="temporary_password"
                                            name="temporary_password"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            The employee will be required to
                                            change this password the first time
                                            they log in.
                                        </p>
                                        <InputError
                                            message={errors.temporary_password}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Button type="submit" disabled={processing}>
                                {processing && <Spinner />}
                                Save
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Employees', href: employees.index() },
    { title: 'Add Employee', href: employees.create() },
];

EmployeeCreate.layout = { breadcrumbs };
