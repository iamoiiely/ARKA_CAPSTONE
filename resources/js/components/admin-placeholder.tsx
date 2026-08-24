import { Construction } from 'lucide-react';
import Heading from '@/components/heading';
import { Card, CardContent } from '@/components/ui/card';

export function AdminPlaceholder({
    title,
    description,
    planned,
}: {
    title: string;
    description: string;
    planned: string[];
}) {
    return (
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
            <Heading title={title} description={description} />

            <Card>
                <CardContent className="flex flex-col items-start gap-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Construction className="size-5" />
                        <span className="text-sm font-medium">Coming soon</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        This module is planned but not yet built. Based on the system
                        design, it will include:
                    </p>
                    <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                        {planned.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
