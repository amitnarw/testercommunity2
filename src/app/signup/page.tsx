
import { SignupForm } from '@/components/signup-form';
import { TestTribeLogo } from '@/components/icons';

export default function SignupPage() {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="hidden bg-muted lg:flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
            <TestTribeLogo className="h-20 w-auto mb-4" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Join a community of innovators</h1>
            <p className="mt-2 max-w-md mx-auto text-muted-foreground">
                Whether you're here to test, or have your app tested, you're in the right place.
            </p>
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-center p-6 bg-background">
        <div className="max-w-md w-full space-y-6">
           <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Create your account
            </h2>
          </div>
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
