"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { SubmissionForm } from "@/components/community-dashboard/submission-form";
import { SubmissionSuccess } from "@/components/community-dashboard/submission-success";
import { SubmissionError } from "@/components/community-dashboard/submission-error";
import { useAddHubApp } from "@/hooks/useHub";
import { ROUTES } from "@/lib/routes";

export default function SubmitAppFormPage() {
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
    return (
      <div className="min-h-screen flex items-center justify-center" />
    );
  }

  if (addHubAppIsSuccess) {
    return (
      <SubmissionSuccess
        onReturn={() => router.push(ROUTES.AUTHENTICATED.HANDSHAKE_TESTING)}
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
    <div className="min-h-screen bg-brand-background max-w-6xl mx-auto px-4 md:px-6 pb-16">
      <PageHeader
        title=""
        backHref={ROUTES.AUTHENTICATED.HANDSHAKE_SUBMIT}
        className="w-1/2"
      />

      <div className="relative z-10">
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
