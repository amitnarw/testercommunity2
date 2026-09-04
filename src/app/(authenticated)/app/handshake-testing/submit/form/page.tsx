"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { StepIndicator } from "@/components/ui/step-indicator";
import { SubmissionForm } from "@/components/community-dashboard/submission-form";
import { FeedbackModal } from "@/components/feedback-modal";
import { useAddHubApp } from "@/hooks/useHub";
import { ROUTES } from "@/lib/routes";
import {
  CheckCircle2,
  Clock,
  Users,
  ShieldCheck,
  ArrowRight,
  Handshake as HandshakeIcon,
  Sparkles,
  FileText,
} from "lucide-react";

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
  const [step, setStep] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [feedbackModal, setFeedbackModal] = useState<{
    open: boolean;
    status: "success" | "error";
    title: string;
    description?: string;
    primaryAction?: { label: string; onClick: () => void };
    secondaryAction?: { label: string; onClick: () => void };
  }>({ open: false, status: "error", title: "", description: "" });

  const handleFormSubmit = (data: any) => {
    addHubAppMutate(data);
  };

  // React to mutation outcomes
  useEffect(() => {
    if (addHubAppIsSuccess) {
      setFeedbackModal({
        open: true,
        status: "success",
        title: "App Submitted!",
        description:
          "Your app has been published for Handshake Testing. Testers can now discover and request to test it.",
        primaryAction: {
          label: "View Hub",
          onClick: () => {
            router.push(ROUTES.AUTHENTICATED.HANDSHAKE_TESTING);
            setFeedbackModal((prev) => ({ ...prev, open: false }));
          },
        },
        secondaryAction: {
          label: "Submit Another",
          onClick: () => {
            setFeedbackModal((prev) => ({ ...prev, open: false }));
            addHubAppReset();
            if (typeof window !== "undefined") window.scrollTo(0, 0);
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addHubAppIsSuccess]);

  useEffect(() => {
    if (addHubAppIsError) {
      setFeedbackModal({
        open: true,
        status: "error",
        title: "Submission Failed",
        description:
          (addHubAppError as Error)?.message ||
          "Something went wrong while submitting your app. Please check your details and try again.",
        primaryAction: {
          label: "OK",
          onClick: () => {
            setFeedbackModal((prev) => ({ ...prev, open: false }));
            addHubAppReset();
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addHubAppIsError]);

  if (!isMounted) {
    return <div className="min-h-screen bg-brand-background" />;
  }

  return (
    <div className="min-h-screen bg-brand-background max-w-6xl mx-auto px-4 md:px-6 pb-16">
      <PageHeader
        title=""
        backHref={ROUTES.AUTHENTICATED.HANDSHAKE_SUBMIT}
        className="w-1/2"
      />

      {/* Animated Background Elements (emerald-themed) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-to-tr from-emerald-500/15 via-green-500/10 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-20 right-1/4 w-72 h-72 bg-gradient-to-tl from-teal-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s", animationDuration: "5s" }}
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Page-level Hero Header (above the grid so sidebar aligns with form) */}
        <header className="mb-10 sm:mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-foreground via-foreground to-muted-foreground/60 bg-clip-text text-transparent pb-1 leading-tight tracking-tight">
            Submit Your App for Handshake Testing
          </h1>
          <p className="text-muted-foreground text-md sm:text-lg leading-relaxed">
            Fill in your app details to start handshake testing with our
            community.
          </p>

          <StepIndicator
            steps={["Connect", "Describe", "Configure"]}
            currentStep={step}
            variant="emerald"
            className="mt-6 sm:mt-8"
          />
        </header>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main Form - Left Side */}
          <div className="lg:col-span-3">
            <SubmissionForm
              onSubmit={handleFormSubmit}
              isPending={addHubAppIsPending}
              isSuccess={addHubAppIsSuccess}
              isError={addHubAppIsError}
              showHeader={false}
              step={step}
              setStep={setStep}
            />
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Submission Summary Card */}
            <Card className="rounded-2xl bg-gradient-to-br from-card via-card to-secondary/20 backdrop-blur-md border-border/40 shadow-2xl shadow-black/10 overflow-hidden sticky top-6">
              {/* Decorative top gradient */}
              <div className="h-24 bg-gradient-to-br from-emerald-500/15 via-emerald-500/0 to-transparent relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent" />
                <div
                  className="absolute top-4 right-4 w-16 h-16 rounded-full bg-emerald-500/20 blur-xl animate-pulse"
                  style={{ animationDuration: "3s" }}
                />
                <div
                  className="absolute top-8 right-12 w-8 h-8 rounded-full bg-emerald-500/30 blur-lg animate-pulse"
                  style={{ animationDuration: "2s", animationDelay: "0.5s" }}
                />
              </div>

              <div className="p-6 sm:p-8 -mt-20 relative">
                {/* Submission Summary */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-bold text-foreground uppercase tracking-wider">
                      Submission Summary
                    </h3>
                  </div>

                  <div className="p-5 rounded-2xl bg-gradient-to-br from-secondary/60 via-secondary/40 to-secondary/20 border border-border/50 backdrop-blur-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Testing Type
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                        <HandshakeIcon className="w-3.5 h-3.5" />
                        Handshake (Barter)
                      </span>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Cost
                      </span>
                      <span className="font-semibold text-foreground">
                        Free Forever
                      </span>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">Total Cost</span>
                      <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          Free
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Fixed Setup Info */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-teal-500/5 border border-emerald-500/20 relative overflow-hidden">
                    <div className="absolute top-2 right-2 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl" />
                    <div className="flex justify-between items-center relative">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1.5 font-medium uppercase tracking-wide">
                          Fixed Setup
                        </p>
                        <p className="text-lg font-bold tracking-tight text-foreground">
                          Auto-configured
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          No configuration required
                        </p>
                      </div>
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 shadow-emerald-500/20 transition-transform duration-300 hover:scale-105">
                        <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compact Handshake Stats */}
                <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-border/40">
                  <div className="flex items-center gap-2 sm:gap-2.5 mb-3 sm:mb-4">
                    <span className="text-xs sm:text-sm font-bold tracking-tight">
                      How Handshake Works
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    <div className="group/stat flex flex-col items-center text-center p-2 sm:p-3 rounded-xl bg-gradient-to-br from-secondary/60 to-secondary/30 border border-border/30 transition-all duration-300 hover:border-emerald-500/20 hover:shadow-md cursor-default">
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 mb-1 sm:mb-1.5 transition-transform duration-300 group-hover/stat:scale-110" />
                      <span className="text-[10px] sm:text-xs font-bold">
                        14
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-muted-foreground">
                        Testers
                      </span>
                    </div>
                    <div className="group/stat flex flex-col items-center text-center p-2 sm:p-3 rounded-xl bg-gradient-to-br from-secondary/60 to-secondary/30 border border-border/30 transition-all duration-300 hover:border-emerald-500/20 hover:shadow-md cursor-default">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 mb-1 sm:mb-1.5 transition-transform duration-300 group-hover/stat:scale-110" />
                      <span className="text-[10px] sm:text-xs font-bold">
                        16
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-muted-foreground">
                        Days
                      </span>
                    </div>
                    <div className="group/stat flex flex-col items-center text-center p-2 sm:p-3 rounded-xl bg-gradient-to-br from-secondary/60 to-secondary/30 border border-border/30 transition-all duration-300 hover:border-emerald-500/20 hover:shadow-md cursor-default">
                      <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 mb-1 sm:mb-1.5 transition-transform duration-300 group-hover/stat:scale-110" />
                      <span className="text-[10px] sm:text-xs font-bold">
                        100%
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-muted-foreground">
                        Barter
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trust Badge */}
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 text-xs text-muted-foreground px-4 py-2 rounded-full bg-secondary/30 border border-border/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="font-medium">
                      No Subscription Required
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <FeedbackModal
        open={feedbackModal.open}
        onOpenChange={(open) => setFeedbackModal((prev) => ({ ...prev, open }))}
        status={feedbackModal.status}
        title={feedbackModal.title}
        description={feedbackModal.description}
        primaryAction={feedbackModal.primaryAction}
        secondaryAction={feedbackModal.secondaryAction}
      />
    </div>
  );
}
