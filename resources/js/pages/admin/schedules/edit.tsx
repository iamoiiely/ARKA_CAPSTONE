import { Form, Head } from '@inertiajs/react';
import { PageHeader } from '@/components/page-header';
import { ScheduleFormFields } from '@/components/schedule-form-fields';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes/admin';
import schedules from '@/routes/admin/schedules';
import type { BreadcrumbItem } from '@/types';

type Schedule = {
    id: number;
    user_id: number;
    client_id: number;
    job_position: string;
    working_days: string[];
    start_time: string;
    end_time: string;
    schedule_type: string;
    expected_working_hours: number;
    start_date: string;
    end_date: string | null;
    status: string;
};

type Props = {
    schedule: Schedule;
    employees: { id: number; name: string }[];
    clients: { id: number; name: string }[];
};

export default function ScheduleEdit({ schedule, employees, clients }: Props) {
    return (
        <>
            <Head title="Edit Schedule" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader eyebrow="Scheduling" title="Edit Schedule" />

                <Form
                    {...schedules.update.form(schedule.id)}
                    className="max-w-2xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <ScheduleFormFields
                                employees={employees}
                                clients={clients}
                                errors={errors}
                                excludeScheduleId={schedule.id}
                                defaults={{
                                    user_id: schedule.user_id,
                                    client_id: schedule.client_id,
                                    job_position: schedule.job_position,
                                    working_days: schedule.working_days,
                                    start_time: schedule.start_time,
                                    end_time: schedule.end_time,
                                    schedule_type: schedule.schedule_type,
                                    expected_working_hours:
                                        schedule.expected_working_hours,
                                    start_date: schedule.start_date,
                                    end_date: schedule.end_date,
                                    status: schedule.status,
                                }}
                            />
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
    { title: 'Schedules', href: schedules.index() },
    { title: 'Edit Schedule', href: schedules.index() },
];

ScheduleEdit.layout = { breadcrumbs };
