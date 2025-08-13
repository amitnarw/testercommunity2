
'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const signupSchema = z.object({
  role: z.enum(['developer', 'tester'], { required_error: 'Please select a role.' }),
  fullName: z.string().min(2, 'Please enter your full name.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  terms: z.boolean().refine(val => val === true, { message: 'You must accept the terms.' }),
});

type SignupFormData = z.infer<typeof signupSchema>;

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.655-3.307-11.28-7.792l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,36.626,44,31.1,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);

export function SignupForm() {
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
        fullName: '',
        email: '',
        password: '',
        terms: false,
    }
  });

  const processForm: SubmitHandler<SignupFormData> = (data) => {
    console.log('Final form data:', data);
    // Handle final submission
  };

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

        <Form {...form}>
            <form onSubmit={form.handleSubmit(processForm)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="relative grid grid-cols-2 gap-2 rounded-xl bg-secondary p-1"
                                >
                                     <div className={cn(
                                        "absolute h-[calc(100%-0.5rem)] w-[calc(50%-0.25rem)] bg-background shadow-md rounded-lg transition-transform duration-300 ease-in-out",
                                        field.value === 'developer' ? 'translate-x-0' : 'translate-x-full'
                                    )} style={{ margin: '0.25rem' }}></div>
                                    <FormItem>
                                        <FormControl>
                                            <RadioGroupItem value="developer" id="developer" className="peer sr-only" />
                                        </FormControl>
                                        <Label htmlFor="developer" className="relative z-10 flex cursor-pointer justify-center rounded-lg p-3 text-center transition-colors peer-data-[state=checked]:text-primary">
                                            I'm a Developer
                                        </Label>
                                    </FormItem>
                                    <FormItem>
                                        <FormControl>
                                            <RadioGroupItem value="tester" id="tester" className="peer sr-only" />
                                        </FormControl>
                                        <Label htmlFor="tester" className="relative z-10 flex cursor-pointer justify-center rounded-lg p-3 text-center transition-colors peer-data-[state=checked]:text-primary">
                                            I'm a Tester
                                        </Label>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                            <Input placeholder="John Doe" {...field} />
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
                            <Input placeholder="you@example.com" {...field} />
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
                            <Input type="password" placeholder="••••••••" {...field} />
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

                <Button type="submit" className="w-full rounded-xl py-6 text-lg">Create Account</Button>
            </form>
        </Form>
    </div>
  );
}
