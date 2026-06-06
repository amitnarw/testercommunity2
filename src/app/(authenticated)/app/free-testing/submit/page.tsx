"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { SubmissionForm } from "@/components/community-dashboard/submission-form";
import { SubmissionSuccess } from "@/components/community-dashboard/submission-success";
import { SubmissionError } from "@/components/community-dashboard/submission-error";
import { useAddHubApp } from "@/hooks/useHub";
import { ROUTES } from "@/lib/routes";

export default function SubmitAppPage() {
  const router = useRouter();
  const {
    mutate: addHubAppMutate,
    isPending: addHubAppIsPending,
    isSuccess: addHubAppIsSuccess,
    isError: addHubAppIsError,
    error: addHubAppError,
    reset: addHubAppReset,
  } = useAddHubApp();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = (data: any) => {
    addHubAppMutate(data);
  };

  if (!isMounted) {
    return null;
  }

  if (addHubAppIsSuccess) {
    return (
      <SubmissionSuccess
        onReturn={() => router.push(ROUTES.AUTHENTICATED.FREE_TESTING)}
        onSubmitAnother={() => {
          addHubAppReset();
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  if (addHubAppIsError) {
    return (
      <SubmissionError
        error={addHubAppError}
        onRetry={() => {
          addHubAppReset();
        }}
      />
    );
  }

  return (
    <div className="bg-brand-background min-h-screen">
      <PageHeader
        title="Submit"
        backHref={ROUTES.AUTHENTICATED.FREE_TESTING}
        className="w-1/2 px-5 sm:px-10"
      />

      <div className="mx-auto px-2 sm:px-5 py-5">
        <SubmissionForm
          onSubmit={onSubmit}
          isPending={addHubAppIsPending}
          isSuccess={addHubAppIsSuccess}
          isError={addHubAppIsError}
        />
      </div>
    </div>
  );
}
