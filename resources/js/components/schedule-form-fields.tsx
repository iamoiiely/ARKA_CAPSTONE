import { useEffect, useState } from 'react';
import InputError from '@/components/input-error';
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
import schedules from '@/routes/admin/schedules';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type Props = {
    employees: { id: number; name: string }[];
    clients: { id: number; name: string }[];
    errors: Partial<Record<string, string>>;
    defaults?: {
        user_id?: number;
        client_id?: number;
        job_position?: string;
        working_days?: string[];
        start_time?: string;
        end_time?: string;
        schedule_type?: string;
        expected_working_hours?: number;
        start_date?: string;
        end_date?: string | null;
        status?: string;
    };
    excludeScheduleId?: number;
};

export function ScheduleFormFields({
    employees,
    clients,
    errors,
    defaults,
    excludeScheduleId,
}: Props) {
    const [userId, setUserId] = useState(
        defaults?.user_id ? String(defaults.user_id) : '',
    );
    const [days, setDays] = useState<string[]>(defaults?.working_days ?? []);
    const [startTime, setStartTime] = useState(defaults?.start_time ?? '09:00');
    const [endTime, setEndTime] = useState(defaults?.end_time ?? '17:00');
    const [overlaps, setOverlaps] = useState(false);

    const inputsComplete = Boolean(
        userId && days.length > 0 && startTime && endTime,
    );

    useEffect(() => {
        if (!inputsComplete) {
            return;
        }

        const controller = new AbortController();
        fetch(schedules.checkOverlap().url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({
                user_id: Number(userId),
                working_days: days,
                start_time: startTime,
                end_time: endTime,
                exclude_schedule_id: excludeScheduleId,
            }),
            signal: controller.signal,
        })
            .then((r) => r.json())
            .then((data) => setOverlaps(Boolean(data.overlaps)))
            .catch(() => {});

        return () => controller.abort();
    }, [userId, days, startTime, endTime, excludeScheduleId, inputsComplete]);

    return (
        <>
            <Card className="rounded-none">
                <CardHeader>
                    <CardTitle>Assignment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="user_id">Employee</Label>
                        <Select
                            name="user_id"
                            value={userId}
                            onValueChange={setUserId}
                        >
                            <SelectTrigger
                                id="user_id"
                                className="rounded-none"
                            >
                                <SelectValue placeholder="Select employee" />
                            </SelectTrigger>
                            <SelectContent>
                                {employees.map((e) => (
                                    <SelectItem key={e.id} value={String(e.id)}>
                                        {e.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.user_id} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="client_id">Client</Label>
                        <Select
                            name="client_id"
                            defaultValue={
                                defaults?.client_id
                                    ? String(defaults.client_id)
                                    : undefined
                            }
                        >
                            <SelectTrigger
                                id="client_id"
                                className="rounded-none"
                            >
                                <SelectValue placeholder="Select client" />
                            </SelectTrigger>
                            <SelectContent>
                                {clients.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.client_id} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="job_position">Job Position</Label>
                        <Input
                            id="job_position"
                            name="job_position"
                            defaultValue={defaults?.job_position}
                            required
                        />
                        <InputError message={errors.job_position} />
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-none">
                <CardHeader>
                    <CardTitle>Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Working Days</Label>
                        <div className="flex flex-wrap gap-2">
                            {DAYS.map((day) => {
                                const checked = days.includes(day);

                                return (
                                    <label
                                        key={day}
                                        className={`cursor-pointer border px-3 py-1.5 text-sm ${checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}
                                    >
                                        <input
                                            type="checkbox"
                                            name="working_days[]"
                                            value={day}
                                            checked={checked}
                                            onChange={(e) =>
                                                setDays(
                                                    e.target.checked
                                                        ? [...days, day]
                                                        : days.filter(
                                                              (d) => d !== day,
                                                          ),
                                                )
                                            }
                                            className="sr-only"
                                        />
                                        {day}
                                    </label>
                                );
                            })}
                        </div>
                        <InputError message={errors.working_days} />
                        {overlaps && inputsComplete && (
                            <p className="border border-arka-gold bg-arka-gold/10 px-3 py-2 text-xs text-foreground">
                                This employee already has an active schedule
                                overlapping these days/times. You can still save
                                if this is intentional.
                            </p>
                        )}
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="start_time">Start Time</Label>
                            <Input
                                id="start_time"
                                type="time"
                                name="start_time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                required
                            />
                            <InputError message={errors.start_time} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="end_time">End Time</Label>
                            <Input
                                id="end_time"
                                type="time"
                                name="end_time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                required
                            />
                            <InputError message={errors.end_time} />
                        </div>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="schedule_type">Schedule Type</Label>
                            <Select
                                name="schedule_type"
                                defaultValue={
                                    defaults?.schedule_type ?? 'flexible'
                                }
                            >
                                <SelectTrigger
                                    id="schedule_type"
                                    className="rounded-none"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="flexible">
                                        Flexible
                                    </SelectItem>
                                    <SelectItem value="strict">
                                        Strict
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.schedule_type} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="expected_working_hours">
                                Expected Working Hours
                            </Label>
                            <Input
                                id="expected_working_hours"
                                type="number"
                                step="0.5"
                                name="expected_working_hours"
                                defaultValue={
                                    defaults?.expected_working_hours ?? 8
                                }
                                required
                            />
                            <InputError
                                message={errors.expected_working_hours}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="start_date">Start Date</Label>
                            <Input
                                id="start_date"
                                type="date"
                                name="start_date"
                                defaultValue={defaults?.start_date}
                                required
                            />
                            <InputError message={errors.start_date} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="end_date">
                                End Date (optional)
                            </Label>
                            <Input
                                id="end_date"
                                type="date"
                                name="end_date"
                                defaultValue={defaults?.end_date ?? ''}
                            />
                            <InputError message={errors.end_date} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            name="status"
                            defaultValue={defaults?.status ?? 'active'}
                        >
                            <SelectTrigger id="status" className="rounded-none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">
                                    Inactive
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
