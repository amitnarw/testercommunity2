"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SafeImage } from "@/components/safe-image";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useHubSubmittedApp, useAddHubAppTestingRequest } from "@/hooks/useHub";
import { getMyHandshakeSubscription } from "@/lib/apiCalls";
import { cn } from "@/lib/utils";
import { Check, AlertCircle, ArrowRight, Loader2 } from "lucide-react";

interface OfferAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hubId: string;
  hubAppName?: string;
  onSuccess: () => void;
}

export function OfferAppModal({
  open,
  onOpenChange,
  hubId,
  hubAppName,
  onSuccess,
}: OfferAppModalProps) {
  const router = useRouter();
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);

  const { data: myApps, isPending: myAppsPending } = useHubSubmittedApp({
    type: "AVAILABLE",
    options: { enabled: open },
  });

  const { data: sub, isLoading: subLoading } = useQuery({
    queryKey: ["myHandshakeSubscription"],
    queryFn: () => getMyHandshakeSubscription(),
    enabled: open,
    retry: false,
  });

  const hasActiveSubscription =
    !!sub && (sub.status === "ACTIVE" || sub.status === "AUTHENTICATED");

  const eligibleApps = (myApps || []).filter(
    (app) => app.appType === "HANDSHAKE" && app.id.toString() !== hubId,
  );

  const { mutate, isPending } = useAddHubAppTestingRequest({
    onSuccess: () => {
      onOpenChange(false);
      onSuccess();
    },
  });

  const handleConfirm = () => {
    if (!selectedAppId) return;
    mutate({ hub_id: hubId, offered_app_id: selectedAppId });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Offer one of your apps</DialogTitle>
        </DialogHeader>

        {subLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        ) : !hasActiveSubscription ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                A Handshake subscription is required to send a request. Subscribe
                for ₹99/month to test and be tested.
              </p>
            </div>
            <Button
              className="w-full"
              onClick={() => router.push("/pricing")}
            >
              Subscribe <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        ) : eligibleApps.length === 0 ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-secondary/40 p-4">
              <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
              <p className="text-sm text-muted-foreground">
                You need to publish a Handshake app before you can request to
                test others. Publish one and offer it in return.
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push(ROUTES.AUTHENTICATED.HANDSHAKE_TESTING + "/submit")}
            >
              Publish a Handshake app
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Choose one of your published Handshake apps to offer{" "}
              {hubAppName ? <strong>{hubAppName}</strong> : "this app"} in
              return. Both of you will join each other&apos;s tests.
            </p>
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {eligibleApps.map((app) => {
                const isSelected = selectedAppId === app.id;
                return (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setSelectedAppId(app.id)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-all",
                      isSelected
                        ? "border-emerald-500/30 bg-emerald-500/10"
                        : "border-border/60 bg-secondary/30 hover:border-emerald-500/40",
                    )}
                  >
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                      {app.androidApp?.appLogoUrl && (
                        <SafeImage
                          src={app.androidApp.appLogoUrl}
                          alt={app.androidApp.appName || "App"}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {app.androidApp?.appName || "Untitled app"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {app.currentTester || 0}/{app.totalTester} testers
                      </p>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
            <Button
              className="w-full"
              disabled={!selectedAppId || isPending}
              onClick={handleConfirm}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : null}
              Send request
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
