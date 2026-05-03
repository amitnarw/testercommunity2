"use client";

import { Info, ExternalLink, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GoogleGroupBannerProps {
  variant?: "rules" | "note";
  googleGroupUrl?: string;
  googleGroupName?: string;
}

export const GoogleGroupBanner = ({
  variant = "rules",
  googleGroupUrl = "https://groups.google.com/g/appstestlab",
  googleGroupName = "appstestlab",
}: GoogleGroupBannerProps) => {
  if (variant === "note") {
    return (
      <Card className="border-none bg-blue-500/5 dark:bg-blue-500/10 rounded-2xl p-5 border-l-4 border-blue-500 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-3 items-start">
            <div className="mt-1 p-1.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-foreground">Troubleshooting: App not available?</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If Google Play says "App not available", it's usually because you haven't joined the Google Group yet. Join to authorize your access.
              </p>
            </div>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-xl border-blue-500/20 hover:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold whitespace-nowrap !px-10 w-full sm:w-auto"
          >
            <a href={googleGroupUrl} target="_blank" rel="noopener noreferrer">
              Join Group <ExternalLink className="ml-2 w-3 h-3" />
            </a>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border-none bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent shadow-xl shadow-amber-500/5 rounded-[2rem] p-6 sm:p-8 border border-amber-500/10">
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-500 ring-4 ring-amber-500/10">
            <ShieldAlert className="w-8 h-8" />
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Mandatory Preparation Rules
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl">
              To participate in this testing, you must follow these rules. Failing to do so will result in no app access and no rewards.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="flex items-start gap-3 bg-background/50 backdrop-blur-sm p-4 rounded-2xl border border-amber-500/10 transition-colors hover:bg-background/80">
              <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-500 font-bold text-xs">1</div>
              <div className="space-y-2 flex-1">
                <p className="text-sm font-bold text-foreground">Join the Google Group</p>
                <p className="text-xs text-muted-foreground">This is required for Google Play to authorize your email for the test build.</p>
                <Button
                  asChild
                  size="sm"
                  className="rounded-lg bg-amber-600 hover:bg-amber-700 text-white h-8 text-xs"
                >
                  <a href={googleGroupUrl} target="_blank" rel="noopener noreferrer">
                    Join {googleGroupName} <ExternalLink className="ml-2 w-3 h-3" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-background/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50">
              <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-muted-foreground font-bold text-xs">2</div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">Request Access & Wait</p>
                <p className="text-xs text-muted-foreground">Click the "Request to Join" button in the sidebar and wait for approval.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-background/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50">
              <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-muted-foreground font-bold text-xs">3</div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">Download from Play Store</p>
                <p className="text-xs text-muted-foreground">Once approved, use the sidebar link to download the app and begin testing.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
