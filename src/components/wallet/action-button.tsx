import { LucideIcon } from "lucide-react";
import { TransitionLink } from "@/components/transition-link";

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
  primary?: boolean;
}

export function ActionButton({
  icon: Icon,
  label,
  href,
  onClick,
  primary = false,
}: ActionButtonProps) {
  if (primary) {
    const pillContent = (
      <>
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-full" />
        <Icon className="w-5 h-5 relative" />
        <span className="relative font-semibold text-sm sm:text-base">{label}</span>
      </>
    );

    const pillClasses =
      "inline-flex items-center gap-3 h-12 sm:h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition-all duration-300 px-6 sm:px-8 relative overflow-hidden";

    const pill = href ? (
      <TransitionLink href={href} className={pillClasses}>{pillContent}</TransitionLink>
    ) : (
      <button onClick={onClick} className={pillClasses}>{pillContent}</button>
    );

    return (
      <div className="relative inline-flex">
        <div
          className="absolute -inset-5 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.6) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />
        {pill}
      </div>
    );
  }

  const defaultContent = (
    <div className="w-16 sm:w-20 py-2 px-1 rounded-xl bg-card border border-border text-muted-foreground hover:bg-accent/50 transition-all duration-300 flex flex-col items-center gap-0.5">
      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      <span className="text-[8px] sm:text-[9px] font-medium text-muted-foreground leading-tight">{label}</span>
    </div>
  );

  if (href) {
    return (
      <TransitionLink href={href} className="transition-all duration-300 hover:-translate-y-1 inline-flex">
        {defaultContent}
      </TransitionLink>
    );
  }

  return (
    <button onClick={onClick} className="transition-all duration-300 hover:-translate-y-1 inline-flex">
      {defaultContent}
    </button>
  );
}
