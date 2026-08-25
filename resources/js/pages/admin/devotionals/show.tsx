import { Head } from '@inertiajs/react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes/admin';
import devotionals from '@/routes/admin/devotionals';
import type { BreadcrumbItem } from '@/types';

type Devotional = {
    id: number;
    date: string;
    title: string;
    file_path: string;
    file_name: string;
    file_size: number;
    submitted_at: string;
    user: { name: string };
};

export default function DevotionalShow({
    devotional,
}: {
    devotional: Devotional;
}) {
    return (
        <>
            <Head title={devotional.title} />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    eyebrow="Devotional Management"
                    title={devotional.title}
                />

                <Card className="max-w-xl rounded-none">
                    <CardHeader>
                        <CardTitle>
                            {devotional.user.name} — {devotional.date}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div>
                            <p className="text-muted-foreground">File</p>
                            <p>{devotional.file_name}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Size</p>
                            <p>{(devotional.file_size / 1024).toFixed(0)} KB</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">
                                Submitted At
                            </p>
                            <p>
                                {new Date(
                                    devotional.submitted_at,
                                ).toLocaleString()}
                            </p>
                        </div>
                        <Button variant="outline" asChild>
                            <a
                                href={`/storage/${devotional.file_path}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                View File
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Devotionals', href: devotionals.index() },
];

DevotionalShow.layout = { breadcrumbs };
