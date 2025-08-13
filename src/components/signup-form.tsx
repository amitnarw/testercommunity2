
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, ArrowRight } from 'lucide-react';


const signupSchema = z.object({
  role: z.string({ required_error: 'Please select your role.' }),
  companySize: z.string({ required_error: 'Please select your company size.' }),
  primaryGoal: z.string({ required_error: 'Please select your primary goal.' }),
  monthlyBudget: z.string({ required_error: 'Please select your budget.' }),
  fullName: z.string().min(2, 'Please enter your full name.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  terms: z.boolean().refine(val => val === true, { message: 'You must accept the terms.' }),
});

type SignupFormData = z.infer<typeof signupSchema>;

const formSteps = [
    { id: 'role', fields: ['role'], title: 'What is your current role?' },
    { id: 'company', fields: ['companySize'], title: 'What is the size of your team?' },
    { id: 'goal', fields: ['primaryGoal', 'monthlyBudget'], title: 'What brings you to TestTribe?' },
    { id: 'account', fields: ['fullName', 'email', 'password', 'terms'], title: 'Finally, create your account.' },
]

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.655-3.307-11.28-7.792l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,36.626,44,31.1,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);

export function SignupForm() {
    const [currentStep, setCurrentStep] = useState(0);
    const [previousStep, setPreviousStep] = useState(0);

    const form = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        mode: 'onChange',
    });
    
    const { trigger, handleSubmit } = form;

    const next = async () => {
        const fields = formSteps[currentStep].fields;
        const output = await trigger(fields as (keyof SignupFormData)[], { shouldFocus: true });
    
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

    const processForm: SubmitHandler<SignupFormData> = (data) => {
        console.log('Final form data:', data);
        // Handle final submission logic here
    };

    const delta = currentStep - previousStep;

    return (
        <div className="space-y-6">
            <Button variant="outline" className="w-full rounded-xl py-6 text-base">
                <GoogleIcon className="mr-3" />
                Sign up with Google
            </Button>

            <div className="flex items-center gap-4">
                <Separator className="flex-1 bg-border/50" />
                <span className="text-xs text-muted-foreground">OR</span>
                <Separator className="flex-1 bg-border/50" />
            </div>

            <FormProvider {...form}>
                <form onSubmit={handleSubmit(processForm)} className="space-y-8 overflow-hidden">
                    <AnimatePresence initial={false} custom={delta}>
                        <motion.div
                            key={currentStep}
                            custom={delta}
                            initial={{ opacity: 0, x: delta > 0 ? 300 : -300 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: delta > 0 ? -300 : 300 }}
                            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
                        >
                            <h3 className="font-semibold text-lg text-center mb-6">{formSteps[currentStep].title}</h3>

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

                            {currentStep === 3 && (
                                <div className='space-y-4'>
                                    <FormField
                                        control={form.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} className="rounded-xl h-12" />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="you@example.com" {...field} className="rounded-xl h-12" />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="••••••••" {...field} className="rounded-xl h-12" />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name="terms"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md py-4">
                                            <FormControl>
                                                <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="text-sm font-normal text-muted-foreground">
                                                    I accept the <Link href="/terms" className="underline text-primary hover:no-underline">terms and conditions</Link>.
                                                </FormLabel>
                                                <FormMessage />
                                            </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </form>
            </FormProvider>

            <div className="mt-8 pt-5">
                <div className="flex justify-between">
                    <Button
                        type="button"
                        onClick={prev}
                        disabled={currentStep === 0}
                        variant="outline"
                        className={cn(currentStep === 0 && "invisible")}
                    >
                        <ArrowLeft className="mr-2" /> Back
                    </Button>
                    <Button
                        type="button"
                        onClick={next}
                        className={cn(currentStep === formSteps.length -1 && "hidden")}
                    >
                        Next <ArrowRight className="ml-2" />
                    </Button>
                     <Button
                        type="submit"
                        className={cn("w-full", currentStep !== formSteps.length -1 && "hidden")}
                        onClick={handleSubmit(processForm)}
                    >
                       Create Account
                    </Button>
                </div>
            </div>
        </div>
    );
}

