import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BugSquashGame } from '@/components/bug-squash-game';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-background text-center p-4">
      <div className="max-w-md w-full">
        <h1 className="font-headline text-8xl font-bold text-primary animate-pulse">404</h1>
        <h2 className="mt-4 font-headline text-3xl font-semibold">Page Not Found</h2>
        <p className="mt-2 text-muted-foreground">
          Oops! It seems you've wandered off the beaten path.
        </p>

        <div className="mt-8">
            <p className="text-sm text-muted-foreground mb-4">While you're here, why not squash a few bugs?</p>
            <BugSquashGame />
        </div>

        <div className="mt-12">
          <Button asChild className="rounded-xl">
            <Link href="/">Go Back to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
