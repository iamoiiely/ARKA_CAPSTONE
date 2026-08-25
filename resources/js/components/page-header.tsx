import type { ReactNode } from 'react';

export function PageHeader({
    eyebrow,
    title,
    action,
}: {
    eyebrow: string;
    title: string;
    action?: ReactNode;
}) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div>
                <p className="font-sans text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                    {eyebrow}
                </p>
                <h1 className="font-sans text-2xl font-semibold text-foreground">
                    {title}
                </h1>
            </div>
            {action}
        </div>
    );
}
