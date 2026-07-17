"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Zap, Loader2, CheckCircle2, AlertCircle, Handshake } from "lucide-react";
import { ProfessionalPlanCard } from "@/components/pricing-cards";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import {
  createHandshakeSubscription,
  cancelHandshakeSubscription,
  getHandshakePlan,
  getHandshakeSubscriptionStatus,
  getMyHandshakeSubscription,
} from "@/lib/apiCalls";
import { PricingResponse } from "@/lib/types";
import { authClient } from "@/lib/auth-client";

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

export function HandshakePlanCard() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const isAuthed = !!session;

  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const { data: sub, isLoading } = useQuery({
    queryKey: ["myHandshakeSubscription"],
    queryFn: () => getMyHandshakeSubscription(),
    retry: false,
    enabled: isAuthed,
  });

  const { data: dbPlan } = useQuery<PricingResponse | null>({
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
        handler: async function (response: any) {
          try {
            await getHandshakeSubscriptionStatus(
              response?.razorpay_subscription_id || subscriptionId,
            );
          } catch {
            // best-effort sync; ignore failures
          }
          queryClient.invalidateQueries({ queryKey: ["myHandshakeSubscription"] });
          setProcessing(false);
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
        setError("Please add your billing information before subscribing.");
      } else {
        setError(e?.message || "Failed to start subscription. Please try again.");
      }
      setProcessing(false);
    }
  }, [queryClient]);

  const handleCancel = async () => {
    if (!sub?.id) return;
    setError(null);
    setCancelling(true);
    try {
      await cancelHandshakeSubscription(sub.id);
      queryClient.invalidateQueries({ queryKey: ["myHandshakeSubscription"] });
    } catch (e: any) {
      setError(e?.message || "Failed to cancel subscription.");
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
    actionButton = (
      <div className="w-full space-y-2">
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-white">
          <CheckCircle2 className="w-4 h-4" /> Subscription active
        </div>
        <HoverBorderGradient
          as="button"
          onClick={handleCancel}
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
    actionButton = (
      <HoverBorderGradient
        as="button"
        onClick={handleSubscribe}
        disabled={processing}
        containerClassName="w-full"
        className="bg-white text-emerald-600 flex justify-center items-center space-x-2 w-full py-4 font-bold cursor-pointer"
      >
        {processing ? (
          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
        ) : (
          <Zap className="w-4 h-4 mr-2 fill-current" />
        )}
        <span className="font-semibold">Subscribe for ₹99/month</span>
      </HoverBorderGradient>
    );
  }

  return (
    <ProfessionalPlanCard
      accent="emerald"
      accentIcon={<Handshake className="w-24 h-24 text-white" />}
      description="Monthly barter subscription ,  publish your app and test others in return."
      plan={{
        id: dbPlan?.id ?? "handshake",
        name: dbPlan?.name ?? "Handshake",
        price: dbPlan?.price ?? 99,
        package: dbPlan?.package ?? 1,
        features: dbPlan?.features ?? HANDSHAKE_FEATURES,
        billingType: dbPlan?.billingType ?? "SUBSCRIPTION",
        isActive: true,
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
  );
}
