

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from 'next-themes';
import AnimatedRoundedButton from '@/components/ui/animated-rounded-button';
import { BackButton } from '@/components/back-button';
import { FileText, Link as LinkIcon, Info } from 'lucide-react';
import Link from 'next/link';

export default function AddAppFormPage() {
    const { theme } = useTheme();
    const hoverTextColor = theme === 'dark' ? 'black' : 'white';
    const hoverBgColor = theme === 'dark' ? 'white' : 'black';

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f151e]">
            <div className="container mx-auto px-4 md:px-6">
                <div className="sticky top-0 z-[50] pt-2 sm:pt-3 pb-10 max-w-[50%] sm:max-w-4xl mx-0 sm:mx-auto">
                    <BackButton href="/dashboard" />
                </div>
                <header className="mb-8 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div className='flex flex-col items-start justify-center'>
                        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">Submit a New App</h1>
                        <p className="text-muted-foreground mt-2">
                            Fill in your app's details. You can save as a draft and edit this information later.
                        </p>
                    </div>
                    <Button>Save as Draft</Button>
                </header>

                <main className="max-w-4xl mx-auto">
                    <Card className="rounded-xl bg-card border-border/50 shadow-lg bg-gradient-to-br from-card to-secondary/20">
                        <CardContent className="p-4 sm:p-8 space-y-8">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm sm:text-base font-semibold text-muted-foreground">App Name</Label>
                                <div className="relative flex items-center">
                                    <FileText className="absolute left-2 w-4 h-4 sm:left-4 sm:w-5 sm:h-5 text-muted-foreground" />
                                    <Input id="name" placeholder="E.g., Project Phoenix" className="pl-8 sm:pl-12 py-3 h-auto text-sm sm:text-base rounded-lg bg-secondary/40 border-border/50 focus-visible:ring-primary/50" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="url" className="text-sm sm:text-base font-semibold text-muted-foreground">Testing URL</Label>
                                <div className="relative flex items-center">
                                    <LinkIcon className="absolute left-2 w-4 h-4 sm:left-4 sm:w-5 sm:h-5 text-muted-foreground" />
                                    <Input id="url" placeholder="https://play.google.com/store/apps/details?id=com.example.app" className="pl-8 sm:pl-12 py-3 h-auto text-sm sm:text-base rounded-lg bg-secondary/40 border-border/50 focus-visible:ring-primary/50" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="instructions" className="text-sm sm:text-base font-semibold text-muted-foreground">Test Credentials & Instructions <span className="text-xs">(Optional)</span>
                                </Label>
                                <div className="relative">
                                    <Info className="absolute left-2 w-4 h-4 sm:left-4 sm:w-5 sm:h-5 top-4 text-muted-foreground" />
                                    <Textarea id="instructions" placeholder="e.g., User: demo@test.com, pass: 1234" className="pl-8 sm:pl-12 py-3 h-auto text-sm sm:text-base rounded-lg bg-secondary/40 border-border/50 focus-visible:ring-primary/50" />
                                </div>
                            </div>
                        </CardContent>
                        <CardHeader className="p-6 pt-0 flex flex-col sm:flex-row gap-2 justify-between items-center">
                            <Button variant="ghost" asChild>
                                <Link href="/dashboard/add-app">Back to Guide</Link>
                            </Button>
                            <AnimatedRoundedButton
                                backgroundColor="hsl(var(--primary))"
                                animatedBackgroundColor={hoverBgColor}
                                hoverTextColor={hoverTextColor}
                                borderRadius='12px'
                                className='py-3 px-8 w-full sm:w-auto'
                            >
                                <div className="flex flex-col gap-0 sm:flex-row sm:gap-2 items-center text-center">
                                    <span>Submit App</span>
                                    <span className="text-xs">(1 Package)</span>
                                </div>
                            </AnimatedRoundedButton>
                        </CardHeader>
                    </Card>
                </main>
            </div>
        </div>
    );
}
