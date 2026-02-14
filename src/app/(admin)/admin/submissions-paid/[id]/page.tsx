"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, DollarSign, ArrowLeft, ExternalLink, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppPagination } from "@/components/app-pagination";
import { useSubmittedApps, useSubmittedAppsCount } from "@/hooks/useAdmin";
import { HubSubmittedAppResponse } from "@/lib/types";
import { CustomTabsList } from "@/components/custom-tabs-list";
import { SubmissionsTable } from "@/components/admin/submissions-table";
import { TransitionLink } from "@/components/transition-link";

const ITEMS_PER_PAGE = 8;

function AdminSubmissionPaidDetailContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  
  // Get the ID from the pathname
  const id = pathname.split('/').pop();

  // For now, redirect back to list - this is a placeholder
  // The actual detail page logic would fetch a single submission by ID
  useEffect(() => {
    // You can implement the detail view logic here
  }, [id]);

  return (
    <div className="flex-1 space-y-6 container mx-auto px-4 md:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
        <div className="flex items-center gap-4">
          <TransitionLink href="/admin/submissions-paid">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </TransitionLink>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">
              Submission Details
            </h2>
            <p className="text-sm sm:text-md text-muted-foreground">
              View and manage this professional submission.
            </p>
          </div>
        </div>
      </div>

      {/* Content placeholder */}
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Loading submission details...</p>
          <p className="text-sm text-muted-foreground mt-2">Submission ID: {id}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminSubmissionPaidDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <AdminSubmissionPaidDetailContent />
    </Suspense>
  );
}
