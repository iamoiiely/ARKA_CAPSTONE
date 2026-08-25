import { Head, Link } from '@inertiajs/react';
import { PageHeader } from '@/components/page-header';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard } from '@/routes/admin';
import reports from '@/routes/admin/reports';
import type { BreadcrumbItem } from '@/types';

export default function ReportsIndex() {
    return (
        <>
            <Head title="Reports" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader eyebrow="Reports" title="Overview" />

                <div className="grid gap-4 md:grid-cols-3">
                    <Link href={reports.attendance()}>
                        <Card className="rounded-none transition-colors hover:border-primary">
                            <CardHeader>
                                <CardTitle>Attendance Report</CardTitle>
                                <CardDescription>
                                    Present, late, absent, and leave by
                                    employee.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                    <Link href={reports.leave()}>
                        <Card className="rounded-none transition-colors hover:border-primary">
                            <CardHeader>
                                <CardTitle>Leave Summary</CardTitle>
                                <CardDescription>
                                    Paid and unpaid leave totals by employee.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                    <Link href={reports.devotional()}>
                        <Card className="rounded-none transition-colors hover:border-primary">
                            <CardHeader>
                                <CardTitle>Devotional Report</CardTitle>
                                <CardDescription>
                                    Submission compliance by employee.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                </div>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Reports', href: reports.index() },
];

ReportsIndex.layout = { breadcrumbs };
