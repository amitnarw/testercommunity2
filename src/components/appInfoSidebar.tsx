"use client"

import { useTheme } from 'next-themes';
import Image from 'next/image';
import { Send, Star, Smartphone, Clock, SquareArrowOutUpRight } from 'lucide-react';
import AnimatedRoundedButton from '@/components/ui/animated-rounded-button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const AppInfoSidebar = ({ app, handleRequestToJoin, buttonType, url }: { app: any, handleRequestToJoin?: () => void, buttonType?: string, url?: string }) => {
    const { theme } = useTheme();

    const hoverTextColor = theme === 'dark' ? 'black' : 'white';
    const hoverBgColor = theme === 'dark' ? 'white' : 'black';

    return (
        <div className="sticky top-24 space-y-6">
            <div onClick={handleRequestToJoin} className='w-full m-auto'>
                {!buttonType ?
                    <>
                        <AnimatedRoundedButton
                            backgroundColor="hsl(var(--primary))"
                            animatedBackgroundColor={hoverBgColor}
                            hoverTextColor={hoverTextColor}
                            borderRadius='9999px'
                            paddingY="4"
                            paddingX="0"
                            className='py-2 sm:py-4 text-sm sm:text-base'
                        >
                            <div className="flex items-center text-center gap-2">
                                <span className="w-full">Request to Join Testing</span>
                            </div>
                        </AnimatedRoundedButton>

                    </>
                    :
                    <a href={url} target='_blank' className='flex flex-row gap-2 w-full border border-primary/50 rounded-full items-center justify-center py-2 text-primary'
                    >
                        Re-open Google Play <SquareArrowOutUpRight size={20} />
                    </a>
                }
            </div>

            <Card className="border-0 rounded-2xl shadow-xl shadow-gray-100 dark:shadow-gray-900 overflow-hidden">
                <CardContent className="p-6 pb-0">
                    <div className="flex items-center gap-4 mb-4">
                        <Image src={app.icon} alt={app.name} width={100} height={100} className="rounded-xl border bg-background shadow-sm" data-ai-hint={app.dataAiHint} />
                        <div className='flex flex-col items-start justify-between gap-2'>
                            <Badge variant="outline" className="mt-1 text-md border-none bg-gradient-to-b from-primary to-primary/50 !text-white text-normal">{app.category}</Badge>
                            <div className="flex items-center gap-2 text-xs sm:text-sm"><Smartphone className="w-5 h-5 text-primary/80" />Android {app.androidVersion}</div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm"><Clock className="w-5 h-5 text-primary/80" /> ~{app.estimatedTime} test</div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="p-2 bg-gradient-to-b from-primary/0 to-primary/60 rounded-b-2xl relative">
                    <div className="w-full p-4 rounded-xl text-center">
                        <p className="text-lg font-semibold text-primary text-start">REWARD</p>
                        <div className="text-3xl font-bold text-foreground flex items-center gap-2 justify-start mt-1">
                            {app.points} Points
                            <Star className="w-7 h-7 text-primary/0 fill-primary/20 scale-[4] sm:scale-[6] absolute bottom-8 right-2 sm:right-6 rotate-90" />
                        </div>
                    </div>
                </CardFooter>
            </Card>

            <Card className="border-0 rounded-2xl shadow-xl shadow-gray-100 dark:shadow-gray-900">
                <CardHeader>
                    <CardTitle className="text-base">Developer</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop" data-ai-hint="man developer" />
                            <AvatarFallback>DV</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-sm">AppDev Co.</p>
                            <p className="text-xs text-muted-foreground">Member since 2023</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}