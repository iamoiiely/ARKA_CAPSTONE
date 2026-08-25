import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { PageHeader } from '@/components/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useInitials } from '@/hooks/use-initials';
import { dashboard } from '@/routes/admin';
import employees from '@/routes/admin/employees';
import type { BreadcrumbItem } from '@/types';

type Employee = {
    id: number;
    name: string;
    birthday: string | null;
    phone: string | null;
    photo_path: string | null;
};

export default function EmployeeEdit({ employee }: { employee: Employee }) {
    const getInitials = useInitials();

    return (
        <>
            <Head title={`Edit ${employee.name}`} />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    eyebrow="Employee Management"
                    title={`Edit ${employee.name}`}
                />

                <Form
                    {...employees.update.form(employee.id)}
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
                                    <div className="flex items-center gap-4">
                                        <Avatar className="size-16 rounded-none">
                                            <AvatarImage
                                                src={
                                                    employee.photo_path
                                                        ? `/storage/${employee.photo_path}`
                                                        : undefined
                                                }
                                                alt={employee.name}
                                            />
                                            <AvatarFallback className="rounded-none text-lg">
                                                {getInitials(employee.name)}
                                            </AvatarFallback>
                                        </Avatar>
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
                                            <InputError
                                                message={errors.photo}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={employee.name}
                                            required
                                        />
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
                                                defaultValue={
                                                    employee.birthday ?? ''
                                                }
                                            />
                                            <InputError
                                                message={errors.birthday}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="phone">
                                                Phone Number
                                            </Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                defaultValue={
                                                    employee.phone ?? ''
                                                }
                                            />
                                            <InputError
                                                message={errors.phone}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Button type="submit" disabled={processing}>
                                {processing && <Spinner />}
                                Save Changes
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
];

EmployeeEdit.layout = { breadcrumbs };
