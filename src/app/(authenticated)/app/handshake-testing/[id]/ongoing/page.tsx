"use client";

import { notFound } from "next/navigation";
import { useSingleHubAppDetails } from "@/hooks/useHub";
import { use } from "react";
import OngoingProjectView from "@/components/community-dashboard/ongoing-project-view";

export default function AppTestingOngoingPage({
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

  return (
    <OngoingProjectView
      appDetails={appDetails}
      isLoading={appDetailsIsPending}
      refetch={appDetailsRefetch}
      hubId={id}
    />
  );
}
