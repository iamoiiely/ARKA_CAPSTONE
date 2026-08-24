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

export default function CreateEmployee() {
    return (
        <>
            <Head title="Add Employee" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:max-w-2xl md:p-6">
                <Heading
                    title="Add Employee"
                    description="Employee accounts are created by the administrator. The new employee will receive an email to set their password."
                />

                <Form
                    action="/admin/employees"
                    method="post"
                    encType="multipart/form-data"
                    className="space-y-8"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Personal Information
                                </h3>

                                <div className="grid gap-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" name="name" required />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="birthday">Birthday</Label>
                                    <Input id="birthday" name="birthday" type="date" />
                                    <InputError message={errors.birthday} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone_number">Phone Number</Label>
                                    <Input id="phone_number" name="phone_number" />
                                    <InputError message={errors.phone_number} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" name="email" type="email" required />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="profile_photo">Profile Photo</Label>
                                    <Input id="profile_photo" name="profile_photo" type="file" accept="image/*" />
                                    <InputError message={errors.profile_photo} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Employment Information
                                </h3>

                                <div className="grid gap-2">
                                    <Label htmlFor="employee_id">Employee ID</Label>
                                    <Input id="employee_id" name="employee_id" placeholder="Leave blank to auto-generate" />
                                    <InputError message={errors.employee_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="job_position">Job Position</Label>
                                    <Input id="job_position" name="job_position" />
                                    <InputError message={errors.job_position} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select name="role" defaultValue="employee">
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
                                    <Select name="status" defaultValue="active">
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
                                    Save
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <a href="/admin/employees">Cancel</a>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

CreateEmployee.layout = {
    breadcrumbs: [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'Employee Management', href: '/admin/employees' },
        { title: 'Add Employee', href: '/admin/employees/create' },
    ],
};
