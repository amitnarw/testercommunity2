
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { InteractiveGridPattern } from '@/components/ui/interactive-grid-pattern';
import { cn } from '@/lib/utils';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4 overflow-hidden relative">
      <InteractiveGridPattern
        className={cn(
            "[mask-image:radial-gradient(700px_circle_at_center,rgba(255,255,255,0.6),transparent)]",
            "transform -skew-y-12"
        )}
        width={30}
        height={30}
        squares={[30, 30]}
        squaresClassName="hover:fill-gray-100"
      />
      <div className="max-w-md w-full relative z-10">
        <div className="relative z-10 bg-background/50 backdrop-blur-sm p-8 rounded-xl border">
          <h1 className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent text-9xl font-semibold">404</h1>
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
