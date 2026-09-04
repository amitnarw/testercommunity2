"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { TransitionLink } from "@/components/transition-link";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

type TestingOption = {
  name: string;
  href: string;
};

const testingOptions: TestingOption[] = [
  {
    name: "Handshake Testing",
    href: ROUTES.PUBLIC.HANDSHAKE_TESTING,
  },
  {
    name: "Pro Testing",
    href: ROUTES.PUBLIC.PRO_TESTING,
  },
];

interface TestingDropdownProps {
  className?: string;
}

export function TestingDropdown({
  className,
}: TestingDropdownProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = testingOptions.some((opt) =>
    pathname.startsWith(opt.href),
  );

  const cancelOpen = () => {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
  };

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleOpen = () => {
    cancelOpen();
    if (open) return;
    openTimer.current = setTimeout(() => {
      setOpen(true);
      openTimer.current = null;
    }, 100);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      closeTimer.current = null;
    }, 250);
  };

  const handleWrapperEnter = () => {
    cancelClose();
    scheduleOpen();
  };

  const handleWrapperLeave = () => {
    cancelOpen();
    scheduleClose();
  };

  const handleContentEnter = () => {
    cancelClose();
  };

  const handleContentLeave = () => {
    cancelOpen();
    scheduleClose();
  };

  useEffect(() => {
    return () => {
      cancelOpen();
      cancelClose();
    };
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleWrapperEnter}
      onMouseLeave={handleWrapperLeave}
    >
      <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={open}
            className={cn(
              "group inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              "text-muted-foreground hover:text-primary",
              "hover:bg-black/5 dark:hover:bg-white/10",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
              isActive && "text-primary",
              className,
            )}
          >
            <span>Testing</span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-300 ease-out",
                open && "rotate-180",
              )}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          sideOffset={8}
          onMouseEnter={handleContentEnter}
          onMouseLeave={handleContentLeave}
          className={cn(
            "min-w-[180px] p-1 rounded-xl overflow-hidden",
            "bg-white/70 dark:bg-white/[0.06]",
            "backdrop-blur-2xl backdrop-saturate-150",
            "shadow-[0_8px_32px_0_rgba(0,0,0,0.15)]",
            "dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.08)]",
          )}
        >
          <div className="flex flex-col gap-0.5">
            {testingOptions.map((option) => (
              <TransitionLink
                key={option.name}
                href={option.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block w-full text-left px-3 py-2 rounded-md",
                  "text-sm font-medium no-underline",
                  "text-foreground",
                  "hover:bg-black/5 dark:hover:bg-white/[0.10]",
                  "focus-visible:bg-black/5 dark:focus-visible:bg-white/[0.10]",
                  "transition-colors duration-150 outline-none cursor-pointer",
                )}
              >
                {option.name}
              </TransitionLink>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
