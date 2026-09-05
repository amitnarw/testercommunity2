import { BackButton } from "@/components/back-button";
import { cn } from "@/lib/utils";

interface StickyPageHeaderProps {
  title: React.ReactNode;
  backHref: string;
  className?: string;
  titleClassName?: string;
  onBack?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  rightContent?: React.ReactNode;
  children?: React.ReactNode;
}

export function StickyPageHeader({
  title,
  backHref,
  onBack,
  className,
  titleClassName,
  rightContent,
  children,
}: StickyPageHeaderProps) {
  return (
    <>
      <div
        data-loc="StickyPageHeader"
        className={cn(
          "flex flex-row gap-5 items-center sticky top-0 z-[50] py-2 md:py-1 px-2",
          className,
        )}
      >
        <BackButton href={backHref} onClick={onBack} />
        <h1
          className={cn(
            "font-semibold tracking-tight text-xl md:text-2xl bg-gradient-to-b from-primary to-primary/50 bg-clip-text text-transparent leading-0 truncate",
            titleClassName,
          )}
        >
          {title}
        </h1>
        {rightContent && <div className="ml-auto">{rightContent}</div>}
      </div>
      {children}
    </>
  );
}
