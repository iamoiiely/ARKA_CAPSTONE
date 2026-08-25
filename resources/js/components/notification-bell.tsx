import { Link, router, usePage } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    index as notificationsIndex,
    markAllRead,
} from '@/routes/notifications';

export function NotificationBell() {
    const { notifications } = usePage().props;

    if (!notifications) {
        return null;
    }

    const { unreadCount, recent } = notifications;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="relative flex size-9 items-center justify-center rounded-none border border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                >
                    <Bell className="size-5" strokeWidth={1.5} />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-arka-gold text-[10px] font-semibold text-arka-navy">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-none p-0">
                <div className="flex items-center justify-between border-b px-3 py-2">
                    <span className="text-sm font-medium">Notifications</span>
                    {unreadCount > 0 && (
                        <button
                            type="button"
                            className="text-xs text-primary hover:underline"
                            onClick={() =>
                                router.post(
                                    markAllRead().url,
                                    {},
                                    { preserveScroll: true },
                                )
                            }
                        >
                            Mark all as read
                        </button>
                    )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                    {recent.length === 0 && (
                        <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                            No notifications yet.
                        </p>
                    )}
                    {recent.map((n) => (
                        <div
                            key={n.id}
                            className={`border-b px-3 py-2 last:border-b-0 ${n.read_at ? '' : 'bg-accent'}`}
                        >
                            <p className="text-sm font-medium">
                                {n.data.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {n.data.message}
                            </p>
                            <p className="mt-1 text-[11px] text-muted-foreground">
                                {new Date(n.created_at).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
                <Link
                    href={notificationsIndex()}
                    className="block border-t px-3 py-2 text-center text-xs text-primary hover:underline"
                >
                    View all notifications
                </Link>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
