import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { dashboard } from '@/routes/admin';
import payslipManagement from '@/routes/admin/payslip-management';
import type { BreadcrumbItem } from '@/types';

export default function PayslipManagementCreate({
    employees,
}: {
    employees: { id: number; name: string }[];
}) {
    return (
        <>
            <Head title="Issue Payslip" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader eyebrow="Super Admin" title="Issue Payslip" />

                <Form {...payslipManagement.store.form()} className="max-w-xl">
                    {({ processing, errors }) => (
                        <Card className="rounded-none">
                            <CardHeader>
                                <CardTitle>Payslip Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="user_id">Employee</Label>
                                    <Select name="user_id">
                                        <SelectTrigger
                                            id="user_id"
                                            className="rounded-none"
                                        >
                                            <SelectValue placeholder="Select employee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {employees.map((e) => (
                                                <SelectItem
                                                    key={e.id}
                                                    value={String(e.id)}
                                                >
                                                    {e.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.user_id} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="period_start">
                                            Period Start
                                        </Label>
                                        <Input
                                            id="period_start"
                                            type="date"
                                            name="period_start"
                                            required
                                        />
                                        <InputError
                                            message={errors.period_start}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="period_end">
                                            Period End
                                        </Label>
                                        <Input
                                            id="period_end"
                                            type="date"
                                            name="period_end"
                                            required
                                        />
                                        <InputError
                                            message={errors.period_end}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="earnings">
                                            Earnings
                                        </Label>
                                        <Input
                                            id="earnings"
                                            type="number"
                                            step="0.01"
                                            name="earnings"
                                            required
                                        />
                                        <InputError message={errors.earnings} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="total_deductions">
                                            Total Deductions
                                        </Label>
                                        <Input
                                            id="total_deductions"
                                            type="number"
                                            step="0.01"
                                            name="total_deductions"
                                            defaultValue={0}
                                            required
                                        />
                                        <InputError
                                            message={errors.total_deductions}
                                        />
                                    </div>
                                </div>
                                <Button type="submit" disabled={processing}>
                                    {processing && <Spinner />}
                                    Issue Payslip
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </Form>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Payslip Management', href: payslipManagement.index() },
    { title: 'Issue Payslip', href: payslipManagement.create() },
];

PayslipManagementCreate.layout = { breadcrumbs };
