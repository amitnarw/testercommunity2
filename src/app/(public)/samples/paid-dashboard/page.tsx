"use client";

import { Button } from "@/components/ui/button";
import { Lock, Moon, Sun } from "lucide-react";
import { samplePaidProjectDetails } from "@/lib/sample-data";
import Link from "next/link";
import { useTheme } from "next-themes";
import ProjectDetailsView from "@/components/dashboard/project-details-view";

export default function SamplePaidDashboardPage() {
  const { setTheme, theme } = useTheme();
  const project = samplePaidProjectDetails;

  return (
    <div className="relative min-h-screen">
      {/* Floating Header Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-500 to-violet-500 bg-clip-text text-transparent">
            Developer Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <Button
              asChild
              className="rounded-full shadow-lg shadow-primary/20"
            >
              <Link href="/auth/register">
                <Lock className="w-4 h-4 mr-2" />
                Sign Up to Access
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-32">
        <ProjectDetailsView project={project} showBackButton={false} />
      </div>
    </div>
  );
}
