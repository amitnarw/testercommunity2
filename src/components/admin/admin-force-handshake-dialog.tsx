"use client";

import { useMemo, useState } from "react";
import { Handshake } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminForceHandshake } from "@/hooks/useHandshakeMonitoring";
import { useHubApps, useSingleHubAppDetails } from "@/hooks/useHub";
import { useToast } from "@/hooks/use-toast";
import type { HubSubmittedAppResponse } from "@/lib/types";

interface AdminForceHandshakeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The campaign whose detail page this dialog was opened from. */
  thisCampaign: { id: number; appOwnerId: string };
  /** Optional callback after a successful force (e.g. refetch detail). */
  onSuccess?: () => void;
}

/**
 * S12: Force-handshake affordance from the admin submission-detail page.
 * Mirrors the Waiting-tab row on /admin/handshake-monitoring but is
 * contextual: this campaign is side A; admin picks a partner (side B).
 * Backend rejects same-owner, non-HANDSHAKE, or non-eligible states.
 */
export function AdminForceHandshakeDialog({
  open,
  onOpenChange,
  thisCampaign,
  onSuccess,
}: AdminForceHandshakeDialogProps) {
  const { toast } = useToast();
  const forceMutation = useAdminForceHandshake();
  const [partnerAppId, setPartnerAppId] = useState<string>("");

  // Refetch detail so the dialog header shows the current app name (it can
  // change if the admin just edited it).
  const { data: detail } = useSingleHubAppDetails({ id: String(thisCampaign.id) });
  const thisAppName =
    detail?.androidApp?.appName ?? `Campaign #${thisCampaign.id}`;

  // Fetch partner candidates from the hub endpoint. Its server-side filter
  // already excludes: non-HANDSHAKE apps, my own apps, apps I'm actively
  // testing (so any active handshake I'm part of is hidden), and apps I've
  // sent a PENDING handshake request to. We only need to drop thisCampaign.
  const { data: availableData, isLoading: loadingAvailable } =
    useHubApps({ type: "AVAILABLE" });

  // Per-combination pairing rule: if thisCampaign is already linked to a
  // candidate via an active HandshakeLink, exclude that candidate. Re-pair
  // becomes allowed once the prior link completes (the relation drops out
  // of these queries because its status is no longer IN_PROGRESS).
  //
  // Each admin-active tester relation carries a `handshakePair` whose
  // partnerRelation.campaign.id is the OTHER side of the link. Reading
  // those across admin's IN_TESTING + APPROVED apps gives us the exact
  // set of campaign IDs currently paired with thisCampaign.
  //
  // (Caveat: this assumes admin === thisCampaign.appOwnerId, which is
  // true for the current Force Handshake entry path. For the admin-
  // viewing-someone-else case, this same set is not sufficient and would
  // need a backend extension to fetch thisCampaign owner's partners.)
  const { data: inTestingApps } = useHubApps({ type: "IN_TESTING" });
  const { data: approvedApps } = useHubApps({ type: "APPROVED" });

  const currentlyPairedCampaignIds = useMemo(() => {
    const ids = new Set<number>();
    const allAdminApps = [...(inTestingApps ?? []), ...(approvedApps ?? [])];
    for (const app of allAdminApps) {
      const partnerCampaign =
        app.testerRelations?.[0]?.handshakePair?.partnerRelation?.campaign;
      if (partnerCampaign?.id) ids.add(partnerCampaign.id);
    }
    return ids;
  }, [inTestingApps, approvedApps]);

  const candidates: HubSubmittedAppResponse[] = useMemo(
    () =>
      (availableData || []).filter((a) => {
        // (1) status sanity
        if (a.status !== "AVAILABLE") return false;
        // (2) type sanity
        if (a.appType !== "HANDSHAKE") return false;
        // (3) self
        if (a.id === thisCampaign.id) return false;

        // (4) Per-combination rule: this exact pair is already linked by
        // an active HandshakeLink. Re-pair becomes allowed once the link
        // completes (the tester relation drops out of IN_PROGRESS, the
        // campaign disappears from IN_TESTING/APPROVED, partner id is
        // no longer added to the set).
        if (currentlyPairedCampaignIds.has(a.id)) return false;

        // (5) Same owner ,  three orthogonal signals so a single
        // malformed field can't bypass this. Owner names are always
        // visible in the dropdown ("Amit Narwal" etc.); appName is the
        // campaign display name. If any signal matches, exclude.
        const thisOwnerName = detail?.appOwner?.name?.toLowerCase().trim();
        const candOwnerName = a.appOwner?.name?.toLowerCase().trim();
        const thisAppName = detail?.androidApp?.appName?.toLowerCase().trim();
        const candAppName = a.androidApp?.appName?.toLowerCase().trim();

        const sameOwnerById =
          a.appOwnerId != null &&
          thisCampaign.appOwnerId != null &&
          a.appOwnerId === thisCampaign.appOwnerId;
        const sameOwnerByName =
          thisOwnerName != null &&
          thisOwnerName !== "" &&
          candOwnerName != null &&
          candOwnerName !== "" &&
          thisOwnerName === candOwnerName;
        const sameAppName =
          thisAppName != null &&
          thisAppName !== "" &&
          candAppName != null &&
          candAppName !== "" &&
          thisAppName === candAppName;

        if (sameOwnerById || sameOwnerByName || sameAppName) return false;

        return true;
      }),
    [
      availableData,
      thisCampaign.id,
      thisCampaign.appOwnerId,
      detail,
      currentlyPairedCampaignIds,
    ],
  );

  const selected = candidates.find((c) => c.id.toString() === partnerAppId);

  const validationError = (() => {
    if (!selected) return null;
    if (selected.appOwnerId === thisCampaign.appOwnerId) {
      return "You can't force a handshake between a campaign and another campaign owned by the same developer.";
    }
    return null;
  })();

  const handleForce = () => {
    if (!selected || validationError) return;
    forceMutation.mutate(
      {
        userAId: thisCampaign.appOwnerId,
        userBId: selected.appOwnerId,
        appAId: thisCampaign.id,
        appBId: selected.id,
      },
      {
        onSuccess: () => {
          toast({
            title: "Handshake forced",
            description: "Both campaigns are now TESTING_ACTIVE.",
          });
          setPartnerAppId("");
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (err: Error) => {
          toast({
            title: "Force failed",
            description: err?.message || "Unknown error",
            variant: "destructive",
          });
        },
      },
    );
  };

  // Reset selection whenever the dialog closes so reopening starts fresh.
  const handleOpenChange = (next: boolean) => {
    if (!next) setPartnerAppId("");
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[95vw] sm:w-[520px] rounded-3xl overflow-hidden p-0 gap-0 border-none shadow-2xl bg-white dark:bg-[#1A1A1A]">
        <DialogHeader className="bg-amber-500/10 p-4 sm:p-6 border-b border-amber-500/20">
          <DialogTitle className="text-amber-600 flex items-center gap-2 text-lg sm:text-xl font-bold">
            <Handshake className="w-5 h-5" />
            Force Handshake
          </DialogTitle>
          <DialogDescription className="text-amber-600/70 text-xs sm:text-sm">
            Pair <span className="font-semibold">{thisAppName}</span> with another
            HANDSHAKE campaign so testing can start immediately, bypassing the
            24-hour partner wait.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 sm:p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Partner campaign
            </label>
            <Select value={partnerAppId} onValueChange={setPartnerAppId}>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingAvailable
                      ? "Loading partner campaigns…"
                      : candidates.length === 0
                        ? "No eligible partner campaigns"
                        : "Pick a partner campaign"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {candidates.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    #{c.id} {c.androidApp?.appName || "Untitled"} |{" "}
                    {c.appOwner?.name || c.appOwnerId}{" "}
                    <span className="text-muted-foreground text-xs">
                      ({c.currentTester || 0}/{c.totalTester || 0})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
<p className="text-[11px] text-muted-foreground">
              Only AVAILABLE HANDSHAKE campaigns with free slots that
              aren&apos;t yours and aren&apos;t already paired with this one
              are shown. A completed pair becomes eligible again.
            </p>
          </div>

          {validationError && (
            <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
              {validationError}
            </p>
          )}
        </div>

        <DialogFooter className="p-4 sm:p-6 bg-secondary/30 gap-3 border-t border-border/50">
          <Button
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            className="h-11 rounded-xl px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={handleForce}
            disabled={
              !selected ||
              !!validationError ||
              forceMutation.isPending
            }
            className="h-11 rounded-xl px-6 bg-amber-600 hover:bg-amber-700 text-white font-semibold"
          >
            {forceMutation.isPending ? "Forcing…" : "Force Handshake"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
