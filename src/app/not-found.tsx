import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { InteractiveOrbs } from '@/components/interactive-orbs';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4 overflow-hidden">
      <div className="max-w-md w-full relative">
        <InteractiveOrbs />
        <div className="relative z-10 bg-background/50 backdrop-blur-sm p-8 rounded-xl">
            <h1 className="text-8xl font-bold text-primary animate-pulse">404</h1>
            <h2 className="mt-4 text-3xl font-semibold">Page Not Found</h2>
            <p className="mt-2 text-muted-foreground">
              Oops! It seems you've wandered off the beaten path.
            </p>
            <div className="mt-12">
              <Button asChild className="rounded-xl">
                <Link href="/">Go Back to Homepage</Link>
              </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
