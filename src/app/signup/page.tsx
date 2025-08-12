
import { SignupForm } from '@/components/signup-form';
import { ParallaxBackground } from '@/components/parallax-background';

export default function SignupPage() {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-center justify-center p-6 text-center relative bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent">
        <div className="relative z-10 flex flex-col items-center justify-center">
          <ParallaxBackground />
          <h1 className="text-3xl font-bold tracking-tight mt-4 text-foreground">Join a community of innovators</h1>
          <p className="mt-2 max-w-md mx-auto text-muted-foreground">
            Whether you're here to test, or have your app tested, you're in the right place.
          </p>
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-center p-6">
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
