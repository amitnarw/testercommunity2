
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Save, CheckCircle, Moon, Sun, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserProfileData, UserProfileType, UserJobRole, UserExperienceLevel, UserCompanySize, UserCompanyPosition, UserTotalPublishedApps, UserDevelopmentPlatform, UserPublishFrequency, UserTestingServiceReason, UserCommunicationMethod, UserNotificationPreference } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';


const profileStepSchema = z.object({
  profileType: z.nativeEnum(UserProfileType).optional(),
  jobRole: z.nativeEnum(UserJobRole).optional(),
  experienceLevel: z.nativeEnum(UserExperienceLevel).optional(),
  companyName: z.string().optional(),
  companyWebsite: z.string().optional(),
  companySize: z.nativeEnum(UserCompanySize).optional(),
  positionInCompany: z.nativeEnum(UserCompanyPosition).optional(),
  totalPublishedApps: z.nativeEnum(UserTotalPublishedApps).optional(),
  platformDevelopment: z.nativeEnum(UserDevelopmentPlatform).optional(),
  publishFrequency: z.nativeEnum(UserPublishFrequency).optional(),
  serviceUsage: z.array(z.nativeEnum(UserTestingServiceReason)).optional(),
  communicationMethods: z.array(z.nativeEnum(UserCommunicationMethod)).optional(),
  notificationPreference: z.array(z.nativeEnum(UserNotificationPreference)).optional(),
});

type ProfileFormData = z.infer<typeof profileStepSchema>;

const formSteps = [
    { id: 'role', title: 'Your Role', description: 'Tell us about your professional background.' },
    { id: 'company', title: 'Your Company', description: 'Information about your organization.' },
    { id: 'projects', title: 'Your Projects', description: 'Details about your development work.' },
];

const RegistrationSuccess = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
    >
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold">Profile Setup Complete!</h2>
        <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
            Thank you for setting up your profile. You're all set to explore the dashboard.
        </p>
        <Button asChild className="mt-8">
            <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
    </motion.div>
);

export default function ProfileSetupPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileStepSchema),
        mode: 'onChange',
        defaultValues: {
            serviceUsage: [],
            communicationMethods: [],
            notificationPreference: [],
        }
    });

    const { handleSubmit } = form;

    const processForm: SubmitHandler<any> = (data) => {
        console.log('Final profile data:', data);
        setIsSubmitted(true);
    };

    return (
        <div className="min-h-screen w-full bg-secondary/30 p-4 md:p-8 flex items-center justify-center">
            <div className="w-full max-w-4xl">
                 {isSubmitted ? (
                    <RegistrationSuccess />
                ) : (
                    <>
                    <div className="mb-12">
                        {/* Stepper */}
                        <div className="flex items-center justify-center lg:justify-start">
                            {formSteps.map((step, index) => (
                                <div key={step.id} className="flex items-center w-full">
                                    <div className="flex flex-col items-center text-center">
                                        <div
                                            className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 border-2",
                                                currentStep > index ? "bg-green-500 border-green-500 text-white" :
                                                currentStep === index ? "bg-primary border-primary text-primary-foreground" :
                                                "bg-muted border-border"
                                            )}
                                        >
                                            {currentStep > index ? <Check className="w-5 h-5" /> : index + 1}
                                        </div>
                                        <p className={cn("text-xs mt-2 hidden lg:block", currentStep >= index ? "text-foreground" : "text-muted-foreground")}>{step.title}</p>
                                    </div>
                                    {index < formSteps.length - 1 && (
                                        <div className={cn("flex-auto border-t-2 transition-colors duration-300", currentStep > index ? "border-green-500" : "border-border")}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                     <FormProvider {...form}>
                        <form onSubmit={handleSubmit(processForm)}>
                             <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }}
                                    exit={{ opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } }}
                                >
                                    <div className="bg-card p-8 rounded-2xl shadow-lg">
                                        <div className="mb-8">
                                            <h2 className="text-2xl font-bold">{formSteps[currentStep].title}</h2>
                                            <p className="text-muted-foreground">{formSteps[currentStep].description}</p>
                                        </div>

                                        {/* Step Content */}
                                        {currentStep === 0 && (
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
                                        {currentStep === 1 && (
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
                                        {currentStep === 2 && (
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

                                        {/* Navigation */}
                                        <div className="mt-8 pt-5 border-t flex justify-between">
                                            <Button type="button" onClick={() => setCurrentStep(currentStep - 1)} disabled={currentStep === 0} variant="ghost" className={cn(currentStep === 0 && "invisible")}>
                                                <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                            </Button>
                                            {currentStep < formSteps.length - 1 ? (
                                                <Button type="button" onClick={() => setCurrentStep(currentStep + 1)}>
                                                    Next <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            ) : (
                                                <Button type="submit">
                                                    Finish Setup <Check className="ml-2 h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                             </AnimatePresence>
                        </form>
                     </FormProvider>
                </>
                )}
            </div>
        </div>
    );
}

