import { cn } from "@/lib/utils";

interface StickyPageTitleProps {
  title: React.ReactNode;
  className?: string;
  titleClassName?: string;
  rightContent?: React.ReactNode;
  children?: React.ReactNode;
}

export function StickyPageTitle({
  title,
  className,
  titleClassName,
  rightContent,
  children,
}: StickyPageTitleProps) {
  return (
    <>
      <div
        data-loc="StickyPageTitle"
        className={cn(
          "flex flex-row gap-5 items-center sticky top-0 z-[50] pt-2 md:pt-1",
          className,
        )}
      >
        <h1
          className={cn(
            "font-semibold tracking-tight text-2xl md:text-4xl",
            titleClassName,
          )}
        >
          {title}
        </h1>
        {rightContent && <div>{rightContent}</div>}
      </div>
      {children}
    </>
  );
}
