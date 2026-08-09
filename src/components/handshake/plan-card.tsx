"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Zap, Loader2, CheckCircle2, AlertCircle, AlertTriangle, XCircle, Handshake, Calendar } from "lucide-react";
import { ProfessionalPlanCard } from "@/components/pricing-cards";
import { Button } from "@/components/ui/button";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  createHandshakeSubscription,
  cancelHandshakeSubscription,
  getHandshakePlan,
  getHandshakeSubscriptionStatus,
  getMyHandshakeSubscription,
} from "@/lib/apiCalls";
import { PricingResponse } from "@/lib/types";
import { authClient } from "@/lib/auth-client";
import { ROUTES } from "@/lib/routes";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const HANDSHAKE_FEATURES = [
  "Publish and join handshake tests",
  "Gamified levels with more test slots",
  "No per-tester points required",
  "Barter-based, you test theirs, they test yours",
];

export function HandshakePlanCard({
  mode = "redirect",
  onSubscribeError,
  onCheckoutRequired,
  redirectHref,
  redirectLabel,
}: {
  mode?: "billing" | "redirect";
  onSubscribeError?: (error: any) => void;
  onCheckoutRequired?: () => void;
  redirectHref?: string;
  redirectLabel?: string | null;
}) {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const isAuthed = !!session;

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const { data: sub, isLoading } = useQuery({
    queryKey: ["myHandshakeSubscription"],
    queryFn: () => getMyHandshakeSubscription(),
    retry: false,
    enabled: isAuthed,
  });

  const { data: dbPlan, isPending: planPending } = useQuery<PricingResponse | null>({
    queryKey: ["handshakePlan"],
    queryFn: () => getHandshakePlan(),
    retry: false,
  });

  const hasActiveSubscription =
    !!sub && (sub.status === "ACTIVE" || sub.status === "AUTHENTICATED");

  const handleSubscribe = useCallback(async () => {
    setError(null);
    setProcessing(true);
    try {
      const data: any = await createHandshakeSubscription();
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError("Could not load the payment gateway. Please try again.");
        setProcessing(false);
        return;
      }
      const subscriptionId = data.razorpaySubscriptionId || data.subscriptionId;
      const options = {
        key: data.razorpayKeyId,
        subscription_id: subscriptionId,
        name: "inTesters",
        description: "Handshake Testing Subscription",
        handler: function (response: any) {
          const sid = response?.razorpay_subscription_id || subscriptionId;
          router.push(`/billing/subscription/processing?subscriptionId=${sid}`);
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          },
        },
        prefill: {},
        theme: { color: "#059669" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e: any) {
      if (e?.billingInfoMissing) {
        if (onCheckoutRequired) {
          onCheckoutRequired();
        } else {
          setError("Please add your billing information before subscribing.");
        }
      } else if (onSubscribeError) {
        onSubscribeError(e);
      } else {
        setError(e?.message || "Failed to start subscription. Please try again.");
      }
      setProcessing(false);
    }
  }, [router, onCheckoutRequired, onSubscribeError]);

  const handleCancel = async () => {
    if (!sub?.id) return;
    setError(null);
    setCancelError(null);
    setCancelling(true);
    try {
      await cancelHandshakeSubscription(sub.id);
      queryClient.invalidateQueries({ queryKey: ["myHandshakeSubscription"] });
      setShowCancelDialog(false);
    } catch (e: any) {
      setCancelError(e?.message || "Failed to cancel subscription.");
    } finally {
      setCancelling(false);
    }
  };

  let actionButton: React.ReactNode;

  if (!isAuthed) {
    actionButton = (
      <Link href="/auth/login" className="flex items-center justify-center w-full">
        <HoverBorderGradient
          as="div"
          containerClassName="w-full"
          className="bg-white text-emerald-600 flex justify-center items-center space-x-2 w-full py-4 font-bold cursor-pointer"
        >
          <Zap className="w-4 h-4 mr-2 fill-current" />
          <span className="font-semibold">Get Started</span>
        </HoverBorderGradient>
      </Link>
    );
  } else if (isLoading) {
    actionButton = (
      <HoverBorderGradient
        as="button"
        disabled
        containerClassName="w-full"
        className="bg-white text-emerald-600 flex justify-center items-center space-x-2 w-full py-4 font-bold cursor-pointer"
      >
        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading…
      </HoverBorderGradient>
    );
  } else if (hasActiveSubscription) {
    const renewalDate = sub?.currentPeriodEnd
      ? new Date(sub.currentPeriodEnd).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
      : null;
    actionButton = (
      <div className="w-full space-y-2">
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-white">
          <CheckCircle2 className="w-4 h-4" /> Subscription active
        </div>
        {renewalDate && (
          <div className="flex items-center justify-center gap-2 text-xs text-white/70">
            <Calendar className="w-3 h-3" /> Renews on {renewalDate}
          </div>
        )}
        <HoverBorderGradient
          as="button"
          onClick={() => setShowCancelDialog(true)}
          disabled={cancelling}
          containerClassName="w-full"
          className="bg-white text-emerald-600 flex justify-center items-center space-x-2 w-full py-4 font-bold cursor-pointer"
        >
          {cancelling ? (
            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
          ) : null}
          Cancel subscription
        </HoverBorderGradient>
      </div>
    );
  } else {
    actionButton = null;
  }

  if (!planPending && !dbPlan) {
    return null;
  }

  if (mode === "redirect") {
    return (
      <ProfessionalPlanCard
        accent={dbPlan?.accent ?? "emerald"}
        accentIcon={<Handshake className="w-24 h-24 text-white" />}
        description={dbPlan?.description}
        customPriceLabel={dbPlan?.customPriceLabel}
        plan={{
          id: dbPlan?.id ?? "handshake",
          name: dbPlan?.name ?? "Handshake",
          price: dbPlan?.price ?? 99,
          package: dbPlan?.package ?? 1,
          features: dbPlan?.features ?? HANDSHAKE_FEATURES,
          badgeText: dbPlan?.badgeText,
          gradientFrom: dbPlan?.gradientFrom,
          gradientTo: dbPlan?.gradientTo,
          isPopular: dbPlan?.isPopular,
          billingType: dbPlan?.billingType ?? "SUBSCRIPTION",
          customPriceSuffix: dbPlan?.customPriceSuffix,
          isActive: dbPlan?.isActive ?? true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }}
        actionButton={
          <div className="w-full">
            <Link
              href={redirectHref ?? ROUTES.PUBLIC.PRICING}
              className="w-full block"
            >
              <HoverBorderGradient
                as="div"
                containerClassName="w-full"
                className="bg-white text-emerald-600 flex justify-center items-center space-x-2 w-full py-4 font-bold cursor-pointer"
              >
                <Zap className="w-4 h-4 mr-2 fill-current" />
                <span className="font-semibold">{redirectLabel ?? "Get Started"}</span>
              </HoverBorderGradient>
            </Link>
          </div>
        }
      />
    );
  }

  return (
    <>
      <ProfessionalPlanCard
        accent={dbPlan?.accent ?? "emerald"}
        accentIcon={<Handshake className="w-24 h-24 text-white" />}
        description={dbPlan?.description}
        customPriceLabel={dbPlan?.customPriceLabel}
        plan={{
          id: dbPlan?.id ?? "handshake",
          name: dbPlan?.name ?? "Handshake",
          price: dbPlan?.price ?? 99,
          package: dbPlan?.package ?? 1,
          features: dbPlan?.features ?? HANDSHAKE_FEATURES,
          badgeText: dbPlan?.badgeText,
          gradientFrom: dbPlan?.gradientFrom,
          gradientTo: dbPlan?.gradientTo,
          isPopular: dbPlan?.isPopular,
          billingType: dbPlan?.billingType ?? "SUBSCRIPTION",
          customPriceSuffix: dbPlan?.customPriceSuffix,
          isActive: dbPlan?.isActive ?? true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }}
        actionButton={
          <div className="w-full">
            {actionButton}
            {error && (
              <p className="mt-3 flex items-center gap-2 text-sm text-white">
                <AlertCircle className="w-4 h-4" /> {error}
              </p>
            )}
          </div>
        }
      />
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Cancel Subscription
            </DialogTitle>
            <DialogDescription className="pt-2 space-y-3">
              <p>
                Are you sure you want to cancel your Handshake Testing subscription?
              </p>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm">
                <p className="font-medium text-amber-700 dark:text-amber-400 mb-1">
                  What happens when you cancel?
                </p>
                <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                  <li>Your subscription will not renew</li>
                  <li>You keep access until the end of the current billing period</li>
                  <li>Your published apps and ongoing tests remain accessible</li>
                  <li>You can resubscribe anytime</li>
                </ul>
              </div>
              {cancelError && (
                <p className="text-sm text-red-500">{cancelError}</p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setShowCancelDialog(false);
                setCancelError(null);
              }}
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Yes, Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
