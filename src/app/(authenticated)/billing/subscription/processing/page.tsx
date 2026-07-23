"use client";

import React, { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import Spinner from "@/components/ui/spinner";
import { useSubscriptionStatus } from "@/hooks/useBilling";

function ProcessingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const subscriptionId = searchParams.get("subscriptionId");
  const [timedOut, setTimedOut] = useState(false);
  const startTime = useRef(Date.now());

  const { data, isError, error } = useSubscriptionStatus(
    subscriptionId,
    timedOut ? 10000 : 2000,
  );

  useEffect(() => {
    if (!data) return;
    const s = data.status;
    if (s === "ACTIVE" || s === "AUTHENTICATED") {
      const params = new URLSearchParams();
      params.set("subscriptionId", subscriptionId || "");
      if (data.latestInvoice?.invoice_number) {
        params.set("invoiceNumber", data.latestInvoice.invoice_number);
      }
      router.replace(`/billing/subscription/success?${params.toString()}`);
    }
  }, [data, subscriptionId, router]);

  const handleTryAgain = () => {
    router.replace("/billing");
  };

  const failed = data?.status === "CANCELLED" || data?.status === "HALTED";

  useEffect(() => {
    const timer = setInterval(() => {
      if (Date.now() - startTime.current > 60000) {
        setTimedOut(true);
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8"
      >
        {failed ? (
          <>
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-12 h-12 text-destructive" />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-black tracking-tight">
                Subscription Failed
              </h1>
              <p className="text-muted-foreground text-lg">
                Your subscription could not be activated. Please try again or contact support.
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <Button className="rounded-full" onClick={handleTryAgain}>
                Try Again
              </Button>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => (window.location.href = "mailto:intesters@nexmail.in")}
              >
                Contact Support
              </Button>
            </div>
            {subscriptionId && (
              <p className="text-xs text-muted-foreground font-mono">
                Subscription ID: {subscriptionId}
              </p>
            )}
          </>
        ) : !timedOut ? (
          <>
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-12 h-12 text-primary" />
                </motion.div>
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-black tracking-tight">
                Activating Your Subscription
              </h1>
              <p className="text-muted-foreground text-lg">
                Please wait while we confirm your subscription with Razorpay.
                This should only take a few seconds.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Spinner className="w-4 h-4" />
              <span>Verifying subscription...</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center">
                <Clock className="w-12 h-12 text-yellow-500" />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-black tracking-tight">
                Still Confirming
              </h1>
              <p className="text-muted-foreground text-lg">
                We are still confirming your subscription with your bank.
                You will receive a confirmation email shortly once it is fully activated.
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
                <div className="text-left text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">
                    What happens next?
                  </p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Your mandate has been submitted to Razorpay</li>
                    <li>We are waiting for the bank confirmation</li>
                    <li>Once confirmed, your subscription will be active and your first invoice generated</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                If you do not receive a confirmation email within 10 minutes,
                please contact our support team.
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => (window.location.href = "mailto:intesters@nexmail.in")}
                >
                  Contact Support
                </Button>
                <Button
                  className="rounded-full"
                  onClick={() => router.replace("/wallet")}
                >
                  Go to Wallet
                </Button>
              </div>
            </div>
            {subscriptionId && (
              <p className="text-xs text-muted-foreground font-mono">
                Subscription ID: {subscriptionId}
              </p>
            )}
          </>
        )}

        {isError && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6">
            <p className="text-destructive font-medium">
              {error?.message || "Unable to check subscription status"}
            </p>
            <Button
              variant="outline"
              className="mt-4 rounded-full"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function SubscriptionProcessingPage() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Subscription Processing"
        backHref="/billing"
        className="max-w-5xl mx-auto px-4"
      />
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        }
      >
        <ProcessingContent />
      </Suspense>
    </div>
  );
}
