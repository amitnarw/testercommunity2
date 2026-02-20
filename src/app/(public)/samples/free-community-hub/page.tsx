"use client";

import { Button } from "@/components/ui/button";
import { Lock, Moon, Sun } from "lucide-react";
import { sampleCommunityAppDetails } from "@/lib/sample-data";
import Link from "next/link";
import { useTheme } from "next-themes";
import OngoingProjectView from "@/components/community-dashboard/ongoing-project-view";
import { Badge } from "@/components/ui/badge";

export default function SampleFreeCommunityHubPage() {
  const { setTheme, theme } = useTheme();
  const appDetails = sampleCommunityAppDetails;

  return (
    <div className="min-h-screen bg-secondary/50 relative">
      {/* Floating Header Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 md:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-2">
          <div className="flex items-center justify-between sm:justify-center gap-2 w-full">
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Community Hub
            </h1>
            <Badge>FREE</Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full ml-auto"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>

          <Button
            asChild
            className="rounded-full shadow-lg shadow-primary/20 px-6 w-full sm:w-auto"
          >
            <Link href="/auth/register">
              <Lock className="w-4 h-4 mr-2" />
              Sign Up to Access
            </Link>
          </Button>
        </div>
      </div>

      <div className="pt-32">
        <OngoingProjectView
          appDetails={appDetails}
          isLoading={false}
          refetch={() => {}}
          hubId={appDetails.id}
          showBackButton={false}
        />
      </div>
    </div>
  );
}
