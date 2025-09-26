
'use client';

import { useState } from 'react';
import { useForm, FormProvider, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormControl, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, UserPlus, CheckCircle } from 'lucide-react';
import { SiteLogo } from '@/components/icons';
import { BackgroundBeams } from '@/components/background-beams';
import Link from 'next/link';

const step1Schema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const step2Schema = z.object({
  experience: z.string().min(1, "Please select your years of experience."),
  testingTypes: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one testing type.",
  }),
  bio: z.string().min(50, "Please provide a brief bio of at least 50 characters."),
});

const step3Schema = z.object({
  devices: z.string().min(10, "Please list the devices you own for testing."),
  os: z.string().min(1, "Please list the OS versions you can test on."),
  languages: z.string().optional(),
});

const formSchemas = [step1Schema, step2Schema, step3Schema];

const formSteps = [
    { id: 'account', title: 'Account Information' },
    { id: 'experience', title: 'Professional Background' },
    { id: 'skills', title: 'Technical Skills & Devices' },
];

const testingTypeOptions = [
    { id: "manual", label: "Manual Testing" },
    { id: "automation", label: "Automation Testing" },
    { id: "performance", label: "Performance Testing" },
    { id: "security", label: "Security Testing" },
    { id: "usability", label: "Usability Testing" },
    { id: "api", label: "API Testing" },
] as const;

const RegistrationSuccess = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
    >
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold">Application Submitted!</h2>
        <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
            Thank you for your interest in becoming a professional tester. Our team will review your application and get back to you via email within 3-5 business days.
        </p>
        <Button asChild className="mt-8">
            <Link href="/">Return to Homepage</Link>
        </Button>
    </motion.div>
);

export default function ProfessionalRegisterPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [previousStep, setPreviousStep] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchemas[currentStep]),
        mode: 'onChange',
    });

    const { trigger, handleSubmit } = form;

    const next = async () => {
        const output = await trigger();
        if (!output) return;

        if (currentStep < formSteps.length - 1) {
            setPreviousStep(currentStep)
            setCurrentStep(step => step + 1);
        }
    };

    const prev = () => {
        if (currentStep > 0) {
            setPreviousStep(currentStep)
            setCurrentStep(step => step - 1);
        }
    };
    
    const processForm: SubmitHandler<any> = (data) => {
        console.log("Final application data:", data);
        // Here you would typically send the data to your backend
        setIsSubmitted(true);
    };
    
    const delta = currentStep - previousStep;

    return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
        <div className="relative w-full h-screen flex flex-col items-center justify-center p-6 bg-background">
            <div className="max-w-md w-full">
                {isSubmitted ? (
                    <RegistrationSuccess />
                ) : (
                    <>
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            Become a Professional Tester
                        </h2>
                        <p className="text-muted-foreground mt-2">
                            Already have an account? <Link href="/professional/login" className="text-primary hover:underline">Log in</Link>.
                        </p>
                    </div>
                    <FormProvider {...form}>
                        <form onSubmit={handleSubmit(processForm)} className="space-y-6 overflow-hidden relative">
                            <div className="flex justify-center items-center gap-2 mb-8">
                                {formSteps.map((step, index) => (
                                    <div key={step.id} className={cn("h-2 rounded-full transition-all", currentStep >= index ? "bg-primary w-12" : "bg-muted w-4")}></div>
                                ))}
                            </div>
                            <AnimatePresence initial={false} custom={delta}>
                                <motion.div
                                    key={currentStep}
                                    custom={delta}
                                    initial={{ opacity: 0, x: delta > 0 ? 100 : -100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: delta > 0 ? -100 : 100 }}
                                    transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
                                    className="min-h-[300px]"
                                >
                                    <h3 className="font-semibold text-lg mb-4">{formSteps[currentStep].title}</h3>

                                    {currentStep === 0 && (
                                        <div className="space-y-4">
                                            <FormField name="fullName" render={({ field }) => (
                                                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField name="email" render={({ field }) => (
                                                <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField name="password" render={({ field }) => (
                                                <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                        </div>
                                    )}
                                    {currentStep === 1 && (
                                        <div className="space-y-4">
                                            <FormField name="experience" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Years of QA Experience</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl><SelectTrigger><SelectValue placeholder="Select your experience level" /></SelectTrigger></FormControl>
                                                        <SelectContent><SelectItem value="0-1">0-1 years</SelectItem><SelectItem value="1-3">1-3 years</SelectItem><SelectItem value="3-5">3-5 years</SelectItem><SelectItem value="5+">5+ years</SelectItem></SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <FormField name="testingTypes" render={() => (
                                                <FormItem>
                                                    <FormLabel>Areas of Expertise</FormLabel>
                                                    <div className="grid grid-cols-2 gap-2">
                                                    {testingTypeOptions.map((item) => (
                                                        <FormField key={item.id} control={form.control} name="testingTypes" render={({ field }) => (
                                                            <FormItem key={item.id} className="flex flex-row items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {
                                                                        return checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((value) => value !== item.id))
                                                                    }} />
                                                                </FormControl>
                                                                <FormLabel className="text-sm font-normal">{item.label}</FormLabel>
                                                            </FormItem>
                                                        )} />
                                                    ))}
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <FormField name="bio" render={({ field }) => (
                                                <FormItem><FormLabel>Professional Bio</FormLabel><FormControl><Textarea placeholder="Tell us about your experience..." {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                        </div>
                                    )}
                                    {currentStep === 2 && (
                                        <div className="space-y-4">
                                            <FormField name="devices" render={({ field }) => (
                                                <FormItem><FormLabel>Device Inventory</FormLabel><FormControl><Textarea placeholder="e.g., Google Pixel 8 Pro (Android 14), Samsung Galaxy Tab S9 (Android 13)..." {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField name="os" render={({ field }) => (
                                                <FormItem><FormLabel>Operating Systems</FormLabel><FormControl><Input placeholder="e.g., Android 12, 13, 14" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField name="languages" render={({ field }) => (
                                                <FormItem><FormLabel>Programming/Scripting Languages (Optional)</FormLabel><FormControl><Input placeholder="e.g., Python, JavaScript, Java" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                            <div className="mt-8 pt-5 border-t">
                                <div className="flex justify-between">
                                    <Button type="button" onClick={prev} disabled={currentStep === 0} variant="ghost" className={cn(currentStep === 0 && "invisible")}>
                                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                    </Button>
                                    {currentStep < formSteps.length - 1 && (
                                        <Button type="button" onClick={next}>Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
                                    )}
                                    {currentStep === formSteps.length - 1 && (
                                        <Button type="submit"><UserPlus className="mr-2 h-4 w-4"/> Submit Application</Button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </FormProvider>
                    </>
                )}
            </div>
        </div>
        <div className="hidden lg:flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-background">
            <BackgroundBeams />
            <div className="relative z-10 flex flex-col items-center">
                <SiteLogo className="h-20 w-auto mb-4" />
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Join the Elite</h1>
                <p className="mt-2 max-w-md mx-auto text-muted-foreground">
                    Become a part of our professional testing team and help shape the future of top-tier applications.
                </p>
            </div>
        </div>
    </div>
    );
}
