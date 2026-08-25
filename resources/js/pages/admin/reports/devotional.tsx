import { Head, router } from '@inertiajs/react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard } from '@/routes/admin';
import reports from '@/routes/admin/reports';
import type { BreadcrumbItem } from '@/types';

type Props = {
    summary: Record<string, { submitted: number }>;
    details: { date: string; employee: string; title: string }[];
    filters: { employee_id?: string; from?: string; to?: string };
    employees: { id: number; name: string }[];
};

export default function DevotionalReport({
    summary,
    details,
    filters,
    employees,
}: Props) {
    const apply = (overrides: Partial<typeof filters>) => {
        router.get(
            reports.devotional().url,
            { ...filters, ...overrides },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Devotional Report" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader eyebrow="Reports" title="Devotional Report" />

                <div className="flex flex-wrap items-center gap-3">
                    <Select
                        value={filters.employee_id ?? 'all'}
                        onValueChange={(v) =>
                            apply({ employee_id: v === 'all' ? undefined : v })
                        }
                    >
                        <SelectTrigger className="w-48 rounded-none">
                            <SelectValue placeholder="Employee" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All employees</SelectItem>
                            {employees.map((e) => (
                                <SelectItem key={e.id} value={String(e.id)}>
                                    {e.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        type="date"
                        className="w-40 rounded-none"
                        defaultValue={filters.from}
                        onChange={(e) => apply({ from: e.target.value })}
                    />
                    <Input
                        type="date"
                        className="w-40 rounded-none"
                        defaultValue={filters.to}
                        onChange={(e) => apply({ to: e.target.value })}
                    />
                    <Button variant="outline" onClick={() => apply({})}>
                        Generate Report
                    </Button>
                </div>

                <Card className="rounded-none">
                    <CardHeader>
                        <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Submitted</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.entries(summary).map(([name, s]) => (
                                    <TableRow key={name}>
                                        <TableCell>{name}</TableCell>
                                        <TableCell>{s.submitted}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="rounded-none">
                    <CardHeader>
                        <CardTitle>Details</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Title</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {details.map((d, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{d.date}</TableCell>
                                        <TableCell>{d.employee}</TableCell>
                                        <TableCell>{d.title}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Reports', href: reports.index() },
    { title: 'Devotional Report', href: reports.devotional() },
];

DevotionalReport.layout = { breadcrumbs };
