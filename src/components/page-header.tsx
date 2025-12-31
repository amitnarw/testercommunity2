import { BackButton } from "@/components/back-button";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  backHref: string;
  className?: string;
}

export function PageHeader({ title, backHref, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-row gap-5 items-center sticky top-0 z-[50] py-2 pb-4 px-2",
        className
      )}
    >
      <BackButton href={backHref} />
      <h1 className="font-semibold tracking-tight text-xl sm:text-2xl bg-gradient-to-b from-primary to-primary/50 bg-clip-text text-transparent leading-0">
        {title}
      </h1>
    </div>
  );
}
