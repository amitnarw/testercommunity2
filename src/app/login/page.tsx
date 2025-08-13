
import { SignupForm } from '@/components/signup-form';
import { TestTribeLogo } from '@/components/icons';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// This is a placeholder login form. We can build this out later.
const LoginForm = () => {
    return (
        <div className="space-y-4">
             <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" placeholder="you@example.com" className="w-full p-2 border rounded-xl" />
            </div>
            <div className="space-y-2">
                <label htmlFor="password">Password</label>
                <input id="password" type="password" placeholder="••••••••" className="w-full p-2 border rounded-xl" />
            </div>
            <Button className="w-full rounded-xl py-6 text-lg">Log In</Button>
        </div>
    )
}


export default function LoginPage() {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
       <div className="hidden bg-muted lg:flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
            <TestTribeLogo className="h-20 w-auto mb-4" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
            <p className="mt-2 max-w-md mx-auto text-muted-foreground">
                Log in to continue your journey of building flawless apps.
            </p>
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-center p-6 bg-background">
        <div className="max-w-md w-full space-y-6">
           <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Log in to your account
            </h2>
             <p className="text-muted-foreground mt-2">
                Or <Link href="/signup" className="text-primary hover:underline">create a new account</Link>
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
