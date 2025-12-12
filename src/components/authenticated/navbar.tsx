"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { Sun, Moon } from "lucide-react";
import { UserNav } from "../user-nav";
import MobileMenu from "../mobile-menu";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "../ui/skeleton";

export default function Navbar({ onLogout }: { onLogout: () => void }) {
  const { data: session, isPending } = authClient.useSession();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="sticky top-0 z-40 bg-[#f8fafc] dark:bg-[#0f151e] md:pl-20 py-2">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 h-8 w-8"
            >
              <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <div className="hidden md:block">
              <Skeleton className="h-9 w-16 ml-3 my-2 rounded-full" />
            </div>
            <MobileMenu
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              onLogout={onLogout}
            />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-[#f8fafc] dark:bg-[#0f151e] md:pl-20 py-2">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-end gap-2">
          <div className="flex flex-row gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 h-8 w-8"
              >
                <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              <div className="hidden md:block">
                {isPending ? (
                  <Skeleton className="h-9 w-16 my-2 rounded-full" />
                ) : session ? (
                  <UserNav session={session} onLogout={onLogout} />
                ) : null}
              </div>
            </div>

            <MobileMenu
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              onLogout={onLogout}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
