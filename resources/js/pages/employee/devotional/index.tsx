import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard } from '@/routes';
import devotional from '@/routes/devotional';
import type { BreadcrumbItem } from '@/types';

type Devotional = {
    id: number;
    date: string;
    title: string;
    file_name: string;
    file_size: number;
    file_path: string;
};

type Props = {
    todaysDevotional: Devotional | null;
    records: {
        data: Devotional[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    compliance: string;
};

export default function DevotionalIndex({
    todaysDevotional,
    records,
    compliance,
}: Props) {
    return (
        <>
            <Head title="Devotional" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    eyebrow="Devotional"
                    title={new Date().toLocaleDateString(undefined, {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                    })}
                />
                <p className="-mt-4 text-sm text-muted-foreground">
                    Submitted {compliance} this month
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                    {!todaysDevotional ? (
                        <Card className="rounded-none">
                            <CardHeader>
                                <CardTitle>Today's Devotional</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    {...devotional.store.form()}
                                    encType="multipart/form-data"
                                    resetOnSuccess
                                    className="space-y-4"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="title">
                                                    Title
                                                </Label>
                                                <Input
                                                    id="title"
                                                    name="title"
                                                    required
                                                />
                                                <InputError
                                                    message={errors.title}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="file">
                                                    File (PDF, DOCX, JPG, PNG —
                                                    max 10MB)
                                                </Label>
                                                <Input
                                                    id="file"
                                                    type="file"
                                                    name="file"
                                                    required
                                                />
                                                <InputError
                                                    message={errors.file}
                                                />
                                            </div>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing && <Spinner />}
                                                Submit
                                            </Button>
                                        </>
                                    )}
                                </Form>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="rounded-none border-primary">
                            <CardHeader>
                                <CardTitle>Already Submitted</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <p>
                                    <span className="text-muted-foreground">
                                        File:
                                    </span>{' '}
                                    {todaysDevotional.file_name}
                                </p>
                                <p>
                                    <span className="text-muted-foreground">
                                        Size:
                                    </span>{' '}
                                    {(
                                        todaysDevotional.file_size / 1024
                                    ).toFixed(0)}{' '}
                                    KB
                                </p>
                                <Button variant="outline" asChild>
                                    <a
                                        href={`/storage/${todaysDevotional.file_path}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        View File
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <Card className="rounded-none">
                    <CardHeader>
                        <CardTitle>My Devotional Record</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>File Name</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {records.data.map((d) => (
                                    <TableRow key={d.id}>
                                        <TableCell>{d.date}</TableCell>
                                        <TableCell>{d.file_name}</TableCell>
                                        <TableCell>
                                            {(d.file_size / 1024).toFixed(0)} KB
                                        </TableCell>
                                        <TableCell>
                                            <a
                                                href={`/storage/${d.file_path}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-primary hover:underline"
                                            >
                                                View
                                            </a>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {records.data.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="py-8 text-center text-muted-foreground"
                                        >
                                            No submissions yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <Pagination links={records.links} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Devotional', href: devotional.index() },
];

DevotionalIndex.layout = { breadcrumbs };
