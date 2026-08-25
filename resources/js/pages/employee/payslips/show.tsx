import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import payslips from '@/routes/payslips';
import type { BreadcrumbItem } from '@/types';

type Payslip = {
    id: number;
    period_start: string;
    period_end: string;
    date_issued: string | null;
    earnings: string;
    gross_pay: string;
    total_deductions: string;
    net_pay: string;
    status: string;
    user: { name: string; employee_no: string };
};

export default function PayslipShow({ payslip }: { payslip: Payslip }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Head title="Payslip" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    eyebrow="Payslip"
                    title={`${payslip.period_start} – ${payslip.period_end}`}
                />

                <Card className="max-w-xl rounded-none">
                    <CardHeader>
                        <CardTitle>
                            {payslip.user.name} ({payslip.user.employee_no})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-muted-foreground">
                                    Pay Period
                                </p>
                                <p>
                                    {payslip.period_start} –{' '}
                                    {payslip.period_end}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">
                                    Date Issued
                                </p>
                                <p>{payslip.date_issued ?? '—'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">
                                    Earnings
                                </p>
                                <p>
                                    ₱{Number(payslip.earnings).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">
                                    Gross Pay
                                </p>
                                <p>
                                    ₱
                                    {Number(payslip.gross_pay).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">
                                    Total Deductions
                                </p>
                                <p>
                                    ₱
                                    {Number(
                                        payslip.total_deductions,
                                    ).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Net Pay</p>
                                <p className="text-lg font-semibold">
                                    ₱{Number(payslip.net_pay).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 border-t pt-4">
                            <Button
                                variant="outline"
                                onClick={() => window.print()}
                            >
                                Download as PDF
                            </Button>
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <button
                                        type="button"
                                        className="text-sm text-primary hover:underline"
                                    >
                                        Flag an issue with this payslip
                                    </button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Flag an Issue</DialogTitle>
                                    </DialogHeader>
                                    <Form
                                        {...payslips.flag.form(payslip.id)}
                                        onSuccess={() => setOpen(false)}
                                        resetOnSuccess
                                        className="space-y-4"
                                    >
                                        {({ processing, errors }) => (
                                            <>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="reason">
                                                        Reason
                                                    </Label>
                                                    <Input
                                                        id="reason"
                                                        name="reason"
                                                        required
                                                    />
                                                    <InputError
                                                        message={errors.reason}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="note">
                                                        Note (optional)
                                                    </Label>
                                                    <Textarea
                                                        id="note"
                                                        name="note"
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
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Payslip', href: payslips.index() },
];

PayslipShow.layout = { breadcrumbs };
