"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/back-button";
import { useSingleHubAppDetails } from "@/hooks/useHub";
import { PremiumSubmissionView } from "@/components/admin/premium-submission-view";

export default function AdminSubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: project, isLoading, error } = useSingleHubAppDetails({ id });

  if (isLoading) {
    return (
      <div className="bg-slate-50 dark:bg-[#0B0F15] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          <div className="animate-pulse text-lg font-medium text-muted-foreground">
            Loading App Details...
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="bg-slate-50 dark:bg-[#0B0F15] min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            App Not Found
          </h2>
          <p className="text-muted-foreground">
            The requested application details could not be loaded.
          </p>
          <BackButton href="/admin/submissions-paid" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-6 left-6 z-50">
        <BackButton href="/admin/submissions-paid" />
      </div>
      <PremiumSubmissionView project={project} />
    </div>
  );
}
