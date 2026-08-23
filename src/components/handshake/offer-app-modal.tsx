"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SafeImage } from "@/components/safe-image";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useHubSubmittedApp } from "@/hooks/useHub";
import { useSendHandshakeRequest } from "@/hooks/useHandshakeRequests";
import { HandshakeCelebrationModal } from "./handshake-celebration-modal";
import { cn } from "@/lib/utils";
import { Check, AlertCircle, Loader2, Clock } from "lucide-react";

interface OfferAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Target campaign (dashboard_and_hub) id the user wants to test. */
  hubId: string;
  hubAppName?: string;
  /** Owner of the target campaign ,  required by the v2 handshake request API. */
  hubOwnerId?: string;
  /** Owner display name ,  used in the mutual-match celebration copy. */
  hubOwnerName?: string;
  onSuccess: () => void;
}

export function OfferAppModal({
  open,
  onOpenChange,
  hubId,
  hubAppName,
  hubOwnerId,
  hubOwnerName,
  onSuccess,
}: OfferAppModalProps) {
  const router = useRouter();
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Reset selection AND any stale mutation error whenever the modal closes
  // so neither leaks into a subsequent open for a different app.
  useEffect(() => {
    if (!open) {
      setSelectedAppId(null);
      if (sendMutation.isError) sendMutation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const { data: myApps, isPending: myAppsPending } = useHubSubmittedApp({
    type: "AVAILABLE",
    options: { enabled: open },
  });

  const eligibleApps = (myApps || []).filter(
    (app) => app.appType === "HANDSHAKE" && app.id.toString() !== hubId,
  );

  const sendMutation = useSendHandshakeRequest({
    onSuccess: (response) => {
      onOpenChange(false);
      onSuccess();
      if (response?.mutualMatch) {
        setShowCelebration(true);
      }
    },
  });

  const handleConfirm = () => {
    if (!selectedAppId || !hubOwnerId) return;
    sendMutation.mutate({
      toUserId: hubOwnerId,
      requestedAppId: Number(hubId),
      offeredAppId: selectedAppId,
      message: null,
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[520px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Offer one of your apps</DialogTitle>
          </DialogHeader>

          {myAppsPending ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
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
                onClick={() => router.push(ROUTES.AUTHENTICATED.HANDSHAKE_SUBMIT)}
              >
                Publish a Handshake app
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Choose one of your published Handshake apps to offer{" "}
                {hubAppName ? <strong>{hubAppName}</strong> : "this app"} in
                return. If they reciprocate, the handshake is automatic.
              </p>

              {sendMutation.isError && (
                <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <p className="text-sm text-red-600">
                    {sendMutation.error?.message ||
                      "Failed to send handshake request."}
                  </p>
                </div>
              )}

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

              <div className="flex items-start gap-2 rounded-lg bg-secondary/40 p-3 text-xs text-muted-foreground">
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>
                  Your request expires in 7 days if not responded to. Mutual
                  requests auto-connect instantly.
                </p>
              </div>

              <Button
                className="w-full"
                disabled={!selectedAppId || !hubOwnerId || sendMutation.isPending}
                onClick={handleConfirm}
              >
                {sendMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : null}
                Send request
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <HandshakeCelebrationModal
        open={showCelebration}
        onOpenChange={setShowCelebration}
        partnerAppName={hubAppName}
        partnerName={hubOwnerName}
        onContinue={() => router.push(ROUTES.AUTHENTICATED.HANDSHAKE_TESTING)}
      />
    </>
  );
}
