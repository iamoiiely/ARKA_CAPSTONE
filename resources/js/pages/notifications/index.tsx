import { Head, router } from '@inertiajs/react';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { markAllRead } from '@/routes/notifications';
import type { AppNotification } from '@/types';

type Props = {
    items: {
        data: AppNotification[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

export default function NotificationsIndex({ items }: Props) {
    return (
        <>
            <Head title="Notifications" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    eyebrow="Notifications"
                    title="All Notifications"
                    action={
                        <Button
                            variant="outline"
                            onClick={() => router.post(markAllRead().url)}
                        >
                            Mark all as read
                        </Button>
                    }
                />

                <div className="border">
                    {items.data.map((n) => (
                        <div
                            key={n.id}
                            className={`border-b px-4 py-3 last:border-b-0 ${n.read_at ? '' : 'bg-accent'}`}
                        >
                            <p className="text-sm font-medium">
                                {n.data.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {n.data.message}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {new Date(n.created_at).toLocaleString()}
                            </p>
                        </div>
                    ))}
                    {items.data.length === 0 && (
                        <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                            No notifications yet.
                        </p>
                    )}
                    <Pagination links={items.links} />
                </div>
            </div>
        </>
    );
}
