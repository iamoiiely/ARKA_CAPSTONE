import { Head } from '@inertiajs/react';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard } from '@/routes/admin';
import devotionals from '@/routes/admin/devotionals';
import type { BreadcrumbItem } from '@/types';

type Devotional = { id: number; date: string; title: string; status: string };

type Props = {
    employee: { id: number; name: string };
    devotionals: {
        data: Devotional[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

export default function DevotionalHistory({
    employee,
    devotionals: list,
}: Props) {
    return (
        <>
            <Head title={`${employee.name} — Devotional History`} />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    eyebrow="Devotional Management"
                    title={`${employee.name} — History`}
                />

                <div className="border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {list.data.map((d) => (
                                <TableRow key={d.id}>
                                    <TableCell>{d.date}</TableCell>
                                    <TableCell>{d.title}</TableCell>
                                    <TableCell>Submitted</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Pagination links={list.links} />
                </div>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Devotionals', href: devotionals.index() },
];

DevotionalHistory.layout = { breadcrumbs };
