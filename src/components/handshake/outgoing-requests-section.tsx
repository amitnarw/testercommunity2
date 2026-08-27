"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Clock, Check, X, ChevronRight, History } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SafeImage } from "@/components/safe-image";
import { authClient } from "@/lib/auth-client";
import { useCancelHandshakeRequest } from "@/hooks/useHandshakeRequests";
import { useToast } from "@/hooks/use-toast";
import type { HandshakeRequest, HandshakeRequestStatus } from "@/lib/types";

interface OutgoingRequestsSectionProps {
  items: HandshakeRequest[];
  isLoading: boolean;
  showHistory: boolean;
  onToggleHistory: () => void;
}

// S12: only PENDING is an active request. ACCEPTED/MUTUAL_MATCHED move to the
// collapsed history , the live handshake itself is shown in the Running tab,
// so duplicating it here was stale noise.
const ACTIVE_STATUSES = new Set<HandshakeRequestStatus>(["PENDING"]);

const STATUS_STYLES: Partial<Record<HandshakeRequestStatus, { label: string; className: string }>> = {
  PENDING: { label: "Pending", className: "bg-amber-500/15 text-amber-600 border-amber-500/20" },
  ACCEPTED: { label: "Accepted", className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20" },
  MUTUAL_MATCHED: { label: "Mutual Match", className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20" },
  REJECTED: { label: "Rejected", className: "bg-red-500/15 text-red-600 border-red-500/20" },
  EXPIRED: { label: "Expired", className: "bg-muted text-muted-foreground border-border/60" },
  CANCELLED: { label: "Cancelled", className: "bg-muted text-muted-foreground border-border/60" },
};

const STATUS_FALLBACK = { label: "Update", className: "bg-muted text-muted-foreground border-border/60" };

function formatTimeLeft(expiresAt: string): string {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return "expired";
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  if (days > 0) return `${days}d ${hours}h left`;
  return `${hours}h left`;
}

export function OutgoingRequestsSection({
  items,
  isLoading,
  showHistory,
  onToggleHistory,
}: OutgoingRequestsSectionProps) {
  const cancelMutation = useCancelHandshakeRequest();
  const { toast } = useToast();
  // S11-A3: viewer id drives owner-aware app links.
  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id;

  const activeItems = items.filter((r) => ACTIVE_STATUSES.has(r.status));
  const historyItems = items.filter((r) => !ACTIVE_STATUSES.has(r.status));

  // S11-A3: link to my-submissions when viewer owns the app, else public detail.
  const appHref = (app: { id: number; appOwnerId?: string } | null | undefined) => {
    if (!app?.id) return null;
    if (currentUserId && app.appOwnerId === currentUserId) {
      return `/app/handshake-testing/my-submissions/${app.id}`;
    }
    return `/app/handshake-testing/${app.id}`;
  };

  const handleCancel = (id: number) => {
    cancelMutation.mutate(id, {
      // P3.3: surface failures instead of a silent dead button.
      onError: (err) =>
        toast({
          title: "Could not cancel",
          description:
            err instanceof Error ? err.message : "Something went wrong. Try again.",
          variant: "destructive",
        }),
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
        No outgoing handshake requests.
      </div>
    );
  }

  const renderCard = (req: HandshakeRequest) => {
    const status = STATUS_STYLES[req.status] ?? STATUS_FALLBACK;
    const requestedApp = req.requestedApp ?? null;
    const requestedDetail = requestedApp?.androidApp ?? null;
    const offeredApp = req.offeredApp ?? null;
    const offeredDetail = offeredApp?.androidApp ?? null;
    const requestedHref = appHref(requestedApp);
    const offeredHref = appHref(offeredApp);
    return (
      <motion.div
        key={req.id}
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: 20 }}
      >
        <Card className="h-full overflow-hidden hover:border-emerald-500/40 transition-colors">
          <CardContent className="p-4 flex flex-col h-full gap-3">
            {requestedHref ? (
              <Link
                href={requestedHref}
                className="flex items-start gap-3 group/app rounded-lg -m-1 p-1 hover:bg-secondary/40 transition-colors"
              >
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border/40">
                  {requestedDetail?.appLogoUrl ? (
                    <SafeImage
                      src={requestedDetail.appLogoUrl}
                      alt={requestedDetail.appName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold truncate">
                      {requestedDetail?.appName || "App"}
                    </p>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 transition-transform group-hover/app:translate-x-0.5" />
                  </div>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground mt-0.5">
                    Click to preview
                  </p>
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-muted border border-dashed border-border/60 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate text-muted-foreground">
                    App
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={status.className}>
                {status.label}
              </Badge>
              {req.toUser && (
                <p className="text-xs text-muted-foreground">
                  sent to {req.toUser.name}
                </p>
              )}
            </div>

            {req.message && (
              <p className="text-xs italic text-muted-foreground px-2 py-1.5 rounded bg-secondary/40 border-l-2 border-emerald-500/40 line-clamp-3">
                &quot;{req.message}&quot;
              </p>
            )}

            {req.status === "PENDING" && (
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Clock className="w-3 h-3" />
                {formatTimeLeft(req.expiresAt)}
              </div>
            )}

            {req.status === "REJECTED" && req.rejectionReason && (
              <p className="text-xs text-muted-foreground italic">
                Reason: {req.rejectionReason}
              </p>
            )}

            {(req.status === "ACCEPTED" || req.status === "MUTUAL_MATCHED") && (
              <div className="flex items-center gap-1 text-xs text-emerald-600">
                <Check className="w-3 h-3" />
                <span>Handshake established</span>
              </div>
            )}

            {/* S11-A5: sender's own offered app , owner link to my-submissions */}
            {offeredHref && offeredDetail && (
              <Link
                href={offeredHref}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 -mx-1 bg-secondary/30 hover:bg-secondary/50 transition-colors text-xs"
              >
                <div className="relative w-5 h-5 rounded overflow-hidden bg-muted flex-shrink-0">
                  {offeredDetail.appLogoUrl ? (
                    <SafeImage
                      src={offeredDetail.appLogoUrl}
                      alt={offeredDetail.appName}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <span className="text-muted-foreground truncate">Your app:</span>
                <span className="font-medium truncate">{offeredDetail.appName}</span>
                <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              </Link>
            )}

            {req.status === "PENDING" && (
              <div className="mt-auto flex pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  disabled={cancelMutation.isPending}
                  onClick={() => handleCancel(req.id)}
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      {activeItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
          No pending outgoing handshake requests.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence>
            {activeItems.map((req) => renderCard(req))}
          </AnimatePresence>
        </div>
      )}

      {historyItems.length > 0 && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={onToggleHistory}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <History className="w-3.5 h-3.5" />
            {showHistory
              ? "Hide past requests"
              : `Show past requests (${historyItems.length})`}
          </button>
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-2">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground/70 mb-2">
                    Past
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 opacity-70">
                    {historyItems.map((req) => renderCard(req))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
