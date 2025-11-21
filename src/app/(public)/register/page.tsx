
'use client';

import { useState } from 'react';
import { useForm, FormProvider, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField, FormControl, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, UserPlus, CheckCircle, Moon, Sun, Check } from 'lucide-react';
import { SiteLogo } from '@/components/icons';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { BackButton } from '@/components/back-button';
import { Separator } from '@/components/ui/separator';
import { UserProfileForm } from '@/components/user-profile-form';
import Image from 'next/image';


const GoogleIcon = (props: React.HTMLAttributes<HTMLImageElement>) => (
    <Image src="/google.svg" alt="Google" width={24} height={24} {...props} />
);

const step1Schema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters.").optional(),
});

const formSchemas = [step1Schema];

const formSteps = [
    { id: 'account', title: 'Create Account', description: 'Enter your personal details.' },
    { id: 'profile', title: 'Tell us about yourself', description: 'Help us tailor your experience.' },
];

const RegistrationSuccess = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
    >
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold">Account Created!</h2>
        <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
            Welcome to inTesters! We're excited to have you. Let's get your profile set up.
        </p>
        <Button asChild className="mt-8">
            <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
    </motion.div>
);

export default function RegisterPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [previousStep, setPreviousStep] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { setTheme, theme } = useTheme();
    const [isGoogleAuth, setIsGoogleAuth] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchemas[currentStep]),
        mode: 'onChange',
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
        }
    });

    const { trigger, handleSubmit, setValue } = form;

    const next = async () => {
        const fields = formSteps[currentStep].fields;
        const output = await trigger(fields as any, { shouldFocus: true });
    
        if (!output) return;
    
        if (currentStep < formSteps.length - 1) {
            setPreviousStep(currentStep)
            setCurrentStep(step => step + 1);
        } else {
            handleSubmit(processForm)();
        }
    };

    const prev = () => {
        if (currentStep > 0) {
            setPreviousStep(currentStep)
            setCurrentStep(step => step - 1);
        }
    };
    
    const processForm: SubmitHandler<any> = (data) => {
        console.log("Account data:", data);
        setPreviousStep(currentStep);
        setCurrentStep(step => step + 1);
        // After the last step, you might want to show success or redirect
        if (currentStep === formSteps.length - 1) {
            setIsSubmitted(true);
        }
    };

     const handleGoogleRegister = () => {
        setIsGoogleAuth(true);
        setValue('fullName', 'Demo User', { shouldValidate: true });
        setValue('email', 'demo.user@gmail.com', { shouldValidate: true });
        next();
    }
    
    const delta = currentStep - previousStep;

    return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-background">
        <div className="absolute top-4 right-4 flex items-center gap-4">
            <BackButton href="/" />
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
                <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </Button>
        </div>
        
        <div className="w-full max-w-2xl mx-auto">
             <div className="mb-12">
                <nav aria-label="Progress">
                    <ol role="list" className="flex items-center">
                        {formSteps.map((step, stepIdx) => (
                        <li key={step.title} className={cn("relative flex-1", { 'pr-8 sm:pr-20': stepIdx !== formSteps.length - 1 })}>
                            {stepIdx < currentStep ? (
                            <>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="h-0.5 w-full bg-primary" />
                                </div>
                                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                                <Check className="h-5 w-5 text-white" aria-hidden="true" />
                                </div>
                            </>
                            ) : stepIdx === currentStep ? (
                            <>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700" />
                                </div>
                                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background">
                                <span className="h-2.5 w-2.5 rounded-full bg-primary" aria-hidden="true" />
                                </div>
                                <div className="absolute top-10 w-max text-center">
                                    <p className="text-sm font-semibold">{step.title}</p>
                                    <p className="text-xs text-muted-foreground">{step.description}</p>
                                </div>
                            </>
                            ) : (
                            <>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700" />
                                </div>
                                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-background dark:border-gray-600">
                                </div>
                                <div className="absolute top-10 w-max text-center">
                                    <p className="text-sm font-semibold text-muted-foreground">{step.title}</p>
                                    <p className="text-xs text-muted-foreground">{step.description}</p>
                                </div>
                            </>
                            )}
                        </li>
                        ))}
                    </ol>
                </nav>
            </div>
        
            {isSubmitted ? (
                <RegistrationSuccess />
            ) : (
                <div className="w-full max-w-md mx-auto">
                    <FormProvider {...form}>
                        <form onSubmit={handleSubmit(processForm)} className="space-y-6 overflow-hidden relative">
                            <AnimatePresence initial={false} custom={delta}>
                                <motion.div
                                    key={currentStep}
                                    custom={delta}
                                    initial={{ opacity: 0, x: delta > 0 ? 300 : -300 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: delta > 0 ? -300 : 300 }}
                                    transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
                                >
                                    {currentStep === 0 && (
                                        <div className="space-y-4 min-h-[350px]">
                                            <Button variant="outline" className="w-full rounded-xl py-6 text-base" onClick={handleGoogleRegister}>
                                                <GoogleIcon className="mr-3" />
                                                Sign up with Google
                                            </Button>
                                            <div className="flex items-center gap-4">
                                                <Separator className="flex-1 bg-border/50" />
                                                <span className="text-xs text-muted-foreground">OR</span>
                                                <Separator className="flex-1 bg-border/50" />
                                            </div>
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
                                        <UserProfileForm user={{ role: '', companySize: '', primaryGoal: '', monthlyBudget: '' }} />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                            <div className="mt-8 pt-5">
                                <div className="flex justify-between">
                                    <Button type="button" onClick={prev} disabled={currentStep === 0} variant="ghost" className={cn(currentStep === 0 && "invisible")}>
                                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                    </Button>
                                    <Button type="button" onClick={next}>
                                        {currentStep === formSteps.length - 1 ? 'Finish' : 'Next'} 
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            )}
        </div>
    </div>
    );

    