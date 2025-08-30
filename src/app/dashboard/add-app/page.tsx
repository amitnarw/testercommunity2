

'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Expand, X, PlayCircle, ChevronDown, Clipboard, Check, Video, Upload, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { IconRain } from '@/components/icon-rain';
import { useDropzone } from 'react-dropzone';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { BackButton } from '@/components/back-button';

const Highlight = ({ children }: { children: React.ReactNode }) => (
    <span className="bg-primary/20 text-primary font-semibold px-1.5 py-0.5 rounded-md">{children}</span>
);

const CopyBlock = ({ textToCopy }: { textToCopy: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    };

    return (
        <div className="bg-secondary/50 p-4 py-2 rounded-lg flex items-center justify-between my-4">
            <code className="text-sm text-muted-foreground">{textToCopy}</code>
            <Button variant="ghost" size="icon" onClick={handleCopy}>
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Clipboard className="w-4 h-4" />}
            </Button>
        </div>
    );
};

const processSteps = [
    {
        title: "Grant Our Testers Access",
        imageUrl: "/add-app-1.webp",
        dataAiHint: "team collaboration"
    },
    {
        title: "Enable Global Reach",
        imageUrl: "/add-app-2.webp",
        dataAiHint: "world map data"
    },
    {
        title: "Submit for Google's Review",
        imageUrl: "/add-app-3.webp",
        dataAiHint: "checklist document"
    },
    {
        title: "Activate Your Test Cycle",
        imageUrl: "/add-app-4.webp",
        dataAiHint: "scientist laboratory"
    },
];


export default function AddAppPage() {
    const [step, setStep] = useState<'guide' | 'form'>('guide');
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
    const [isVideoExpanded, setIsVideoExpanded] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [iconPreview, setIconPreview] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setIconPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            toast({
                title: "Invalid File",
                description: "Please upload a valid image file.",
                variant: "destructive",
            })
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        const text = event.clipboardData.getData('text');
        // Simple regex to check for image extensions
        if (/\.(jpeg|jpg|gif|png)$/.test(text)) {
            setIconPreview(text);
        } else {
            // A more complex check could be added here for URLs without extensions
            toast({
                title: "Invalid Link",
                description: "Please paste a direct link to an image.",
                variant: "destructive",
            })
        }
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleGetStarted = () => {
        setStep('form');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 md:px-6 py-12">
                    <header className="mb-8 max-w-4xl mx-auto">
                        <BackButton href="/dashboard" className="mb-4" />
                        <h1 className="text-4xl font-bold">Submit a New App</h1>
                        <p className="text-muted-foreground mt-2">
                            {step === 'guide'
                                ? "Follow this simple guide to prepare your app. One package will be used upon submission."
                                : "Fill in your app's details. You can edit this information later."
                            }
                        </p>
                    </header>

                    <main className="max-w-4xl mx-auto">
                        {step === 'guide' ? (
                            <div className="space-y-8">
                                <div className="rounded-xl overflow-hidden shadow-lg border relative bg-secondary/30">
                                    {isClient && <IconRain />}
                                    {isVideoExpanded ? (
                                        <div className="relative aspect-video">
                                            <iframe
                                                className="absolute top-0 left-0 w-full h-full"
                                                src="https://www.youtube.com/embed/9M1Cv8V_I3U?autoplay=1"
                                                title="YouTube video player"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    ) : (
                                        <div
                                            className="p-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer relative z-10"
                                            onClick={() => setIsVideoExpanded(true)}
                                        >
                                            <div>
                                                <h3 className="font-bold text-xl mb-1 flex flex-col sm:flex-row items-center sm:gap-3">Quick Walkthrough <span className="text-sm font-medium text-primary">(2-min watch)</span></h3>
                                                <p className="text-muted-foreground text-sm">Watch a short video on how to submit your app.</p>
                                            </div>
                                            <Button size="lg" variant="outline">
                                                <PlayCircle className="mr-2 h-5 w-5" />
                                                Watch Guide
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <p className="text-center text-muted-foreground text-sm">
                                    You can either watch the video above or follow the step-by-step guide below. Both cover the same process.
                                </p>

                                <Accordion type="single" collapsible className="w-full space-y-4">
                                    <AccordionItem value="item-1" className="bg-secondary/30 rounded-xl border overflow-hidden">
                                        <AccordionTrigger className="p-6 text-left hover:no-underline flex flex-row items-center justify-between w-full relative">
                                            <div className="flex items-start flex-1">
                                                <span className="text-7xl md:text-5xl font-black bg-gradient-to-br from-primary/20 to-primary/0 bg-clip-text text-transparent md:w-20 absolute -top-3 -left-3 md:relative md:top-auto md:left-auto">01</span>
                                                <div>
                                                    <h3 className="font-bold text-xl mb-1">Grant Our Testers Access</h3>
                                                    <p className="text-muted-foreground text-sm text-left">Add our official tester group to your app's internal test track.</p>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-6 pb-6">
                                            <div className="flex flex-col gap-6 items-start">
                                                <div className="flex-1 space-y-4 text-muted-foreground">
                                                    <p>First, head to the Google Play Console and select your app.</p>
                                                    <ol className="list-decimal list-inside space-y-3 pl-2">
                                                        <li>Navigate to the <Highlight>Internal Testing</Highlight> page from the side menu.</li>
                                                        <li>Go to the <Highlight>Testers</Highlight> tab.</li>
                                                        <li>Find the "Tester lists" section and click "Create email list" if you don't have one, or select an existing one.</li>
                                                        <li>In the "Add email addresses" field, paste the following Google Group address. This is our secure, private group of vetted testers.</li>
                                                    </ol>
                                                    <CopyBlock textToCopy="testers-community@googlegroups.com" />
                                                    <p className="text-xs italic"><strong>Why?</strong> This allows our testers to securely download your app from the Play Store for the 14-day test cycle. Your app remains invisible to the public.</p>
                                                </div>
                                                <div className="w-full flex-shrink-0">
                                                    <div
                                                        className="relative w-full rounded-lg overflow-hidden group cursor-pointer bg-black/10"
                                                        onClick={() => setFullscreenImage(processSteps[0].imageUrl)}
                                                    >
                                                        <Image src={processSteps[0].imageUrl} data-ai-hint={processSteps[0].dataAiHint} alt={processSteps[0].title} layout="responsive" width={1200} height={750} className="transition-transform duration-300 group-hover:scale-105" />
                                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Expand className="w-8 h-8 text-white" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-2" className="bg-secondary/30 rounded-xl border overflow-hidden">
                                        <AccordionTrigger className="p-6 text-left hover:no-underline flex flex-row items-center justify-between w-full relative">
                                            <div className="flex items-start flex-1">
                                                <span className="text-7xl md:text-5xl font-black bg-gradient-to-br from-primary/20 to-primary/0 bg-clip-text text-transparent md:w-20 absolute -top-3 -left-3 md:relative md:top-auto md:left-auto">02</span>
                                                <div>
                                                    <h3 className="font-bold text-xl mb-1">Enable Global Reach</h3>
                                                    <p className="text-muted-foreground text-sm text-left">Make your app available in all countries for maximum test coverage.</p>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-6 pb-6">
                                            <div className="flex flex-col gap-6 items-start">
                                                <div className="flex-1 space-y-4 text-muted-foreground">
                                                    <p>To ensure our diverse, international team can test your app, you must enable worldwide distribution.</p>
                                                    <ol className="list-decimal list-inside space-y-3 pl-2">
                                                        <li>While still on the internal testing track, click the <Highlight>Countries / regions</Highlight> tab.</li>
                                                        <li>Click <Highlight>Add countries / regions</Highlight>.</li>
                                                        <li>For the best results and maximum coverage, we highly recommend selecting the first checkbox to include <Highlight>All</Highlight> countries and regions.</li>
                                                    </ol>
                                                    <p className="text-xs italic"><strong>Benefit:</strong> This simple step allows testers from different regions with varied network conditions and device models to test your app, uncovering bugs you might otherwise miss.</p>
                                                </div>
                                                <div className="w-full flex-shrink-0">
                                                    <div
                                                        className="relative w-full rounded-lg overflow-hidden group cursor-pointer bg-black/10"
                                                        onClick={() => setFullscreenImage(processSteps[1].imageUrl)}
                                                    >
                                                        <Image src={processSteps[1].imageUrl} data-ai-hint={processSteps[1].dataAiHint} alt={processSteps[1].title} layout="responsive" width={1200} height={750} className="transition-transform duration-300 group-hover:scale-105" />
                                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Expand className="w-8 h-8 text-white" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-3" className="bg-secondary/30 rounded-xl border overflow-hidden">
                                        <AccordionTrigger className="p-6 text-left hover:no-underline flex flex-row items-center justify-between w-full relative">
                                            <div className="flex items-start flex-1">
                                                <span className="text-7xl md:text-5xl font-black bg-gradient-to-br from-primary/20 to-primary/0 bg-clip-text text-transparent md:w-20 absolute -top-3 -left-3 md:relative md:top-auto md:left-auto">03</span>
                                                <div>
                                                    <h3 className="font-bold text-xl mb-1">Submit for Google's Review</h3>
                                                    <p className="text-muted-foreground text-sm text-left">Save your changes and submit them to Google for a quick review.</p>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-6 pb-6">
                                            <div className="flex flex-col gap-6 items-start">
                                                <div className="flex-1 space-y-4 text-muted-foreground">
                                                    <p>After configuring the tester list and countries, you just need to save the changes.</p>
                                                    <ol className="list-decimal list-inside space-y-3 pl-2">
                                                        <li>Click the <Highlight>Save</Highlight> button at the bottom right of the page.</li>
                                                        <li>This will submit your changes to Google for a standard, automated process to ensure the track is set up correctly.</li>
                                                    </ol>
                                                    <p className="text-xs italic"><strong>What to expect:</strong> This is not a full app review. It is a quick check of your testing configuration. Approval is typically very fast, often taking anywhere from a few minutes to a couple of hours.</p>
                                                </div>
                                                <div className="w-full flex-shrink-0">
                                                    <div
                                                        className="relative w-full rounded-lg overflow-hidden group cursor-pointer bg-black/10"
                                                        onClick={() => setFullscreenImage(processSteps[2].imageUrl)}
                                                    >
                                                        <Image src={processSteps[2].imageUrl} data-ai-hint={processSteps[2].dataAiHint} alt={processSteps[2].title} layout="responsive" width={1200} height={750} className="transition-transform duration-300 group-hover:scale-105" />
                                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Expand className="w-8 h-8 text-white" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-4" className="bg-secondary/30 rounded-xl border overflow-hidden">
                                        <AccordionTrigger className="p-6 text-left hover:no-underline flex flex-row items-center justify-between w-full relative">
                                            <div className="flex items-start flex-1">
                                                <span className="text-7xl md:text-5xl font-black bg-gradient-to-br from-primary/20 to-primary/0 bg-clip-text text-transparent md:w-20 absolute -top-3 -left-3 md:relative md:top-auto md:left-auto">04</span>
                                                <div>
                                                    <h3 className="font-bold text-xl mb-1">Activate Your Test Cycle</h3>
                                                    <p className="text-muted-foreground text-sm text-left">Come back to inTesters with your test URL to begin.</p>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-6 pb-6">
                                            <div className="flex flex-col gap-6 items-start">
                                                <div className="flex-1 space-y-4 text-muted-foreground">
                                                    <p>Once Google approves your changes, you're ready to activate the test cycle!</p>
                                                    <ol className="list-decimal list-inside space-y-3 pl-2">
                                                        <li>On your internal testing page, look for the <Highlight>Join on the web</Highlight> link.</li>
                                                        <li>Click the copy icon next to it to copy the URL.</li>
                                                        <li>Come back to this page, click "Get Started" below, and paste this URL into the <Highlight>Testing URL</Highlight> field in the form.</li>
                                                    </ol>
                                                    <p className="text-xs italic"><strong>Final Step:</strong> After you fill out the form and submit, our testers will be notified automatically, and your 14-day testing cycle will officially begin!</p>
                                                </div>
                                                <div className="w-full flex-shrink-0">
                                                    <div
                                                        className="relative w-full rounded-lg overflow-hidden group cursor-pointer bg-black/10"
                                                        onClick={() => setFullscreenImage(processSteps[3].imageUrl)}
                                                    >
                                                        <Image src={processSteps[3].imageUrl} data-ai-hint={processSteps[3].dataAiHint} alt={processSteps[3].title} layout="responsive" width={1200} height={750} className="transition-transform duration-300 group-hover:scale-105" />
                                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Expand className="w-8 h-8 text-white" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>

                                <div className="pt-6 flex justify-end">
                                    <Button onClick={handleGetStarted} size="lg">
                                        Get Started <ArrowRight className="ml-2" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <Card className="rounded-xl">
                                <CardContent className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">App Name</Label>
                                            <Input id="name" placeholder="E.g., Project Phoenix" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="url">Testing URL</Label>
                                            <Input id="url" placeholder="https://play.google.com/store/apps/details?id=com.example.app" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="icon">App Icon</Label>
                                        {iconPreview ? (
                                            <div className="relative w-full h-48">
                                                <Image src={iconPreview} alt="App icon preview" layout="fill" objectFit="contain" className="rounded-lg p-2 border" />
                                                <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={(e) => { e.stopPropagation(); setIconPreview(null); }}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="relative border border-dashed rounded-lg p-0 grid grid-cols-1 md:grid-cols-2">
                                                <div {...getRootProps()} className={`flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-secondary/50 rounded-l-md transition-colors ${isDragActive ? 'bg-secondary' : ''}`}>
                                                    <input {...getInputProps()} />
                                                    <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                                                    <p className="font-semibold text-center">Select Image to Upload</p>
                                                    <p className="text-xs text-muted-foreground text-center">or drag and drop</p>
                                                </div>
                                                <div className="p-8 flex flex-col items-center justify-center border-t border-dashed md:border-t-0 md:border-l">
                                                    <LinkIcon className="w-10 h-10 text-muted-foreground mb-2" />
                                                    <p className="font-semibold text-center mb-2">Paste image URL</p>
                                                    <Input type="text" placeholder="https://..." onPaste={handlePaste} className="text-center" />
                                                </div>
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center">
                                                    <Separator orientation="vertical" className="h-16" />
                                                    <div className="mx-2 bg-background px-1 text-xs text-muted-foreground font-bold rounded-full border">OR</div>
                                                    <Separator orientation="vertical" className="h-16" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="instructions">Test Credentials & Instructions</Label>
                                        <Textarea id="instructions" placeholder="e.g., Use user: demo@test.com, pass: 1234. Focus on the new checkout flow." className="min-h-[120px]" />
                                    </div>
                                </CardContent>
                                <CardHeader className="p-6 pt-0 flex flex-row justify-between items-center">
                                    <Button variant="ghost" onClick={() => setStep('guide')}> Back to Guide</Button>
                                    <Button type="submit" size="lg">Submit App (1 Package)</Button>
                                </CardHeader>
                            </Card>
                        )}
                    </main>
                </div>
            </div>
            {fullscreenImage && (
                <div
                    className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 animate-in fade-in-0"
                    onClick={() => setFullscreenImage(null)}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 text-white hover:text-white hover:bg-white/20 h-12 w-12 rounded-full"
                        onClick={() => setFullscreenImage(null)}
                    >
                        <X className="w-8 h-8" />
                        <span className="sr-only">Close</span>
                    </Button>
                    <div className="relative w-full h-full max-w-5xl max-h-[85vh]">
                        <Image
                            src={fullscreenImage}
                            alt="Fullscreen view"
                            layout="fill"
                            objectFit="contain"
                            className="animate-in zoom-in-95"
                        />
                    </div>
                </div>
            )}
        </>
    );
}
