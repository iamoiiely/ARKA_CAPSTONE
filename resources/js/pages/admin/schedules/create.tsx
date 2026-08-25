import { Form, Head } from '@inertiajs/react';
import { PageHeader } from '@/components/page-header';
import { ScheduleFormFields } from '@/components/schedule-form-fields';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes/admin';
import schedules from '@/routes/admin/schedules';
import type { BreadcrumbItem } from '@/types';

type Props = {
    employees: { id: number; name: string }[];
    clients: { id: number; name: string }[];
};

export default function ScheduleCreate({ employees, clients }: Props) {
    return (
        <>
            <Head title="Add Schedule" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader eyebrow="Scheduling" title="Add Schedule" />

                <Form
                    {...schedules.store.form()}
                    className="max-w-2xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <ScheduleFormFields
                                employees={employees}
                                clients={clients}
                                errors={errors}
                            />
                            <Button type="submit" disabled={processing}>
                                {processing && <Spinner />}
                                Save Schedule
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
    { title: 'Schedules', href: schedules.index() },
    { title: 'Add Schedule', href: schedules.create() },
];

ScheduleCreate.layout = { breadcrumbs };
