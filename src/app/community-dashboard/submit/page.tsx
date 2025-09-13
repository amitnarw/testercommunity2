'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { FileText, Link as LinkIcon, Users, AlertCircle, Wallet } from 'lucide-react';
import { FormField, FormControl, FormItem, FormMessage, FormLabel, FormDescription } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import AnimatedRoundedButton from '@/components/ui/animated-rounded-button';
import { BackButton } from '@/components/back-button';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

const submissionSchema = z.object({
    appLink: z.string().url("Please enter a valid Google Play testing URL."),
    appName: z.string().min(3, "App name must be at least 3 characters."),
    category: z.string({ required_error: "Please select a category." }),
    appDesc: z.string().min(50, "Please provide a detailed description of at least 50 characters."),
    testingInstructions: z.string().min(50, "Please provide instructions of at least 50 characters."),
    androidVersion: z.string().min(1, "Please specify the minimum Android version."),
    numberOfTesters: z.coerce.number().min(5, { message: 'A minimum of 5 testers is required.' }).max(50),
    testDuration: z.coerce.number().min(14, { message: 'A minimum of 14 days is required.' }).max(30),
});

type SubmissionFormData = z.infer<typeof submissionSchema>;

const formSteps = [
    {
        id: 'connect',
        title: 'Connect',
        icon: <LinkIcon className="w-5 h-5" />,
        fields: ['appName', 'appLink'],
        description: 'First, provide a link to your app on the Google Play Console internal testing track. This allows our testers to securely download it.'
    },
    {
        id: 'describe',
        title: 'Describe',
        icon: <FileText className="w-5 h-5" />,
        fields: ['category', 'appDesc', 'testingInstructions'],
        description: 'Tell us about your app and what you want testers to focus on. The more detail, the better the feedback.'
    },
    {
        id: 'configure',
        title: 'Configure',
        icon: <Users className="w-5 h-5" />,
        fields: ['androidVersion', 'numberOfTesters', 'testDuration'],
        description: 'Finally, set the technical parameters and choose how many testers you need. Points will be deducted after admin review.'
    },
];

const Section = ({ id, title, description, children, sectionRef }: { id: string, title: string, description: string, children: React.ReactNode, sectionRef: React.Ref<HTMLDivElement> }) => {
    return (
        <section ref={sectionRef} id={id} className="min-h-[85vh] flex flex-col justify-center scroll-mt-24 pt-16">
            <div className="mb-8">
                <h2 className="text-3xl font-bold">{title}</h2>
                <p className="text-muted-foreground mt-2">{description}</p>
            </div>
            {children}
        </section>
    );
};


export default function SubmitAppPage() {
    const [activeStep, setActiveStep] = useState(formSteps[0].id);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const { theme } = useTheme();
    const [cost, setCost] = useState(0);

    const form = useForm<SubmissionFormData>({
        resolver: zodResolver(submissionSchema),
        mode: 'onBlur',
        defaultValues: {
            numberOfTesters: 10,
            testDuration: 14,
        }
    });

    const userBalance = 1250;
    const testers = form.watch('numberOfTesters');
    const isBalanceInsufficient = cost > userBalance;

    useEffect(() => {
        const calculatedCost = testers * 100;
        setCost(calculatedCost);
    }, [testers]);


    const onSubmit = (data: SubmissionFormData) => {
        if (isBalanceInsufficient) {
            setIsErrorModalOpen(true);
            return;
        }
        console.log("Form submitted:", data);
        alert("App submitted successfully! (Check console for data)");
    }

    const { ref: connectRef, inView: connectInView } = useInView({ threshold: 0.5 });
    const { ref: describeRef, inView: describeInView } = useInView({ threshold: 0.5 });
    const { ref: configureRef, inView: configureInView } = useInView({ threshold: 0.5 });

    useEffect(() => {
        if (connectInView) setActiveStep('connect');
        else if (describeInView) setActiveStep('describe');
        else if (configureInView) setActiveStep('configure');
    }, [connectInView, describeInView, configureInView]);


    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    const hoverTextColor = theme === 'dark' ? 'black' : 'white';
    const hoverBgColor = theme === 'dark' ? 'white' : 'black';


    return (
        <>
            <div className="bg-[#f8fafc] dark:bg-[#0f151e] min-h-screen">
                <div className="sticky top-0 z-40 backdrop-blur-lg">
                    <header className="container mx-auto px-4 md:px-6">
                        <div className="flex items-center justify-between h-20">
                            <div className="flex items-center gap-4">
                                <BackButton href="/community-dashboard" />
                                <div className='hidden sm:block'>
                                    <h1 className="text-xl font-bold">Submit Your App</h1>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-3">
                                <div onClick={form.handleSubmit(onSubmit)} className={cn("cursor-pointer", isBalanceInsufficient && "cursor-not-allowed opacity-50")}>
                                    <AnimatedRoundedButton
                                        backgroundColor="hsl(var(--primary))"
                                        animatedBackgroundColor={hoverBgColor}
                                        hoverTextColor={hoverTextColor}
                                        borderRadius='9999px'
                                        className={cn(isBalanceInsufficient && "!bg-destructive")}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className='hidden sm:inline'>Submit for Review</span>
                                            <span className='sm:hidden'>Submit</span>
                                        </div>
                                    </AnimatedRoundedButton>
                                </div>
                            </div>
                        </div>
                    </header>
                    {/* Mobile Step Navigator */}
                    <nav className="lg:hidden sticky top-20 z-30 flex items-center justify-around border-b bg-background/80 backdrop-blur-lg">
                        {formSteps.map((step) => (
                            <a
                                key={`mobile-${step.id}`}
                                href={`#${step.id}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(step.id)?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 text-center p-3 text-sm font-medium transition-all text-muted-foreground relative",
                                    activeStep === step.id && "text-primary"
                                )}
                            >
                                {step.icon}
                                {step.title}
                                {activeStep === step.id && (
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                        layoutId="mobile-active-step-indicator"
                                    />
                                )}
                            </a>
                        ))}
                    </nav>
                </div>

                <div className="container mx-auto px-2 py-5">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-16 bg-background rounded-3xl px-5">
                        <aside className="hidden lg:block lg:col-span-3 py-16">
                            <div className="sticky top-36">
                                <nav>
                                    <ul className="space-y-2">
                                        {formSteps.map((step) => (
                                            <li key={step.id}>
                                                <a
                                                    href={`#${step.id}`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        document.getElementById(step.id)?.scrollIntoView({ behavior: 'smooth' });
                                                    }}
                                                    className={cn(
                                                        "flex items-center gap-3 p-3 rounded-lg transition-all",
                                                        activeStep === step.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary/50"
                                                    )}>
                                                    <div className={cn(
                                                        "p-2 rounded-full flex items-center justify-center border-2 transition-all",
                                                        activeStep === step.id ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border group-hover:border-primary/50"
                                                    )}>
                                                        {step.icon}
                                                    </div>
                                                    <div>
                                                        <p className={cn("font-bold transition-all", activeStep === step.id ? "text-primary" : "text-foreground")}>{step.title}</p>
                                                        <p className="text-xs">{step.description.split('.')[0]}</p>
                                                    </div>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>
                        </aside>
                        <main className="lg:col-span-9">
                            <FormProvider {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <Section sectionRef={connectRef} id="connect" title="1. Connect Your App" description="Provide the essential links and name for your project.">
                                        <Card className="bg-secondary/30 border-dashed">
                                            <CardContent className="p-6 grid md:grid-cols-2 gap-6">
                                                <FormField
                                                    control={form.control}
                                                    name="appLink"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Label htmlFor="appLink">Google Play Testing Link</Label>
                                                            <FormControl>
                                                                <Input id="appLink" placeholder="https://play.google.com/apps/testing/..." {...field} className="h-12" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="appName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Label htmlFor="appName">App Name</Label>
                                                            <FormControl>
                                                                <Input id="appName" placeholder="e.g., PhotoSnap Editor" {...field} className="h-12" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </CardContent>
                                        </Card>
                                    </Section>

                                    <Section sectionRef={describeRef} id="describe" title="2. Describe Your Project" description="Give testers the context they need for quality feedback.">
                                        <Card className="bg-secondary/30 border-dashed">
                                            <CardContent className="p-6 space-y-6">
                                                <FormField
                                                    control={form.control}
                                                    name="category"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Label>Category</Label>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="h-12">
                                                                        <SelectValue placeholder="Select a category" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="Games">Games</SelectItem>
                                                                    <SelectItem value="Productivity">Productivity</SelectItem>
                                                                    <SelectItem value="Social">Social</SelectItem>
                                                                    <SelectItem value="Utilities">Utilities</SelectItem>
                                                                    <SelectItem value="Other">Other</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="appDesc"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Label htmlFor="appDesc">App Description</Label>
                                                            <FormControl>
                                                                <Textarea id="appDesc" placeholder="Briefly describe what your app does." className="min-h-[120px]" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="testingInstructions"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Label htmlFor="testingInstructions">Instructions for Testers</Label>
                                                            <FormControl>
                                                                <Textarea id="testingInstructions" placeholder="Any specific areas or features you want testers to focus on? (e.g., 'Please test the new checkout flow')." className="min-h-[120px]" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </CardContent>
                                        </Card>
                                    </Section>

                                    <Section sectionRef={configureRef} id="configure" title="3. Configure Your Test" description="Set the final parameters for your testing cycle. You must have enough earned points to cover this budget.">
                                        <Card className="bg-secondary/30 border-dashed">
                                            <CardContent className="p-6 grid md:grid-cols-1 gap-8">
                                                <FormField
                                                    control={form.control}
                                                    name="androidVersion"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Label htmlFor="androidVersion">Min. Android Version</Label>
                                                            <FormControl>
                                                                <Input id="androidVersion" placeholder="e.g., 10+" {...field} className="h-12" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="numberOfTesters"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Number of Testers</FormLabel>
                                                            <FormControl>
                                                                <div className="flex items-center gap-4 pt-2">
                                                                    <Slider
                                                                        defaultValue={[field.value]}
                                                                        min={5}
                                                                        max={50}
                                                                        step={5}
                                                                        onValueChange={(value) => field.onChange(value[0])}
                                                                        className={cn("w-[85%]", field.name)}
                                                                    />
                                                                    <div className="font-bold text-lg text-primary w-[15%] text-center">{field.value}</div>
                                                                </div>
                                                            </FormControl>
                                                            <FormDescription className="mt-4 flex items-start gap-2 bg-secondary/80 p-3 rounded-lg border border-border">
                                                                <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                                                <div>
                                                                    <span className='font-semibold text-foreground'>Pro Tip:</span> We recommend selecting at least 15-20 testers. Since community testers can drop out, choosing extra provides a buffer to ensure you meet Google's 14-day/12-tester requirement without delays.
                                                                </div>
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="testDuration"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Test Duration (Days)</FormLabel>
                                                            <FormControl>
                                                                <div className="flex items-center gap-4 pt-2">
                                                                    <Slider
                                                                        defaultValue={[field.value]}
                                                                        min={14}
                                                                        max={30}
                                                                        step={1}
                                                                        onValueChange={(value) => field.onChange(value[0])}
                                                                        className={cn("w-[85%]", field.name)}
                                                                    />
                                                                    <div className="font-bold text-lg text-primary w-[15%] text-center">{field.value}</div>
                                                                </div>
                                                            </FormControl>
                                                            <FormDescription className="mt-4 flex items-start gap-2 bg-secondary/80 p-3 rounded-lg border border-border">
                                                                <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                                                <div>
                                                                    <span className='font-semibold text-foreground'>Pro Tip:</span> While the minimum is 14 days, we suggest 16-20 days. This gives community testers a flexible window to complete the test period without pressure.
                                                                </div>
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <div className={cn("p-4 rounded-lg flex flex-col items-center justify-center transition-colors", isBalanceInsufficient ? "bg-destructive/10 border-destructive" : "bg-primary/10 border-primary/20", "border")}>
                                                    <div className="flex items-center gap-3 text-sm font-semibold mb-1">
                                                        <Wallet className={cn("w-5 h-5", isBalanceInsufficient ? "text-destructive" : "text-primary")} />
                                                        <span>Point Budget</span>
                                                    </div>
                                                    <p className="text-3xl font-bold">{cost.toLocaleString()} <span className="text-lg font-medium text-muted-foreground">Points</span></p>
                                                    <p className={cn("text-xs mt-1", isBalanceInsufficient ? "text-destructive font-semibold" : "text-muted-foreground")}>
                                                        Your balance: {userBalance.toLocaleString()} points.
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Section>

                                </form>
                            </FormProvider>
                        </main>
                    </div>
                </div>
            </div>

            <AlertDialog open={isErrorModalOpen} onOpenChange={setIsErrorModalOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Insufficient Points</AlertDialogTitle>
                        <AlertDialogDescription>
                            You do not have enough points to fund this test configuration. Your current balance is {userBalance.toLocaleString()} points, but you need {cost.toLocaleString()} points.
                            <br /><br />
                            Please either reduce the number of testers or earn more points by testing other apps in the Community Hub.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button onClick={() => setIsErrorModalOpen(false)}>Okay, I'll adjust</Button>
                        <Button variant="outline" asChild>
                            <Link href="/community-dashboard">Go to Community Hub</Link>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );

}
