
import { SignupForm } from '@/components/signup-form';
import { ParallaxBackground } from '@/components/parallax-background';
import { Card, CardContent } from '@/components/ui/card';

export default function SignupPage() {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-center justify-center p-12 text-center relative overflow-hidden bg-background dark:bg-secondary bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100/30 via-transparent to-transparent">
        <div className="relative z-10 flex flex-col items-center justify-center">
            <ParallaxBackground />
            <h1 className="text-4xl font-bold tracking-tight mt-8">Join a community of innovators</h1>
            <p className="mt-4 text-muted-foreground max-w-md mx-auto">
                Whether you're here to test, or have your app tested, you're in the right place. Welcome to the future of quality assurance.
            </p>
        </div>
      </div>
        <div className="w-full space-y-8 flex flex-col justify-center mx-auto p-6">
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
