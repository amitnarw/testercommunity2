
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Save, CheckCircle, Moon, Sun, Check } from 'lucide-react';
import { SiteLogo } from '@/components/icons';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { BackButton } from '@/components/back-button';
import Image from 'next/image';
import { BackgroundBeams } from '@/components/background-beams';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { UserProfileType, UserJobRole, UserExperienceLevel, UserCompanySize, UserCompanyPosition, UserTotalPublishedApps, UserDevelopmentPlatform, UserPublishFrequency, UserTestingServiceReason, UserCommunicationMethod, UserNotificationPreference } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';

const GoogleIcon = (props: React.HTMLAttributes<HTMLImageElement>) => (
    <Image src="/google.svg" alt="Google" width={24} height={24} {...props} />
);

const step1Schema = z.object({
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().min(2, "Last name is required."),
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters.").optional(),
});

const step2Schema = z.object({
  country: z.string().optional(),
  phone: z.string().optional(),
  profileType: z.nativeEnum(UserProfileType).optional(),
  jobRole: z.nativeEnum(UserJobRole).optional(),
  experienceLevel: z.nativeEnum(UserExperienceLevel).optional(),
});

const step3Schema = z.object({
    companyName: z.string().optional(),
    companyWebsite: z.string().optional(),
    companySize: z.nativeEnum(UserCompanySize).optional(),
    positionInCompany: z.nativeEnum(UserCompanyPosition).optional(),
});

const step4Schema = z.object({
    totalPublishedApps: z.nativeEnum(UserTotalPublishedApps).optional(),
    platformDevelopment: z.nativeEnum(UserDevelopmentPlatform).optional(),
    publishFrequency: z.nativeEnum(UserPublishFrequency).optional(),
    serviceUsage: z.array(z.nativeEnum(UserTestingServiceReason)).optional(),
    communicationMethods: z.array(z.nativeEnum(UserCommunicationMethod)).optional(),
    notificationPreference: z.array(z.nativeEnum(UserNotificationPreference)).optional(),
});

const formSchemas = [step1Schema, step2Schema, step3Schema, step4Schema];

const formSteps = [
    { id: 'account', title: 'Create Account', description: 'Enter your personal details.', fields: ['firstName', 'lastName', 'email', 'password'] },
    { id: 'role', title: 'Your Role', description: 'Tell us about your professional background.', fields: ['profileType', 'jobRole', 'experienceLevel'] },
    { id: 'company', title: 'Your Company', description: 'Information about your organization.', fields: ['companyName', 'companyWebsite', 'companySize', 'positionInCompany'] },
    { id: 'projects', title: 'Your Projects', description: 'Details about your development work.', fields: ['totalPublishedApps', 'platformDevelopment', 'publishFrequency', 'serviceUsage'] },
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
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            country: undefined,
            phone: undefined,
            profileType: undefined,
            jobRole: undefined,
            experienceLevel: undefined,
            companyName: undefined,
            companyWebsite: undefined,
            companySize: undefined,
            positionInCompany: undefined,
            totalPublishedApps: undefined,
            platformDevelopment: undefined,
            publishFrequency: undefined,
            serviceUsage: [],
            communicationMethods: [],
            notificationPreference: [],
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
        if (currentStep === formSteps.length - 1) {
            setIsSubmitted(true);
        }
    };

     const handleGoogleRegister = () => {
        setIsGoogleAuth(true);
        setValue('firstName', 'Demo', { shouldValidate: true });
        setValue('lastName', 'User', { shouldValidate: true });
        setValue('email', 'demo.user@gmail.com', { shouldValidate: true });
        next();
    }
    
    const delta = currentStep - previousStep;

    return (
    <div className={cn("min-h-screen w-full lg:grid", currentStep > 0 ? "lg:grid-cols-1" : "lg:grid-cols-2")}>
        <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 bg-background">
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
            
            <div className={cn("w-full transition-all duration-300", currentStep > 0 ? "max-w-3xl" : "max-w-md")}>
                <AnimatePresence mode="wait">
                {currentStep > 0 && !isSubmitted && (
                    <motion.div
                        key="stepper"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="mb-16 mt-8"
                    >
                         <div className="flex w-full">
                            {formSteps.map((step, index) => {
                                const isCompleted = currentStep > index;
                                const isCurrent = currentStep === index;
                                return (
                                <div key={step.id} className="flex-1">
                                    <div
                                        className={cn(
                                            "h-12 flex items-center justify-center relative transition-colors duration-300 pl-8",
                                            isCompleted ? "bg-green-500" : isCurrent ? "bg-primary" : "bg-muted",
                                        )}
                                        style={{
                                            clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 50%, calc(100% - 24px) 100%, 0 100%)'
                                        }}
                                    >
                                    <span className={cn(
                                        "font-semibold text-xs sm:text-sm",
                                        isCompleted ? "text-white" : isCurrent ? "text-primary-foreground" : "text-muted-foreground"
                                    )}>
                                        {step.title}
                                    </span>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>
            
                {isSubmitted ? (
                    <RegistrationSuccess />
                ) : (
                    <div className="w-full">
                        <FormProvider {...form}>
                            <form onSubmit={handleSubmit(processForm)} className="overflow-hidden relative">
                                <AnimatePresence initial={false} custom={delta}>
                                    <motion.div
                                        key={currentStep}
                                        custom={delta}
                                        initial={{ opacity: 0, x: delta > 0 ? 300 : -300 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: delta > 0 ? -300 : 300 }}
                                        transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
                                        className={cn("bg-card border rounded-2xl p-6", currentStep > 0 && "shadow-lg")}
                                    >
                                        <div className={cn("mb-8", currentStep === 0 && "text-center")}>
                                            <h2 className={cn("font-bold tracking-tight", currentStep > 0 ? "text-2xl" : "text-3xl")}>{formSteps[currentStep].title}</h2>
                                            <p className="text-muted-foreground mt-2 text-sm">{formSteps[currentStep].description}</p>
                                        </div>

                                        {currentStep === 0 && (
                                            <div className="space-y-4">
                                                <Button variant="outline" className="w-full rounded-xl py-6 text-base" onClick={handleGoogleRegister}>
                                                    <GoogleIcon className="mr-3" />
                                                    Sign up with Google
                                                </Button>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-1 border-t"></div>
                                                    <span className="text-xs text-muted-foreground">OR</span>
                                                    <div className="flex-1 border-t"></div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <FormField name="firstName" render={({ field }) => (
                                                        <FormItem><FormLabel>First Name</FormLabel><FormControl><Input placeholder="John" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField name="lastName" render={({ field }) => (
                                                        <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input placeholder="Doe" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                </div>
                                                <FormField name="email" render={({ field }) => (
                                                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField name="password" render={({ field }) => (
                                                    <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                            </div>
                                        )}
                                        {currentStep === 1 && (
                                             <div className="space-y-6">
                                                <FormField
                                                    control={form.control}
                                                    name="profileType"
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-3">
                                                        <FormLabel>You are a...</FormLabel>
                                                        <FormControl>
                                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                                {Object.values(UserProfileType).map((type) => (
                                                                    <FormItem key={type}>
                                                                        <RadioGroupItem value={type} id={type} className="peer sr-only" />
                                                                        <Label htmlFor={type} className="flex h-full flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">{type.replace('_', ' ')}</Label>
                                                                    </FormItem>
                                                                ))}
                                                            </RadioGroup>
                                                        </FormControl>
                                                        <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                 <FormField name="jobRole" render={({ field }) => (
                                                    <FormItem><FormLabel>Your Job Role</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl><SelectTrigger><SelectValue placeholder="Select your primary role" /></SelectTrigger></FormControl>
                                                        <SelectContent>{Object.values(UserJobRole).map(role => <SelectItem key={role} value={role}>{role.replace('_', ' ')}</SelectItem>)}</SelectContent>
                                                    </Select>
                                                    <FormMessage /></FormItem>
                                                )} />
                                            </div>
                                        )}
                                        {currentStep === 2 && (
                                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                             <FormField name="companyName" render={({ field }) => (
                                                    <FormItem><FormLabel>Company Name</FormLabel><FormControl><Input placeholder="Your Company Inc." {...field} /></FormControl><FormMessage /></FormItem>
                                             )} />
                                             <FormField name="companyWebsite" render={({ field }) => (
                                                    <FormItem><FormLabel>Company Website</FormLabel><FormControl><Input placeholder="https://example.com" {...field} /></FormControl><FormMessage /></FormItem>
                                             )} />
                                             <FormField name="companySize" render={({ field }) => (
                                                    <FormItem><FormLabel>Company Size</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl><SelectTrigger><SelectValue placeholder="Select company size" /></SelectTrigger></FormControl>
                                                        <SelectContent>
                                                            {Object.values(UserCompanySize).map(size => <SelectItem key={size} value={size}>{size.replace('SIZE_', '').replace('_', '-')}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage /></FormItem>
                                             )} />
                                             <FormField name="positionInCompany" render={({ field }) => (
                                                <FormItem><FormLabel>Your Position</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl><SelectTrigger><SelectValue placeholder="Select your position" /></SelectTrigger></FormControl>
                                                        <SelectContent>
                                                            {Object.values(UserCompanyPosition).map(pos => <SelectItem key={pos} value={pos}>{pos.replace('_', ' ')}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                <FormMessage /></FormItem>
                                             )} />
                                           </div>
                                        )}
                                        {currentStep === 3 && (
                                            <div className="space-y-6">
                                                <FormField name="totalPublishedApps" render={({ field }) => (
                                                    <FormItem><FormLabel>Total Published Apps</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue placeholder="Select number of apps" /></SelectTrigger></FormControl>
                                                            <SelectContent>
                                                                {Object.values(UserTotalPublishedApps).map(val => <SelectItem key={val} value={val}>{val.replace('PUB_', '').replace('_', '-')}</SelectItem>)}
                                                            </SelectContent>
                                                        </Select>
                                                    <FormMessage /></FormItem>
                                                )} />
                                                <FormField name="platformDevelopment" render={({ field }) => (
                                                    <FormItem><FormLabel>Primary Development Platform</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue placeholder="Select platform" /></SelectTrigger></FormControl>
                                                            <SelectContent>
                                                                {Object.values(UserDevelopmentPlatform).map(val => <SelectItem key={val} value={val}>{val.replace('_', ' ')}</SelectItem>)}
                                                            </SelectContent>
                                                        </Select>
                                                    <FormMessage /></FormItem>
                                                )} />
                                                <FormField name="serviceUsage" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Why are you using our service?</FormLabel>
                                                        <div className="grid grid-cols-2 gap-4">
                                                        {Object.values(UserTestingServiceReason).map((item) => (
                                                            <FormField key={item} control={form.control} name="serviceUsage" render={({ field }) => (
                                                                <FormItem key={item} className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 has-[:checked]:border-primary">
                                                                    <FormControl>
                                                                        <Checkbox checked={field.value?.includes(item)} onCheckedChange={(checked) => {
                                                                            return checked ? field.onChange([...(field.value || []), item]) : field.onChange(field.value?.filter((value) => value !== item))
                                                                        }} />
                                                                    </FormControl>
                                                                    <FormLabel className="text-sm font-normal">{item.replace('_', ' ')}</FormLabel>
                                                                </FormItem>
                                                            )} />
                                                        ))}
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                            </div>
                                        )}

                                        <div className="mt-8 pt-5 border-t">
                                            <div className="flex justify-between">
                                                <Button
                                                    type="button"
                                                    onClick={prev}
                                                    disabled={currentStep === 0}
                                                    variant="ghost"
                                                    className={cn(currentStep === 0 && "invisible")}
                                                >
                                                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                                </Button>
                                                <Button
                                                    type="button"
                                                    onClick={next}
                                                    className={cn(currentStep === formSteps.length -1 && "hidden")}
                                                >
                                                    Next <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    className={cn(currentStep !== formSteps.length -1 && "hidden")}
                                                    onClick={handleSubmit(processForm)}
                                                >
                                                    Finish <Check className="ml-2 h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </form>
                        </FormProvider>
                    </div>
                )}
            </div>
        </div>
        <AnimatePresence>
        {currentStep === 0 && (
             <motion.div 
                className="hidden lg:flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-background"
                initial={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300, transition: { duration: 0.3, ease: "easeIn" } }}
             >
                <BackgroundBeams />
                <div className="relative z-10 flex flex-col items-center">
                    <SiteLogo className="h-20 w-auto mb-4" />
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Join the Community</h1>
                    <p className="mt-2 max-w-md mx-auto text-muted-foreground">
                       Start your journey to building flawless apps with a global community of testers.
                    </p>
                </div>
            </motion.div>
        )}
        </AnimatePresence>
    </div>
    );
}
