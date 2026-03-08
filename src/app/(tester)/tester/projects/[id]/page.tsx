"use client";

import { notFound } from "next/navigation";
import { useSingleHubAppDetails } from "@/hooks/useHub";
import { use } from "react";
import OngoingProjectView from "@/components/community-dashboard/ongoing-project-view";
import { Loader2 } from "lucide-react";

export default function ProfessionalProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const {
    data: appDetails,
    isPending: appDetailsIsPending,
    refetch: appDetailsRefetch,
  } = useSingleHubAppDetails({ id });

  if (!id) {
    notFound();
  }

  if (appDetailsIsPending) {
    return (
      <div className="flex bg-[#f8fafc] dark:bg-[#0f151e] min-h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!appDetails) {
    notFound();
  }

  return (
    <OngoingProjectView
      appDetails={appDetails}
      isLoading={appDetailsIsPending}
      refetch={appDetailsRefetch}
      hubId={id}
      showBackButton={true}
    />
  );
}
