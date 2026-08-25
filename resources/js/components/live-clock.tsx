import { useEffect, useState } from 'react';

export function LiveClock() {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000 * 30);

        return () => clearInterval(id);
    }, []);

    return (
        <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
            {now.toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            })}
            {' · '}
            {now.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
            })}
        </span>
    );
}
