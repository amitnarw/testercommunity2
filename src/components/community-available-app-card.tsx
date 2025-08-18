
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Star } from 'lucide-react';
import type { CommunityApp } from '@/lib/types';
import { Separator } from './ui/separator';

interface CommunityAvailableAppCardProps {
    app: CommunityApp;
}

export function CommunityAvailableAppCard({ app }: CommunityAvailableAppCardProps) {
    return (
        <Link href={`/community-dashboard/test/${app.id}`} className="group block">
            <Card className="flex flex-col h-full overflow-hidden rounded-xl transition-all duration-300 group-hover:shadow-primary/20 group-hover:-translate-y-1">
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
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{app.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 h-10 line-clamp-2">{app.shortDescription}</p>
                </CardContent>
                <CardFooter className="flex-col items-start gap-3 p-4 pt-0">
                    <Separator />
                    <div className="flex justify-between w-full text-sm">
                        <div className="flex items-center gap-1.5 text-primary font-bold">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400"/>
                            <span>{app.points} Points</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="w-4 h-4"/>
                            <span>{app.estimatedTime}</span>
                        </div>
                    </div>
                    <div className="text-primary font-semibold text-sm w-full text-center py-2 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Start Testing
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
