import { Logo } from '@/components/icons';

export function ShowcaseHeader() {
  return (
    <header className="flex h-16 items-center px-6">
      <div className="flex items-center gap-3">
        <Logo className="h-7 w-7 text-primary" />
        <h1 className="text-xl font-bold tracking-tight font-headline text-primary">
          Showcase Canvas
        </h1>
      </div>
    </header>
  );
}
