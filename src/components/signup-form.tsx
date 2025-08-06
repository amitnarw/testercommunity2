'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { ArrowLeft, ArrowRight, User, Lock, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

const step1Schema = z.object({
  role: z.enum(['developer', 'tester'], { required_error: 'Please select a role.' }),
});

const step2Schema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
});

const step3Schema = z.object({
    fullName: z.string().min(2, 'Please enter your full name.'),
    terms: z.boolean().refine(val => val === true, { message: 'You must accept the terms.' }),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;

type FormData = Step1Data & Step2Data & Step3Data;

const steps = [
  { id: 1, schema: step1Schema },
  { id: 2, schema: step2Schema },
  { id: 3, schema: step3Schema },
];

export function SignupForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<FormData>>({});

  const { register, handleSubmit, formState: { errors }, trigger, getValues } = useForm({
    resolver: zodResolver(steps[currentStep].schema),
    mode: 'onChange'
  });

  const processStep: SubmitHandler<any> = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Final form data:', {...formData, ...data});
      // Handle final submission
    }
  };

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      processStep(getValues());
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="space-y-6">
      <Progress value={progress} className="h-2" />
      <form onSubmit={handleSubmit(processStep)} className="overflow-hidden">
        <AnimatePresence mode="wait">
            <motion.div
                key={currentStep}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                {currentStep === 0 && (
                    <div className="space-y-4">
                        <Label>What is your role?</Label>
                        <RadioGroup {...register('role')} className="grid grid-cols-2 gap-4">
                            <div>
                                <RadioGroupItem value="developer" id="developer" className="peer sr-only" />
                                <Label htmlFor="developer" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                    I'm a Developer
                                </Label>
                            </div>
                             <div>
                                <RadioGroupItem value="tester" id="tester" className="peer sr-only" />
                                <Label htmlFor="tester" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                    I'm a Tester
                                </Label>
                            </div>
                        </RadioGroup>
                        {errors.role && <p className="text-sm text-destructive">{errors.role.message as string}</p>}
                    </div>
                )}
                {currentStep === 1 && (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input id="email" type="email" placeholder="you@example.com" {...register('email')} className="pl-10" />
                            </div>
                            {errors.email && <p className="text-sm text-destructive">{errors.email.message as string}</p>}
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                             <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input id="password" type="password" placeholder="********" {...register('password')} className="pl-10" />
                            </div>
                            {errors.password && <p className="text-sm text-destructive">{errors.password.message as string}</p>}
                        </div>
                    </div>
                )}
                {currentStep === 2 && (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="fullName">Full Name</Label>
                             <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input id="fullName" placeholder="John Doe" {...register('fullName')} className="pl-10" />
                            </div>
                            {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message as string}</p>}
                        </div>
                        <div className="flex items-center space-x-2">
                           <Checkbox id="terms" {...register('terms')} />
                            <Label htmlFor="terms" className="text-sm font-normal">
                                I accept the <a href="#" className="underline text-primary">terms and conditions</a>.
                            </Label>
                        </div>
                        {errors.terms && <p className="text-sm text-destructive">{errors.terms.message as string}</p>}
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
      </form>
      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrev} disabled={currentStep === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNext}>
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleNext}>Finish</Button>
        )}
      </div>
    </div>
  );
}
