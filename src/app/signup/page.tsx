
import { SignupForm } from '@/components/signup-form';
import { ParallaxBackground } from '@/components/parallax-background';

export default function SignupPage() {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-center justify-center p-12 text-center relative">
        <div className="relative z-10 flex flex-col items-center justify-center">
          <ParallaxBackground />
          <h1 className="text-4xl font-bold tracking-tight mt-8 text-foreground">Join a community of innovators</h1>
          <p className="mt-4 max-w-md mx-auto text-muted-foreground">
            Whether you're here to test, or have your app tested, you're in the right place. Welcome to the future of quality assurance.
          </p>
           <div className="text-center mt-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              And start your journey with TestTribe
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-center p-6 bg-secondary/20">
        <div className="max-w-md w-full space-y-6">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
