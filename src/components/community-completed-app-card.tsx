
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import type { CommunityApp } from '@/lib/types';

interface CommunityCompletedAppCardProps {
    app: CommunityApp;
}

export function CommunityCompletedAppCard({ app }: CommunityCompletedAppCardProps) {
    return (
        <Link href={`/community-dashboard/test/${app.id}/completed`} className="group block">
            <Card className="flex flex-col h-full overflow-hidden rounded-xl transition-all duration-300 group-hover:shadow-primary/20 group-hover:-translate-y-1 bg-secondary/30">
                <CardHeader className="p-0 relative flex justify-center items-center h-40 bg-secondary/80 overflow-hidden">
                    <Image 
                        src={app.icon} 
                        alt={app.name} 
                        layout="fill"
                        objectFit="cover"
                        className="group-hover:scale-110 transition-transform duration-300" 
                        data-ai-hint={app.dataAiHint} 
                    />
                    <Badge variant="secondary" className="absolute top-3 right-3 z-10">{app.category}</Badge>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                    <h3 className="text-lg font-bold transition-colors">{app.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 h-10 line-clamp-2">{app.shortDescription}</p>
                </CardContent>
                <CardFooter className="flex-col items-start gap-3 p-4 pt-0">
                    <div className='w-full p-3 bg-background/50 rounded-lg'>
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                            <span>Points Claimed</span>
                            <div className="flex items-center gap-1.5 text-green-500 font-bold">
                                <Star className="w-4 h-4 fill-green-500"/>
                                <span>{app.points}</span>
                            </div>
                        </div>
                        {app.completedDate && (
                            <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
                                <span>Completed</span>
                                <span>{new Date(app.completedDate).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                     <div className="text-foreground font-semibold text-sm w-full text-center py-2 bg-secondary rounded-lg group-hover:bg-muted transition-colors mt-2">
                        View Feedback
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
