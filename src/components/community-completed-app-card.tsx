
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Star } from 'lucide-react';
import type { CommunityApp } from '@/lib/types';
import { Separator } from './ui/separator';

interface CommunityCompletedAppCardProps {
    app: CommunityApp;
}

export function CommunityCompletedAppCard({ app }: CommunityCompletedAppCardProps) {
    return (
        <Card className="flex flex-col h-full overflow-hidden rounded-xl transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1 group bg-secondary/30">
            <CardHeader className="p-0 relative">
                <div className="relative w-full h-40">
                    <Image
                        src={app.screenshots[0]?.url || 'https://placehold.co/400x300.png'}
                        alt={app.name}
                        layout="fill"
                        objectFit="cover"
                        className="group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint={app.screenshots[0]?.dataAiHint || 'app screenshot'}
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                 <Badge variant="secondary" className="absolute top-3 right-3">{app.category}</Badge>
                 <Image src={app.icon} alt={app.name} width={56} height={56} className="absolute bottom-0 left-4 translate-y-1/2 rounded-xl border-4 border-background" data-ai-hint={app.dataAiHint} />
            </CardHeader>
            <CardContent className="p-4 pt-10 flex-grow">
                <h3 className="text-lg font-bold transition-colors">{app.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 h-10 line-clamp-2">{app.shortDescription}</p>
                 <div className='mt-4 p-3 bg-background/50 rounded-lg'>
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
            </CardContent>
            <CardFooter className="flex-col items-start gap-3 p-4 pt-0">
                 <Button asChild className="w-full" variant="outline">
                    <Link href={`/community-dashboard/test/${app.id}/feedback`}>
                        View Feedback <CheckCircle className="ml-2 h-4 w-4"/>
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

