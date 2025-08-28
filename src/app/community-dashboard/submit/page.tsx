
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, useInView } from 'framer-motion';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Rocket, FileText, Settings, Link as LinkIcon, PartyPopper, ArrowRight } from 'lucide-react';
import { FormField, FormControl, FormItem, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import AnimatedRoundedButton from '@/components/ui/animated-rounded-button';


const submissionSchema = z.object({
    appLink: z.string().url("Please enter a valid Google Play testing URL."),
    appName: z.string().min(3, "App name must be at least 3 characters."),
    category: z.string({ required_error: "Please select a category."}),
    appDesc: z.string().min(50, "Please provide a detailed description of at least 50 characters."),
    androidVersion: z.string().min(1, "Please specify the minimum Android version."),
    testers: z.string().min(1, "Please specify the number of testers."),
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
        fields: ['category', 'appDesc'],
        description: 'Tell us about your app and what you want testers to focus on. The more detail, the better the feedback.'
    },
    { 
        id: 'configure',
        title: 'Configure',
        icon: <Settings className="w-5 h-5" />,
        fields: ['androidVersion', 'testers'],
        description: 'Finally, set the technical parameters for your test run to ensure we target the right devices.'
    },
];

const Section = ({ id, title, description, children }: { id: string, title: string, description: string, children: React.ReactNode }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-40% 0px -60% 0px" });

    useEffect(() => {
        if (isInView) {
            window.history.replaceState(null, '', `#${id}`);
        }
    }, [isInView, id]);
    
    return (
        <section ref={ref} id={id} className="min-h-[85vh] flex flex-col justify-center scroll-mt-[80px]">
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
    
    const form = useForm<SubmissionFormData>({
        resolver: zodResolver(submissionSchema),
        mode: 'onBlur',
    });

    const onSubmit = (data: SubmissionFormData) => {
        console.log("Form submitted:", data);
        alert("App submitted successfully! (Check console for data)");
    }

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            if(formSteps.some(step => step.id === hash)) {
                setActiveStep(hash);
            }
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                   setActiveStep(entry.target.id);
                }
            });
        }, { rootMargin: "-40% 0px -60% 0px" });

        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => observer.observe(section));

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Initial check

        return () => {
            sections.forEach(section => observer.unobserve(section));
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    return (
        <div className="bg-[#f8fafc] dark:bg-[#0f151e] min-h-screen">
            <div className="sticky top-0 z-40 backdrop-blur-lg">
                <header className="container mx-auto px-4 md:px-6">
                     <div className="flex items-center justify-between h-20">
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/community-dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Hub</Link>
                            </Button>
                            <div className='hidden sm:block'>
                                <h1 className="text-xl font-bold">Submit Your App</h1>
                                <p className="text-sm text-muted-foreground hidden sm:block">Follow the launch sequence to get your app tested.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-3">
                             <div onClick={form.handleSubmit(onSubmit)} className="cursor-pointer">
                                <AnimatedRoundedButton 
                                    className='px-6 py-3 bg-primary text-primary-foreground hover:bg-background dark:hover:bg-foreground hover:text-foreground dark:hover:text-background'
                                >
                                    <div className="flex items-center gap-2">
                                        <span className='hidden sm:inline'>Submit for Review</span>
                                        <span className='sm:hidden'>Submit</span>
                                        <Rocket />
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
                <div className="lg:grid lg:grid-cols-12 lg:gap-16 bg-background rounded-lg shadow-xl px-5">
                    <aside className="hidden lg:block lg:col-span-3 py-16">
                        <div className="sticky top-36">
                             <nav>
                                <ul className="space-y-2">
                                    {formSteps.map((step, index) => (
                                        <li key={step.id}>
                                            <a href={`#${step.id}`} className={cn(
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
                                <Section id="connect" title="1. Connect Your App" description="Provide the essential links and name for your project.">
                                     <Card className="bg-secondary/30 border-dashed">
                                        <CardContent className="p-6 grid md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="appLink"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Label htmlFor="appLink">Google Play Testing Link</Label>
                                                        <FormControl>
                                                            <Input id="appLink" placeholder="https://play.google.com/apps/testing/..." {...field} className="h-12"/>
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

                                <Section id="describe" title="2. Describe Your Project" description="Give testers the context they need for quality feedback.">
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
                                                        <Label htmlFor="appDesc">Description & Instructions for Testers</Label>
                                                        <FormControl>
                                                            <Textarea id="appDesc" placeholder="Describe your app and any specific areas or features you want testers to focus on." className="min-h-[150px]" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </CardContent>
                                    </Card>
                                </Section>

                                <Section id="configure" title="3. Configure Your Test" description="Set the final parameters for your testing cycle.">
                                     <Card className="bg-secondary/30 border-dashed">
                                        <CardContent className="p-6 grid md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="androidVersion"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Label htmlFor="androidVersion">Min. Android Version</Label>
                                                        <FormControl>
                                                            <Input id="androidVersion" placeholder="e.g., 10+" {...field} className="h-12"/>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="testers"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Label>Number of Testers</Label>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-12">
                                                                    <SelectValue placeholder="Select number of testers" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="12">12 (Meets Google Requirement)</SelectItem>
                                                                <SelectItem value="25">25 Testers</SelectItem>
                                                                <SelectItem value="50">50 Testers</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </CardContent>
                                    </Card>
                                </Section>

                            </form>
                        </FormProvider>
                    </main>
                </div>
            </div>
        </div>
    );
}
