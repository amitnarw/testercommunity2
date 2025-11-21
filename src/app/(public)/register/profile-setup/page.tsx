
'use client';

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
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
import { ArrowLeft, ArrowRight, Save, CheckCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserProfileType, UserJobRole, UserExperienceLevel, UserCompanySize, UserCompanyPosition, UserTotalPublishedApps, UserDevelopmentPlatform, UserPublishFrequency, UserTestingServiceReason, UserCommunicationMethod, UserNotificationPreference } from '@/lib/types';
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
  country: z.string().optional(),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileStepSchema>;

const formSteps = [
    { id: 'role', title: 'Your Role', description: 'Tell us about your professional background.' },
    { id: 'company', title: 'Your Company', description: 'Information about your organization.' },
    { id: 'projects', title: 'Your Projects', description: 'Details about your development work.' },
    { id: 'contact', title: 'Contact', description: 'How we can reach you.' },
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
    const [arrowStyle, setArrowStyle] = useState({});

    const stepperRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);


    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileStepSchema),
        mode: 'onChange',
        defaultValues: {
            profileType: undefined,
            jobRole: undefined,
            experienceLevel: undefined,
            companyName: '',
            companyWebsite: '',
            companySize: undefined,
            positionInCompany: undefined,
            totalPublishedApps: undefined,
            platformDevelopment: undefined,
            publishFrequency: undefined,
            serviceUsage: [],
            communicationMethods: [],
            notificationPreference: [],
            country: '',
            phone: '',
        }
    });

    const { handleSubmit } = form;

     const updateArrowPosition = () => {
        if (stepperRef.current) {
            const activeStepElement = stepperRef.current.querySelector(`[data-step-index="${currentStep}"]`) as HTMLElement;
            if (activeStepElement) {
                const isMobile = window.innerWidth < 1024;
                if (isMobile) {
                    const top = activeStepElement.offsetTop + activeStepElement.offsetHeight / 2;
                    setArrowStyle({ top: `${top}px`, left: '100%', right: 'auto', transform: 'translateY(-50%) rotate(0deg)' });
                } else {
                    const left = activeStepElement.offsetLeft + activeStepElement.offsetWidth / 2;
                    setArrowStyle({ left: `${left}px`, top: '100%', right: 'auto', transform: 'translateX(-50%) rotate(0deg)' });
                }
            }
        }
    };
    
    useLayoutEffect(() => {
        updateArrowPosition();
        window.addEventListener('resize', updateArrowPosition);
        return () => window.removeEventListener('resize', updateArrowPosition);
    }, [currentStep]);

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
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">User Survey</h2>
                        <p className="text-primary font-semibold mt-2">
                            Complete your profile to receive a <span className="font-bold">200 point bonus</span> to get you started!
                        </p>
                    </div>

                     <div className="relative mb-4">
                        <div ref={stepperRef} className="relative flex lg:justify-between">
                            {/* Desktop Line */}
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border hidden lg:block -translate-y-1/2"></div>
                            {/* Mobile Line */}
                            <div className="absolute left-4 top-0 h-full w-0.5 bg-border block lg:hidden"></div>

                            {formSteps.map((step, index) => (
                                <div
                                    key={step.id}
                                    data-step-index={index}
                                    className="flex items-center gap-4 lg:flex-col lg:gap-2 p-4 cursor-pointer relative z-10 lg:w-20"
                                    onClick={() => setCurrentStep(index)}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 border-2 bg-background flex-shrink-0",
                                        currentStep > index ? "bg-green-500 border-green-500 text-white" :
                                        currentStep === index ? "border-primary" : "border-border"
                                    )}>
                                        {currentStep > index ? <Check className="w-5 h-5" /> : (
                                            <div className={cn("w-3 h-3 rounded-full transition-colors duration-300", currentStep === index && "bg-primary")}></div>
                                        )}
                                    </div>
                                    <div className="lg:text-center">
                                       <p className="font-semibold text-sm lg:mt-2 hidden lg:block">{step.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                     <div className="mt-8 relative">
                         <div className="text-center mb-2">
                            <h3 className="font-bold text-xl">{formSteps[currentStep].title}</h3>
                        </div>
                        <div 
                            className="w-4 h-4 bg-card absolute z-10"
                            style={{ ...arrowStyle, clipPath: 'polygon(0 50%, 100% 0, 100% 100%)' }}
                        ></div>
                        <FormProvider {...form}>
                            <form ref={contentRef} onSubmit={handleSubmit(processForm)}>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentStep}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }}
                                        exit={{ opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } }}
                                    >
                                        <div className="bg-card p-8 rounded-2xl shadow-lg">
                                            <p className="text-muted-foreground mb-6 text-center">{formSteps[currentStep].description}</p>
                                            {currentStep === 0 && (
                                                <div className="space-y-6">
                                                    <FormField
                                                        control={form.control}
                                                        name="profileType"
                                                        render={({ field }) => (
                                                            <FormItem className="space-y-3">
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
                                                            <SelectContent>{Object.values(UserJobRole).map(role => <SelectItem key={role} value={role}>{role.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
                                                        </Select>
                                                        <FormMessage /></FormItem>
                                                    )} />
                                                     <FormField name="experienceLevel" render={({ field }) => (
                                                        <FormItem><FormLabel>Your Experience Level</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue placeholder="Select your experience level" /></SelectTrigger></FormControl>
                                                            <SelectContent>{Object.values(UserExperienceLevel).map(level => <SelectItem key={level} value={level}>{level.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
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
                                                                {Object.values(UserCompanySize).map(size => <SelectItem key={size} value={size}>{size.replace('SIZE_', '').replace(/_/g, '-')}</SelectItem>)}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage /></FormItem>
                                                )} />
                                                <FormField name="positionInCompany" render={({ field }) => (
                                                    <FormItem><FormLabel>Your Position</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue placeholder="Select your position" /></SelectTrigger></FormControl>
                                                            <SelectContent>
                                                                {Object.values(UserCompanyPosition).map(pos => <SelectItem key={pos} value={pos}>{pos.replace(/_/g, ' ')}</SelectItem>)}
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
                                                                    {Object.values(UserTotalPublishedApps).map(val => <SelectItem key={val} value={val}>{val.replace('PUB_', '').replace(/_/g, '-')}</SelectItem>)}
                                                                </SelectContent>
                                                            </Select>
                                                        <FormMessage /></FormItem>
                                                    )} />
                                                    <FormField name="platformDevelopment" render={({ field }) => (
                                                        <FormItem><FormLabel>Primary Development Platform</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl><SelectTrigger><SelectValue placeholder="Select platform" /></SelectTrigger></FormControl>
                                                                <SelectContent>
                                                                    {Object.values(UserDevelopmentPlatform).map(val => <SelectItem key={val} value={val}>{val.replace(/_/g, ' ')}</SelectItem>)}
                                                                </SelectContent>
                                                            </Select>
                                                        <FormMessage /></FormItem>
                                                    )} />
                                                    <FormField name="publishFrequency" render={({ field }) => (
                                                        <FormItem><FormLabel>App Publish Frequency</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl><SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger></FormControl>
                                                                <SelectContent>
                                                                    {Object.values(UserPublishFrequency).map(val => <SelectItem key={val} value={val}>{val.replace(/_/g, ' ')}</SelectItem>)}
                                                                </SelectContent>
                                                            </Select>
                                                        <FormMessage /></FormItem>
                                                    )} />
                                                </div>
                                            )}
                                            {currentStep === 3 && (
                                                 <div className="space-y-6">
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
                                                                        <FormLabel className="text-sm font-normal">{item.replace(/_/g, ' ')}</FormLabel>
                                                                    </FormItem>
                                                                )} />
                                                            ))}
                                                            </div>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )} />
                                                     <FormField name="communicationMethods" render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Preferred Communication</FormLabel>
                                                            <div className="grid grid-cols-3 gap-4">
                                                            {Object.values(UserCommunicationMethod).map((item) => (
                                                                <FormField key={item} control={form.control} name="communicationMethods" render={({ field }) => (
                                                                    <FormItem key={item} className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 has-[:checked]:border-primary">
                                                                        <FormControl>
                                                                            <Checkbox checked={field.value?.includes(item)} onCheckedChange={(checked) => {
                                                                                return checked ? field.onChange([...(field.value || []), item]) : field.onChange(field.value?.filter((value) => value !== item))
                                                                            }} />
                                                                        </FormControl>
                                                                        <FormLabel className="text-sm font-normal">{item.replace(/_/g, ' ')}</FormLabel>
                                                                    </FormItem>
                                                                )} />
                                                            ))}
                                                            </div>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )} />
                                                 </div>
                                            )}

                                            <div className="mt-8 pt-5 border-t flex justify-between">
                                                <Button type="button" onClick={() => setCurrentStep(currentStep - 1)} disabled={currentStep === 0} variant="ghost" className={cn(currentStep === 0 && "invisible")}>
                                                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                                </Button>
                                                <div className="flex items-center gap-4">
                                                    <Button type="button" variant="ghost" asChild>
                                                        <Link href="/dashboard">Skip for now</Link>
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        onClick={() => setCurrentStep(currentStep + 1)}
                                                        className={cn(currentStep === formSteps.length -1 && "hidden")}
                                                    >
                                                        Next <ArrowRight className="mr-2 h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        className={cn(currentStep !== formSteps.length -1 && "hidden")}
                                                    >
                                                        <Save className="mr-2 h-4 w-4"/> Finish Setup
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </form>
                        </FormProvider>
                     </div>
                </>
                )}
            </div>
        </div>
    );
}
