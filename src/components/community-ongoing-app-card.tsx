
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CommunityApp } from '@/lib/types';
import { Progress } from './ui/progress';

interface CommunityOngoingAppCardProps {
    app: CommunityApp;
}

export function CommunityOngoingAppCard({ app }: CommunityOngoingAppCardProps) {
    return (
        <Link href={`/community-dashboard/test/${app.id}/ongoing`} className="group block">
            <Card className="flex flex-col h-full overflow-hidden rounded-xl transition-all duration-300 group-hover:shadow-primary/20 group-hover:-translate-y-1">
                <CardHeader className="p-0 relative flex justify-center items-center h-40 bg-secondary">
                     <Image 
                        src={app.icon} 
                        alt={app.name} 
                        width={80} 
                        height={80} 
                        className="rounded-2xl border-4 border-background group-hover:scale-110 transition-transform duration-300" 
                        data-ai-hint={app.dataAiHint} 
                    />
                    <Badge variant="secondary" className="absolute top-3 right-3">{app.category}</Badge>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{app.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 h-10 line-clamp-2">{app.shortDescription}</p>
                </CardContent>
                <CardFooter className="flex-col items-start gap-3 p-4 pt-0">
                    <div className='w-full'>
                        <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                            <span>Progress</span>
                            <span>{app.progress}%</span>
                        </div>
                        <Progress value={app.progress} className="h-2" />
                    </div>
                     <div className="text-primary font-semibold text-sm w-full text-center py-2 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors mt-2">
                        Continue Testing
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
