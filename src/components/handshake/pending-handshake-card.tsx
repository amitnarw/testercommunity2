"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/safe-image";
import { Clock, Check, X, Handshake, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAcceptHandshakeRequest, useRejectHandshakeRequest } from "@/hooks/useHandshakeRequests";
import { useToast } from "@/hooks/use-toast";
import { ROUTES } from "@/lib/routes";

interface PendingHandshakeCardProps {
  requestId: number;
  fromUser: { id: string; name: string; image: string | null };
  message: string | null;
  expiresAt: string;
  /** Where the viewer's OWN app will land once the handshake is accepted. */
  yourAppName?: string;
}

function formatTimeLeft(expiresAt: string): string {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return "expired";
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  if (days > 0) return `${days}d ${hours}h left`;
  return `${hours}h left`;
}

/**
 * S11-B4: shown on the handshake detail page when the app's owner has a
 * PENDING request to the viewer for this app. Accepting triggers the mutual
 * match (establishes the handshake); rejecting dismisses the request.
 */
export function PendingHandshakeCard({
  requestId,
  fromUser,
  message,
  expiresAt,
  yourAppName,
}: PendingHandshakeCardProps) {
  const router = useRouter();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const acceptMutation = useAcceptHandshakeRequest();
  const rejectMutation = useRejectHandshakeRequest();
  const { toast } = useToast();

  const showError = (err: unknown) => {
    toast({
      title: "Action failed",
      description:
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      variant: "destructive",
    });
  };

  const handleAccept = () => {
    acceptMutation.mutate(requestId, {
      onSuccess: () => router.push(ROUTES.AUTHENTICATED.HANDSHAKE_TESTING),
      onError: showError,
    });
  };

  const handleRejectConfirm = () => {
    if (!reason.trim()) return;
    rejectMutation.mutate(
      { id: requestId, reason: reason.trim() },
      {
        onSuccess: () => {
          setRejecting(false);
          setReason("");
          toast({ title: "Request rejected", description: "The developer has been notified." });
        },
        onError: showError,
      },
    );
  };

  return (
    <>
      <Card className="overflow-hidden border-primary/30 bg-gradient-to-br from-primary/5 to-background">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0 border border-border/40">
              {fromUser.image ? (
                <SafeImage
                  src={fromUser.image}
                  alt={fromUser.name}
                  fill
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{fromUser.name}</p>
              <p className="text-xs text-muted-foreground">
                sent you a handshake for this app
                {yourAppName ? (
                  <>
                    {" "}
                    (you&apos;ll test their <span className="font-medium text-foreground">{yourAppName}</span>)
                  </>
                ) : null}
              </p>
            </div>
          </div>

          {message && (
            <p className="text-xs italic text-muted-foreground px-2 py-1.5 rounded bg-secondary/40 border-l-2 border-primary/40 line-clamp-3">
              &quot;{message}&quot;
            </p>
          )}

          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Clock className="w-3 h-3" />
            {formatTimeLeft(expiresAt)}
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              disabled={acceptMutation.isPending || rejectMutation.isPending}
              onClick={() => setRejecting(true)}
            >
              <X className="w-4 h-4 mr-1" />
              Reject
            </Button>
            <Button
              size="sm"
              className="flex-1"
              disabled={acceptMutation.isPending || rejectMutation.isPending}
              onClick={handleAccept}
            >
              <Check className="w-4 h-4 mr-1" />
              Accept
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={rejecting}
        onOpenChange={(open) => {
          if (!open) {
            setRejecting(false);
            setReason("");
          }
        }}
      >
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Reject handshake request</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="reject-reason">Reason</Label>
            <Textarea
              id="reject-reason"
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
                onClick={() => {
                  setRejecting(false);
                  setReason("");
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                disabled={!reason.trim() || rejectMutation.isPending}
                onClick={handleRejectConfirm}
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

interface RequestSentCardProps {
  requestId: number;
  expiresAt: string;
  /** The app the viewer offered (their own app). */
  offeredApp?: {
    id: number;
    androidApp?: { appName: string; appLogoUrl: string };
  } | null;
  /** Owner link , viewer owns this app so it goes to my-submissions. */
  offeredAppHref?: string | null;
}

/** S11-B4: shown on the detail page when the viewer has already sent a
 *  PENDING request to this app's owner. Replaces the generic CTA so they
 *  don't try to send again (which would 409). */
export function RequestSentCard({
  requestId,
  expiresAt,
  offeredApp,
  offeredAppHref,
}: RequestSentCardProps) {
  const offeredName = offeredApp?.androidApp?.appName;
  return (
    <Card className="overflow-hidden border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-background">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-amber-600">
          <Clock className="w-4 h-4" />
          <p className="font-semibold">Request sent, awaiting response</p>
        </div>
        <p className="text-xs text-muted-foreground">
          You&apos;re waiting for the developer to accept. We&apos;ll notify
          you as soon as they respond.
        </p>
        {offeredAppHref && offeredName && (
          <Link
            href={offeredAppHref}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 -mx-1 bg-secondary/30 hover:bg-secondary/50 transition-colors text-xs"
          >
            <div className="relative w-5 h-5 rounded overflow-hidden bg-muted flex-shrink-0">
              {offeredApp?.androidApp?.appLogoUrl ? (
                <SafeImage
                  src={offeredApp.androidApp.appLogoUrl}
                  alt={offeredApp.androidApp.appName}
                  fill
                  className="object-cover"
                />
              ) : null}
            </div>
            <span className="text-muted-foreground">Your app:</span>
            <span className="font-medium truncate">{offeredName}</span>
          </Link>
        )}
        <p className="text-[10px] text-muted-foreground">
          Request #{requestId} · expires in{" "}
          {formatTimeLeft(expiresAt)}
        </p>
      </CardContent>
    </Card>
  );
}

interface ActiveHandshakeCardProps {
  campaignId: number;
  /** Campaign lifecycle status , detects the 24h waiting window. */
  status?: string;
  currentDay?: number;
  totalDay?: number;
}

/** Shown on the detail page when the viewer already has an ACTIVE handshake
 *  link on this campaign (handshake.partnerApp is set). Replaces the generic
 *  "Request to Join Testing" CTA , they are already a tester here, so the
 *  only meaningful action is going to the testing dashboard. */
export function ActiveHandshakeCard({
  campaignId,
  status,
  currentDay,
  totalDay,
}: ActiveHandshakeCardProps) {
  const isWaiting = status === "WAITING_FOR_PARTNERS";
  const day = currentDay && currentDay > 0 ? currentDay : 1;
  const progress =
    totalDay && totalDay > 0 ? Math.min((day / totalDay) * 100, 100) : 0;

  return (
    <Card className="overflow-hidden border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-background">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-emerald-600">
          <Handshake className="w-4 h-4" />
          <p className="font-semibold">
            Handshake active | you&apos;re testing this app
          </p>
        </div>
        {isWaiting ? (
          <p className="text-xs text-muted-foreground">
            Handshake confirmed. Testing starts once the 24-hour waiting
            period ends , we&apos;ll notify you when day 1 begins.
          </p>
        ) : (
          totalDay && totalDay > 0 && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-muted-foreground">
                <span>Progress</span>
                <span>
                  Day {day} of {totalDay}
                </span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )
        )}
        <Button asChild size="sm" className="w-full">
          <Link href={`/app/handshake-testing/${campaignId}/ongoing`}>
            Go to Testing Dashboard
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

/** Shown on the detail page when the viewer is the campaign's owner ,
 *  joining your own campaign makes no sense, so point them to their
 *  submission management view instead. */
export function OwnCampaignCard({ campaignId }: { campaignId: number }) {
  return (
    <Card className="overflow-hidden border-border/60 bg-secondary/20">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-foreground/80">
          <Handshake className="w-4 h-4" />
          <p className="font-semibold">This is your campaign</p>
        </div>
        <p className="text-xs text-muted-foreground">
          You published this app. Manage its details and testers from your
          submission page.
        </p>
        <Button asChild size="sm" variant="outline" className="w-full">
          <Link href={`/app/handshake-testing/my-submissions/${campaignId}`}>
            <ExternalLink className="w-4 h-4 mr-1" />
            Manage Submission
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
