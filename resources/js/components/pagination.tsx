import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export function Pagination({ links }: { links: PaginationLink[] }) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-1 border-t px-3 py-3">
            {links.map((link, i) => (
                <Link
                    key={i}
                    href={link.url ?? '#'}
                    preserveScroll
                    className={cn(
                        'flex h-8 min-w-8 items-center justify-center rounded-none border px-2 text-xs',
                        link.active
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border text-muted-foreground hover:bg-accent',
                        !link.url && 'pointer-events-none opacity-40',
                    )}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}
