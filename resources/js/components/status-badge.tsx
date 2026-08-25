import { cn } from '@/lib/utils';

const LIVE = new Set([
    'present',
    'approved',
    'submitted',
    'active',
    'available',
    'completed',
    'running',
    'resolved',
]);

const WAITING = new Set([
    'pending',
    'pending_approval',
    'needs_verification',
    'late',
    'processing',
    'on_break',
    'incomplete',
]);

/**
 * ARKA status language: teal solid = live/resolved, outline = waiting on
 * someone, neutral gray = closed. Never red.
 */
export function StatusBadge({
    status,
    className,
}: {
    status: string;
    className?: string;
}) {
    const key = status.toLowerCase();
    const label = status.replace(/_/g, ' ');

    const variant = LIVE.has(key)
        ? 'live'
        : WAITING.has(key)
          ? 'waiting'
          : 'closed';

    return (
        <span
            className={cn(
                'inline-flex w-fit items-center rounded-none border px-2 py-0.5 text-xs font-medium whitespace-nowrap capitalize',
                variant === 'live' &&
                    'border-primary bg-primary text-primary-foreground',
                variant === 'waiting' &&
                    'border-primary bg-transparent text-primary',
                variant === 'closed' &&
                    'border-border bg-muted text-muted-foreground',
                className,
            )}
        >
            {label}
        </span>
    );
}
