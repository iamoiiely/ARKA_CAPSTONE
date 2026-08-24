import { Link } from '@inertiajs/react';
import ArkaLogo from '@/components/arka-logo';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <div className="flex flex-col gap-8">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium lg:hidden"
                        >
                            <ArkaLogo className="h-12 w-auto text-[#0b1b3a]" />
                        </Link>

                        <div className="flex flex-col gap-2 text-center">
                            <h1 className="text-xl font-semibold">{title}</h1>
                            <p className="text-sm text-balance text-muted-foreground">
                                {description}
                            </p>
                        </div>
                        {children}
                    </div>
                </div>
            </div>

            <div className="relative hidden overflow-hidden bg-[#0b1b3a] lg:flex lg:flex-col lg:items-center lg:justify-center">
                <svg
                    className="absolute top-10 left-10 size-16 text-[#c9962c]/40"
                    viewBox="0 0 100 100"
                    fill="none"
                    stroke="currentColor"
                >
                    <circle cx="50" cy="50" r="46" strokeWidth="1" />
                    <path d="M50 4v92M4 50h92" strokeWidth="1" />
                    <path d="M50 20L58 50L50 80L42 50Z" strokeWidth="1" />
                </svg>
                <svg
                    className="absolute right-12 bottom-12 size-20 text-[#c9962c]/40"
                    viewBox="0 0 100 100"
                    fill="none"
                    stroke="currentColor"
                >
                    <circle cx="50" cy="50" r="46" strokeWidth="1" />
                    <path d="M50 4v92M4 50h92" strokeWidth="1" />
                    <path d="M50 20L58 50L50 80L42 50Z" strokeWidth="1" />
                </svg>

                <ArkaLogo className="relative z-10 h-40 w-auto text-white" />
                <p className="relative z-10 mt-6 text-sm tracking-[0.3em] text-[#c9962c] uppercase">
                    Payroll &amp; Attendance System
                </p>
            </div>
        </div>
    );
}
