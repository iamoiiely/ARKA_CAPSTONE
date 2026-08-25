import { Form, Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInitials } from '@/hooks/use-initials';
import { edit } from '@/routes/profile';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

export default function Profile() {
    const { auth } = usePage<PageProps>().props;
    const getInitials = useInitials();
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Profile"
                    description="Update your personal information"
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{ preserveScroll: true }}
                    encType="multipart/form-data"
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label>Profile photo</Label>
                                <div className="flex items-center gap-4">
                                    <Avatar className="size-16 rounded-none">
                                        <AvatarImage
                                            src={
                                                photoPreview ??
                                                (auth.user.photo_path
                                                    ? `/storage/${auth.user.photo_path}`
                                                    : undefined)
                                            }
                                            alt={auth.user.name}
                                        />
                                        <AvatarFallback className="rounded-none text-lg">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Input
                                        id="photo"
                                        type="file"
                                        name="photo"
                                        accept="image/*"
                                        className="max-w-xs"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            setPhotoPreview(
                                                file
                                                    ? URL.createObjectURL(file)
                                                    : null,
                                            );
                                        }}
                                    />
                                </div>
                                <InputError message={errors.photo} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Full name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={auth.user.name}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="birthday">Birthday</Label>
                                    <Input
                                        id="birthday"
                                        type="date"
                                        name="birthday"
                                        defaultValue={auth.user.birthday ?? ''}
                                    />
                                    <InputError message={errors.birthday} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="age">Age</Label>
                                    <Input
                                        id="age"
                                        value={auth.user.age ?? '—'}
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone number</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    defaultValue={auth.user.phone ?? ''}
                                />
                                <InputError message={errors.phone} />
                            </div>

                            <div className="grid gap-2 border-t pt-6 sm:grid-cols-3">
                                <div className="grid gap-1">
                                    <Label className="text-muted-foreground">
                                        Employee ID
                                    </Label>
                                    <p className="text-sm">
                                        {auth.user.employee_no}
                                    </p>
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-muted-foreground">
                                        Email
                                    </Label>
                                    <p className="text-sm">{auth.user.email}</p>
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-muted-foreground">
                                        Role
                                    </Label>
                                    <p className="text-sm capitalize">
                                        {auth.user.role.replace('_', ' ')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    Save changes
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};
