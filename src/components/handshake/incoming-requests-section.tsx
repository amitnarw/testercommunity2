"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronRight, Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/safe-image";
import { authClient } from "@/lib/auth-client";
import { useAcceptHandshakeRequest, useRejectHandshakeRequest } from "@/hooks/useHandshakeRequests";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { useToast } from "@/hooks/use-toast";
import type { HandshakeRequest } from "@/lib/types";

interface IncomingRequestsSectionProps {
  items: HandshakeRequest[];
  isLoading: boolean;
}

function formatTimeLeft(expiresAt: string): string {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return "expired";
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  if (days > 0) return `${days}d ${hours}h left`;
  return `${hours}h left`;
}

export function IncomingRequestsSection({ items, isLoading }: IncomingRequestsSectionProps) {
  const router = useRouter();
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [reason, setReason] = useState("");

  const acceptMutation = useAcceptHandshakeRequest();
  const rejectMutation = useRejectHandshakeRequest();
  const { toast } = useToast();
  // S11-A3: viewer id drives owner-aware app links on the card.
  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id;

  // S11-A3: link to my-submissions when viewer owns the app, else public detail.
  const appHref = (app: { id: number; appOwnerId?: string } | null | undefined) => {
    if (!app?.id) return null;
    if (currentUserId && app.appOwnerId === currentUserId) {
      return `/app/handshake-testing/my-submissions/${app.id}`;
    }
    return `/app/handshake-testing/${app.id}`;
  };

  // P3.3: surface backend failures (expired request, filled campaign, active
  // penalty...) instead of failing silently.
  const showError = (err: unknown) => {
    toast({
      title: "Action failed",
      description:
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      variant: "destructive",
    });
  };

  const handleAccept = (id: number) => {
    acceptMutation.mutate(id, {
      onSuccess: () => router.push(ROUTES.AUTHENTICATED.HANDSHAKE_TESTING),
      onError: showError,
    });
  };

  const handleReject = () => {
    if (!rejectingId || !reason.trim()) return;
    rejectMutation.mutate(
      { id: rejectingId, reason: reason.trim() },
      {
        onSuccess: () => {
          setRejectingId(null);
          setReason("");
          toast({
            title: "Request rejected",
            description: "The developer has been notified.",
          });
        },
        onError: showError,
      },
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
        No incoming handshake requests.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence>
          {items.map((req) => {
            const offeredApp = req.offeredApp ?? null;
            const offeredDetail = offeredApp?.androidApp ?? null;
            const requestedDetail = req.requestedApp?.androidApp ?? null;
            const offeredHref = appHref(offeredApp);
            const requestedHref = appHref(req.requestedApp);
            return (
              <motion.div
                key={req.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="h-full overflow-hidden hover:border-primary/40 transition-colors">
                  <CardContent className="p-4 flex flex-col h-full gap-3">
                    {offeredHref ? (
                      <Link
                        href={offeredHref}
                        className="flex items-start gap-3 group/offered rounded-lg -m-1 p-1 hover:bg-secondary/40 transition-colors"
                      >
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border/40">
                          {offeredDetail?.appLogoUrl ? (
                            <SafeImage
                              src={offeredDetail.appLogoUrl}
                              alt={offeredDetail.appName}
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
                              {offeredDetail?.appName || "Their app"}
                            </p>
                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 transition-transform group-hover/offered:translate-x-0.5" />
                          </div>
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground mt-0.5">
                            Their app · click to preview
                          </p>
                        </div>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-muted border border-dashed border-border/60 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate text-muted-foreground">
                            No app offered
                          </p>
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground mt-0.5">
                            Legacy request
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative w-7 h-7 rounded-full overflow-hidden bg-muted flex-shrink-0">
                        {req.fromUser?.image ? (
                          <SafeImage
                            src={req.fromUser.image}
                            alt={req.fromUser.name || "User"}
                            fill
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        <span className="font-medium text-foreground">
                          {req.fromUser?.name || "Unknown developer"}
                        </span>{" "}
                        wants to test your{" "}
                        {requestedDetail?.appName && requestedHref ? (
                          <Link
                            href={requestedHref}
                            className="font-medium text-foreground underline-offset-2 hover:underline"
                          >
                            {requestedDetail.appName}
                          </Link>
                        ) : (
                          <span className="font-medium text-foreground">
                            {requestedDetail?.appName || "app"}
                          </span>
                        )}
                      </p>
                    </div>

                    {req.message && (
                      <p className="text-xs italic text-muted-foreground px-2 py-1.5 rounded bg-secondary/40 border-l-2 border-primary/40 line-clamp-3">
                        &quot;{req.message}&quot;
                      </p>
                    )}

                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatTimeLeft(req.expiresAt)}
                    </div>

                    <div className="mt-auto flex gap-2 pt-1">
                      {offeredHref && (
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="px-3"
                        >
                          <Link href={offeredHref}>
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            View
                          </Link>
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        disabled={rejectMutation.isPending}
                        onClick={() => setRejectingId(req.id)}
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        disabled={acceptMutation.isPending}
                        onClick={() => handleAccept(req.id)}
                      >
                        Accept
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <Dialog open={!!rejectingId} onOpenChange={(open) => { if (!open) { setRejectingId(null); setReason(""); } }}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Reject handshake request</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, 280))}
              placeholder="Tell them why (helps the community)..."
              rows={3}
            />
            <p className="text-[10px] text-muted-foreground text-right">
              {reason.length}/280
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => { setRejectingId(null); setReason(""); }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                disabled={!reason.trim() || rejectMutation.isPending}
                onClick={handleReject}
              >
                Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
