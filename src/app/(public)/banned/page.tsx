"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Ban, Mail, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function BannedPage() {
  const searchParams = useSearchParams();
  const errorDescription = searchParams.get("error_description") || "Your account has been suspended. Please contact support for more information.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl border border-border shadow-lg p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <Ban className="w-8 h-8 text-destructive" />
          </div>

          <h1 className="text-2xl font-semibold text-foreground mb-3">
            Account Suspended
          </h1>

          <p className="text-muted-foreground mb-8 leading-relaxed">
            {errorDescription}
          </p>

          <div className="space-y-3">
            <Button asChild className="w-full rounded-xl">
              <Link href="mailto:support@intesters.com">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Link>
            </Button>

            <div className="flex gap-3">
              <Button variant="outline" asChild className="flex-1 rounded-xl">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </Button>

              <Button variant="outline" asChild className="flex-1 rounded-xl">
                <Link href="/tester/auth/login">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}