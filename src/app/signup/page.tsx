
import { SignupForm } from '@/components/signup-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TestTribeLogo } from '@/components/icons';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-center justify-center bg-secondary/50 p-12 text-center relative overflow-hidden bg-dot-pattern-dark animate-background-position">
        <div className="relative z-10">
            <Link href="/" className="inline-block mb-8">
                <TestTribeLogo className="h-12" />
            </Link>
            <h1 className="text-4xl font-bold tracking-tight">Join a community of innovators</h1>
            <p className="mt-4 text-muted-foreground max-w-md mx-auto">
                Whether you're here to test, or have your app tested, you're in the right place. Welcome to the future of quality assurance.
            </p>
        </div>
      </div>
        <div className="w-full max-w-md space-y-8 flex flex-col justify-center mx-auto p-6">
            <div>
              <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
                Create your account
              </h2>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                And start your journey with TestTribe
              </p>
            </div>
            <Card className="shadow-2xl shadow-primary/10 rounded-xl border-none bg-card/50">
                <CardContent className="p-6">
                    <SignupForm />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
