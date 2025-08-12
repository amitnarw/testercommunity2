
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

const FloatingLabelInput = ({ id, label, register, error }: { id: any, label: string, register: any, error?: { message?: string }}) => (
    <div className="relative border-b-2 border-muted focus-within:border-primary transition-colors">
        <Input 
            id={id} 
            placeholder=" " 
            {...register(id)} 
            className="block w-full appearance-none focus:outline-none bg-transparent border-none p-0 pt-6" 
        />
        <Label 
            htmlFor={id} 
            className="absolute top-4 left-0 -translate-y-1/2 duration-300 origin-0 text-muted-foreground"
        >
            {label}
        </Label>
        {error && <p className="text-sm text-destructive mt-1">{error.message}</p>}
    </div>
);


export function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange'
  });

  const processForm: SubmitHandler<SignupFormData> = (data) => {
    console.log('Final form data:', data);
    // Handle final submission
  };

  return (
    <div className="space-y-8">
        <Button variant="outline" className="w-full rounded-xl py-6 text-lg">
            <GoogleIcon className="mr-3" />
            Sign up with Google
        </Button>

        <div className="flex items-center gap-4">
            <Separator className="flex-1 bg-border/50" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1 bg-border/50" />
        </div>

        <form onSubmit={handleSubmit(processForm)} className="space-y-8">
            <div>
                <RadioGroup {...register('role')} className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
                    <div>
                        <RadioGroupItem value="developer" id="developer" className="peer sr-only" />
                        <Label htmlFor="developer" className="flex items-center justify-center rounded-lg p-2 text-center text-sm font-semibold transition-colors peer-data-[state=checked]:bg-background peer-data-[state=checked]:text-foreground peer-data-[state=unchecked]:text-muted-foreground">
                            I'm a Developer
                        </Label>
                    </div>
                     <div>
                        <RadioGroupItem value="tester" id="tester" className="peer sr-only" />
                        <Label htmlFor="tester" className="flex items-center justify-center rounded-lg p-2 text-center text-sm font-semibold transition-colors peer-data-[state=checked]:bg-background peer-data-[state=checked]:text-foreground peer-data-[state=unchecked]:text-muted-foreground">
                            I'm a Tester
                        </Label>
                    </div>
                </RadioGroup>
                {errors.role && <p className="text-sm text-destructive mt-1">{errors.role.message}</p>}
            </div>

            <FloatingLabelInput id="fullName" label="Full Name" register={register} error={errors.fullName} />
            <FloatingLabelInput id="email" label="Email Address" register={register} error={errors.email} />
            <FloatingLabelInput id="password" label="Password" register={register} error={errors.password} />
            
            <div className="flex items-center space-x-2 pt-2">
               <Checkbox id="terms" {...register('terms')} className="rounded-sm" />
                <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
                    I accept the <a href="#" className="underline text-primary">terms and conditions</a>.
                </Label>
            </div>
            {errors.terms && <p className="text-sm text-destructive">{errors.terms.message}</p>}

            <Button type="submit" className="w-full rounded-xl py-6 text-lg">Create Account</Button>
        </form>
    </div>
  );
}
