"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SafeImage } from "@/components/safe-image";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { useHubSubmittedApp } from "@/hooks/useHub";
import { useSendHandshakeRequest } from "@/hooks/useHandshakeRequests";
import { HandshakeCelebrationModal } from "./handshake-celebration-modal";
import { cn } from "@/lib/utils";
import { Check, AlertCircle, Loader2, Clock } from "lucide-react";

interface SendHandshakeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetAppId: number;
  targetAppName: string;
  targetOwnerId: string;
  targetOwnerName?: string;
  onSuccess?: () => void;
}

export function SendHandshakeModal({
  open,
  onOpenChange,
  targetAppId,
  targetAppName,
  targetOwnerId,
  targetOwnerName,
  onSuccess,
}: SendHandshakeModalProps) {
  const router = useRouter();
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{
    partnerName?: string;
    partnerAppName?: string;
  }>({});

  // H-F3 (S4e-7): reset selection + message whenever the modal closes so
  // stale state never leaks into a subsequent open for a different app.
  useEffect(() => {
    if (!open) {
      setSelectedAppId(null);
      setMessage("");
    }
  }, [open]);

  const { data: myApps, isPending: myAppsPending } = useHubSubmittedApp({
    type: "AVAILABLE",
    options: { enabled: open },
  });

  const eligibleApps = (myApps || []).filter(
    (app) => app.appType === "HANDSHAKE" && app.id !== targetAppId,
  );

  const sendMutation = useSendHandshakeRequest({
    onSuccess: (response) => {
      onOpenChange(false);
      onSuccess?.();
      if (response?.mutualMatch) {
        setCelebrationData({
          partnerName: targetOwnerName,
          partnerAppName: targetAppName,
        });
        setShowCelebration(true);
      }
    },
  });
  const { mutate, isPending, isError, error } = sendMutation;

  const handleConfirm = () => {
    if (!selectedAppId) return;
    mutate({
      toUserId: targetOwnerId,
      requestedAppId: targetAppId,
      offeredAppId: selectedAppId,
      message: message.trim() || null,
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[560px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Send a Handshake request</DialogTitle>
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
                onClick={() => {
                  onOpenChange(false);
                  router.push(ROUTES.AUTHENTICATED.HANDSHAKE_SUBMIT);
                }}
              >
                Publish a Handshake app
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Choose one of your published Handshake apps to offer{" "}
                <strong>{targetAppName}</strong> in return. If they reciprocate,
                both of you join each other&apos;s tests automatically.
              </p>

              {isError && (
                <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <p className="text-sm text-red-600">
                    {error?.message || "Failed to send handshake request."}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                  Your Handshake apps
                </p>
                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
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
                            ? "border-emerald-500/40 bg-emerald-500/10"
                            : "border-border/60 bg-secondary/30 hover:border-emerald-500/30",
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
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                  Message (optional)
                </p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 280))}
                  rows={3}
                  placeholder="Hi! I'd love to test your app..."
                  className="w-full rounded-xl border border-border/60 bg-secondary/30 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
                <p className="text-[10px] text-muted-foreground text-right mt-1">
                  {message.length}/280
                </p>
              </div>

              <div className="flex items-start gap-2 rounded-lg bg-secondary/40 p-3 text-xs text-muted-foreground">
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>
                  Your request expires in 7 days if not responded to. If both
                  sides accept, the handshake is automatic.
                </p>
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

      <HandshakeCelebrationModal
        open={showCelebration}
        onOpenChange={setShowCelebration}
        partnerAppName={celebrationData.partnerAppName}
        partnerName={celebrationData.partnerName}
        onContinue={() => router.push(ROUTES.AUTHENTICATED.HANDSHAKE_TESTING)}
      />
    </>
  );
}
