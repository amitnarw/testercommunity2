
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Smartphone, Star } from 'lucide-react';
import type { CommunityApp } from '@/lib/types';
import { Badge } from './ui/badge';

interface AvailableAppRowProps extends React.HTMLAttributes<HTMLDivElement> {
    app: CommunityApp;
}

export function AvailableAppRow({ app, ...props }: AvailableAppRowProps) {
    return (
        <div 
            className="group flex items-center justify-between gap-4 p-4 border-b transition-colors hover:bg-secondary/50"
            {...props}
        >
            <div className="flex items-center gap-4">
                <Image src={app.icon} alt={app.name} width={48} height={48} className="rounded-lg border" data-ai-hint={app.dataAiHint}/>
                <div>
                    <h3 className="font-semibold">{app.name}</h3>
                    <p className="text-sm text-muted-foreground">{app.shortDescription}</p>
                </div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm">
                <Badge variant="outline" className="rounded-full">{app.category}</Badge>
                <div className="flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-muted-foreground"/>
                    <span className="text-muted-foreground">Android {app.androidVersion}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400"/>
                    <span className="font-bold text-primary">{app.points} Points</span>
                </div>
            </div>
             <Button asChild className="opacity-0 group-hover:opacity-100 transition-opacity" variant="ghost">
                <Link href={`/community-dashboard/test/${app.id}`}>Test App <ArrowRight className="ml-2 h-4 w-4"/></Link>
            </Button>
        </div>
    );
}
