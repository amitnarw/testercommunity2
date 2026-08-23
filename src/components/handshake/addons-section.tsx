"use client";

import { useEffect, useState } from "react";
import { Sparkles, ShieldCheck, Layers, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAddonCatalog, usePurchaseAddon } from "@/hooks/useAddons";
import { useToast } from "@/hooks/use-toast";

interface AddonsSectionProps {
  campaignId: number;
}

const CATEGORY_LABELS = {
  PROFESSIONAL_TESTER: { label: "Professional Tester", icon: ShieldCheck },
  PRIORITY_SUPPORT: { label: "Priority Support", icon: Sparkles },
  EXTRA_TESTING: { label: "Extra Testing", icon: Layers },
} as const;

declare global {
  interface Window {
    Razorpay: any;
  }
}

/**
 * P3.2: guarantee the Razorpay checkout SDK is present. It used to be loaded
 * only on /billing (lazyOnload), so the Buy button failed with
 * "Payment system not ready" whenever a user landed here first ,  which is
 * ALWAYS the case for penalized users routed to the add-ons-only view.
 */
function useRazorpayScript() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.Razorpay) {
      setReady(true);
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );
    const script =
      existing ??
      Object.assign(document.createElement("script"), {
        src: "https://checkout.razorpay.com/v1/checkout.js",
        async: true,
      });
    if (!existing) document.head.appendChild(script);
    const onLoad = () => setReady(!!window.Razorpay);
    script.addEventListener("load", onLoad);
    script.addEventListener("error", onLoad);
    return () => {
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onLoad);
    };
  }, []);

  return ready;
}

export function AddonsSection({ campaignId }: AddonsSectionProps) {
  const { data: catalog, isLoading } = useAddonCatalog();
  const purchaseMutation = usePurchaseAddon();
  const razorpayReady = useRazorpayScript();
  const { toast } = useToast();

  const handlePurchase = async (addOnId: number) => {
    try {
      if (typeof window === "undefined" || !window.Razorpay) {
        toast({
          title: "Payment system not ready",
          description: "Razorpay SDK not loaded. Please try again in a moment.",
          variant: "destructive",
        });
        return;
      }

      const order = await purchaseMutation.mutateAsync({ addOnId, campaignId });

      const options = {
        key: order.razorpayKeyId,
        amount: order.amountINR * 100,
        currency: "INR",
        name: "inTesters",
        description: order.addOnName,
        order_id: order.razorpayOrderId,
        handler: function () {
          toast({
            title: "Payment successful",
            description: `${order.addOnName} has been added to your campaign.`,
          });
        },
        modal: {
          ondismiss: function () {
            toast({
              title: "Payment cancelled",
              description: "You cancelled the payment. No charges made.",
            });
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast({
        title: "Purchase failed",
        description: msg,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (!catalog || catalog.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
        No add-ons available at the moment.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {catalog.map((addOn) => {
        const meta = CATEGORY_LABELS[addOn.category];
        const Icon = meta?.icon ?? Sparkles;
        return (
          <Card key={addOn.id} className="hover:border-emerald-500/40 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{addOn.name}</h4>
                  {meta && (
                    <Badge variant="outline" className="mt-1 text-[10px]">
                      {meta.label}
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {addOn.description}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">₹{addOn.priceINR}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handlePurchase(addOn.id)}
                  disabled={purchaseMutation.isPending || !razorpayReady}
                >
                  {purchaseMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : !razorpayReady ? (
                    "Loading payment..."
                  ) : (
                    "Buy"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
