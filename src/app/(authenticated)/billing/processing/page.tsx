"use client";

import React, { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ROUTES } from "@/lib/routes";
import { Loader2, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import Spinner from "@/components/ui/spinner";
import { useOrderStatus } from "@/hooks/useBilling";

function ProcessingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [timedOut, setTimedOut] = useState(false);
  const startTime = useRef(Date.now());

  const { data, isError, error } = useOrderStatus(orderId, timedOut ? 10000 : 2000);

  useEffect(() => {
    if (!data) return;

    if (data.status === "PAID") {
      const params = new URLSearchParams();
      params.set("orderId", orderId || "");
      if (data.invoiceId) params.set("invoiceId", data.invoiceId);
      if (data.paymentId) params.set("paymentId", String(data.paymentId));
      router.replace(`/billing/success?${params.toString()}`);
    }
  }, [data, orderId, router]);

  const handleTryAgain = () => {
    router.replace(ROUTES.AUTHENTICATED.BILLING);
  };

  const failed = data?.status === "FAILED";

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
                Payment Failed
              </h1>
              <p className="text-muted-foreground text-lg">
                Your payment could not be processed. Please try again or contact support.
              </p>
            </div>

            {data?.errorReason && (
              <div className="bg-card border border-border rounded-2xl p-4 text-left text-sm">
                <p className="font-medium text-foreground mb-1">Reason:</p>
                <p className="text-muted-foreground">{data.errorReason}</p>
              </div>
            )}

            <div className="flex justify-center gap-3">
              <Button
                className="rounded-full"
                onClick={handleTryAgain}
              >
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

            {orderId && (
              <p className="text-xs text-muted-foreground font-mono">
                Order ID: {orderId}
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
                Processing Your Payment
              </h1>
              <p className="text-muted-foreground text-lg">
                Please wait while we confirm your payment with Razorpay.
                This should only take a few seconds.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Spinner className="w-4 h-4" />
              <span>Verifying payment...</span>
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
                We are still confirming your payment with your bank.
                You will receive an email receipt shortly once the payment is fully processed.
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
                    <li>Your payment has been received by Razorpay</li>
                    <li>We are waiting for the final confirmation from your bank</li>
                    <li>Once confirmed, your packages will be credited and you will receive an email</li>
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
                  onClick={() => router.replace(ROUTES.AUTHENTICATED.WALLET)}
                >
                  Go to Wallet
                </Button>
              </div>
            </div>

            {orderId && (
              <p className="text-xs text-muted-foreground font-mono">
                Order ID: {orderId}
              </p>
            )}
          </>
        )}

        {isError && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6">
            <p className="text-destructive font-medium">
              {error?.message || "Unable to check payment status"}
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

export default function PaymentProcessingPage() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Payment Processing"
        backHref={ROUTES.AUTHENTICATED.BILLING}
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
