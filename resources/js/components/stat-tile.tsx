import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function StatTile({
    label,
    value,
    className,
}: {
    label: string;
    value: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn('border border-border bg-card px-4 py-3', className)}
        >
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {label}
            </p>
            <p className="mt-1 font-sans text-2xl font-semibold text-foreground">
                {value}
            </p>
        </div>
    );
}
