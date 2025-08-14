
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserProfileData } from '@/lib/types';


const profileFormSchema = z.object({
  role: z.string({ required_error: 'Please select your role.' }).optional(),
  companySize: z.string({ required_error: 'Please select your company size.' }).optional(),
  primaryGoal: z.string({ required_error: 'Please select your primary goal.' }).optional(),
  monthlyBudget: z.string({ required_error: 'Please select your budget.' }).optional(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

const formSteps = [
    { id: 'role', fields: ['role'], title: 'What is your current role?' },
    { id: 'company', fields: ['companySize'], title: 'What is the size of your team?' },
    { id: 'goal', fields: ['primaryGoal', 'monthlyBudget'], title: 'What brings you to inTesters?' },
]

interface UserProfileFormProps {
    user: UserProfileData;
}

export function UserProfileForm({ user }: UserProfileFormProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [previousStep, setPreviousStep] = useState(0);

    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileFormSchema),
        mode: 'onChange',
        defaultValues: {
            role: user.role,
            companySize: user.companySize,
            primaryGoal: user.primaryGoal,
            monthlyBudget: user.monthlyBudget,
        }
    });
    
    const { trigger, handleSubmit } = form;

    const next = async () => {
        const fields = formSteps[currentStep].fields;
        const output = await trigger(fields as (keyof ProfileFormData)[], { shouldFocus: true });
    
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

    const processForm: SubmitHandler<ProfileFormData> = (data) => {
        console.log('Final profile data:', data);
        // Handle final submission logic here (e.g., API call to save data)
    };

    const delta = currentStep - previousStep;

    return (
        <div className="space-y-6 p-1">
            <FormProvider {...form}>
                <form onSubmit={handleSubmit(processForm)} className="space-y-8 overflow-hidden relative">
                    <AnimatePresence initial={false} custom={delta}>
                        <motion.div
                            key={currentStep}
                            custom={delta}
                            initial={{ opacity: 0, x: delta > 0 ? 300 : -300 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: delta > 0 ? -300 : 300 }}
                            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
                            className="min-h-[250px]"
                        >
                            <h3 className="font-semibold text-lg text-left mb-6">{formSteps[currentStep].title}</h3>

                            {currentStep === 0 && (
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-4">
                                                    <FormItem>
                                                        <RadioGroupItem value="developer" id="developer" className="peer sr-only" />
                                                        <Label htmlFor="developer" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">Software Developer</Label>
                                                    </FormItem>
                                                    <FormItem>
                                                        <RadioGroupItem value="qa_tester" id="qa_tester" className="peer sr-only" />
                                                        <Label htmlFor="qa_tester" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">QA Tester</Label>
                                                    </FormItem>
                                                    <FormItem>
                                                        <RadioGroupItem value="product_manager" id="product_manager" className="peer sr-only" />
                                                        <Label htmlFor="product_manager" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">Product Manager</Label>
                                                    </FormItem>
                                                    <FormItem>
                                                        <RadioGroupItem value="founder" id="founder" className="peer sr-only" />
                                                        <Label htmlFor="founder" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">Founder / C-Level</Label>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            
                            {currentStep === 1 && (
                                <FormField
                                    control={form.control}
                                    name="companySize"
                                    render={({ field }) => (
                                        <FormItem>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-12 rounded-xl">
                                                    <SelectValue placeholder="Select your company size" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="1">It's just me</SelectItem>
                                                <SelectItem value="2-10">2-10 employees</SelectItem>
                                                <SelectItem value="11-50">11-50 employees</SelectItem>
                                                <SelectItem value="51-200">51-200 employees</SelectItem>
                                                <SelectItem value="200+">200+ employees</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                             {currentStep === 2 && (
                                <div className="space-y-4">
                                     <FormField
                                        control={form.control}
                                        name="primaryGoal"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>My main goal is to...</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-12 rounded-xl">
                                                            <SelectValue placeholder="Select your primary goal" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="get_app_tested">Get my app tested by the community</SelectItem>
                                                        <SelectItem value="hire_testers">Hire professional testers</SelectItem>
                                                        <SelectItem value="find_testing_work">Find work as a tester</SelectItem>
                                                        <SelectItem value="exploring">Just exploring</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="monthlyBudget"
                                        render={({ field }) => (
                                            <FormItem>
                                                 <FormLabel>My testing budget is...</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-12 rounded-xl">
                                                            <SelectValue placeholder="Select your monthly budget" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="0">₹0 (Community Plan)</SelectItem>
                                                        <SelectItem value="1-100">₹1 - ₹8,000</SelectItem>
                                                        <SelectItem value="101-500">₹8,000 - ₹40,000</SelectItem>
                                                        <SelectItem value="500+">₹40,000+</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                             )}
                        </motion.div>
                    </AnimatePresence>

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
                            
                            <div className="flex items-center gap-4">
                                <Button
                                    type="button"
                                    onClick={() => console.log('Skipped')}
                                    variant="ghost"
                                >
                                    Skip for now
                                </Button>
                                <Button
                                    type="button"
                                    onClick={next}
                                    className={cn(currentStep === formSteps.length -1 && "hidden")}
                                    variant="outline"
                                >
                                    Next <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                                <Button
                                    type="submit"
                                    className={cn(currentStep !== formSteps.length -1 && "hidden")}
                                    onClick={handleSubmit(processForm)}
                                >
                                   <Save className="mr-2 h-4 w-4"/> Save Profile
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}
