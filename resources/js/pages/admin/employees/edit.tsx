import { Form, Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
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
import type { User } from '@/types';

export default function EditEmployee({ employee }: { employee: User }) {
    return (
        <>
            <Head title={`Edit ${employee.name ?? employee.email}`} />
            <div className="flex flex-1 flex-col gap-6 p-4 md:max-w-2xl md:p-6">
                <Heading
                    title="Edit Employee"
                    description="The email address cannot be changed after the account has been created."
                />

                <Form
                    action={`/admin/employees/${employee.id}`}
                    method="put"
                    encType="multipart/form-data"
                    className="space-y-8"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" name="name" defaultValue={employee.name ?? ''} required />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="birthday">Birthday</Label>
                                    <Input
                                        id="birthday"
                                        name="birthday"
                                        type="date"
                                        defaultValue={employee.birthday ?? ''}
                                    />
                                    <InputError message={errors.birthday} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone_number">Phone Number</Label>
                                    <Input
                                        id="phone_number"
                                        name="phone_number"
                                        defaultValue={employee.phone_number ?? ''}
                                    />
                                    <InputError message={errors.phone_number} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" value={employee.email} disabled readOnly />
                                    <p className="text-xs text-muted-foreground">
                                        Email addresses cannot be changed.
                                    </p>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="profile_photo">Profile Photo</Label>
                                    <Input id="profile_photo" name="profile_photo" type="file" accept="image/*" />
                                    <InputError message={errors.profile_photo} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="employee_id">Employee ID</Label>
                                    <Input
                                        id="employee_id"
                                        name="employee_id"
                                        defaultValue={employee.employee_id ?? ''}
                                    />
                                    <InputError message={errors.employee_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="job_position">Job Position</Label>
                                    <Input
                                        id="job_position"
                                        name="job_position"
                                        defaultValue={employee.job_position ?? ''}
                                    />
                                    <InputError message={errors.job_position} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select name="role" defaultValue={employee.role}>
                                        <SelectTrigger id="role" className="w-full">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="employee">Employee</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.role} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="status">Account Status</Label>
                                    <Select name="status" defaultValue={employee.status}>
                                        <SelectTrigger id="status" className="w-full">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status} />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button type="submit" disabled={processing}>
                                    {processing && <Spinner />}
                                    Save Changes
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <a href={`/admin/employees/${employee.id}`}>Cancel</a>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

EditEmployee.layout = {
    breadcrumbs: [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'Employee Management', href: '/admin/employees' },
        { title: 'Edit Employee', href: '#' },
    ],
};
