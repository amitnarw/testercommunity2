
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Smartphone, Star } from 'lucide-react';
import type { CommunityApp } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CommunityAppCardProps {
    app: CommunityApp;
    isPreview?: boolean;
}

export function CommunityAppCard({ app, isPreview = false }: CommunityAppCardProps) {
    return (
        <div className={cn(
            "group flex flex-col md:flex-row items-start md:items-center gap-6 p-6 rounded-xl transition-all duration-300 w-full",
            !isPreview && "hover:bg-secondary/80 hover:shadow-md"
        )}>
            <Image src={app.icon} alt={app.name} width={80} height={80} className="rounded-2xl border flex-shrink-0" data-ai-hint={app.dataAiHint}/>
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold">{app.name}</h3>
                        <p className="text-sm text-muted-foreground">{app.shortDescription}</p>
                    </div>
                    <Badge variant="secondary" className="hidden sm:inline-flex">{app.category}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-400"/>
                        <span className="font-semibold text-primary">{app.points} Points</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4"/>
                        <span>Android {app.androidVersion}</span>
                    </div>
                </div>
            </div>
            {!isPreview && (
                 <Button asChild className="ml-auto flex-shrink-0">
                    <Link href={`/community-dashboard/test/${app.id}`}>Test App <ArrowRight className="ml-2 h-4 w-4"/></Link>
                </Button>
            )}
        </div>
    );
}
