
'use client';

import React, { useState } from 'react';
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
import { ArrowLeft, ArrowRight, Save, CheckCircle, Briefcase, User, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserProfileData } from '@/lib/types';
import { UserProfileType, UserJobRole, UserExperienceLevel, UserCompanySize, UserCompanyPosition, UserTotalPublishedApps, UserDevelopmentPlatform, UserPublishFrequency, UserTestingServiceReason, UserCommunicationMethod, UserNotificationPreference } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useMediaQuery } from "@/hooks/use-media-query";
import { ProfileStepper } from '@/components/profile-stepper';

const profileFormSchema = z.object({
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

type ProfileFormData = z.infer<typeof profileFormSchema>;


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


function ProfileSetupPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileFormSchema),
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

                    <div className="mt-8 relative">
                        <FormProvider {...form}>
                            <form onSubmit={form.handleSubmit(processForm)}>
                                <p>Stepper component will go here.</p>
                                <Button type="submit">Submit</Button>
                            </form>
                        </FormProvider>
                     </div>
                </>
                )}
            </div>
            <ProfileStepper form={form} />
        </div>
    );
}

export default ProfileSetupPage;
