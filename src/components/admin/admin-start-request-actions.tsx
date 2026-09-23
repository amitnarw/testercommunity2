"use client";

import { useState, type ReactNode } from "react";
import { Check, X, Loader2, ShieldAlert, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  useApproveStartRequest,
  useRejectStartRequest,
} from "@/hooks/useHandshakeMonitoring";

interface AdminStartRequestActionsProps {
  campaignId: number;
  /** Called after a successful approve/reject (e.g. refetch detail data). */
  onSuccess?: () => void;
  /** Button sizing: "sm" for queue rows, "default" for the detail page. */
  size?: "sm" | "default";
  /** Optional content rendered left of the buttons (e.g. "Open campaign" link). */
  leading?: ReactNode;
  /** Extra classes for the trigger-button container. */
  className?: string;
  /** Campaign numbers shown in the approve dialog. */
  summary?: {
    currentTester: number;
    totalTester: number;
    totalDay: number;
  };
}

/**
 * Shared approve/reject controls for a pending handshake start request
 * (START_REQUESTED). Both actions open proper confirmation Dialogs
 * (matching the AdminRejectDialog / AdminStartTestingDialog pattern) —
 * nothing expands inline. Approve activates testing immediately (backend
 * re-validates the 12-tester gate); reject requires a remark, returns the
 * campaign to AVAILABLE, and notifies the owner.
 */
export function AdminStartRequestActions({
  campaignId,
  onSuccess,
  size = "sm",
  leading,
  className,
  summary,
}: AdminStartRequestActionsProps) {
  const { toast } = useToast();
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [remark, setRemark] = useState("");

  const approveMutation = useApproveStartRequest({
    onSuccess: () => {
      toast({
        title: "Start request approved",
        description: "The campaign is now TESTING_ACTIVE.",
      });
      setShowApproveDialog(false);
      onSuccess?.();
    },
    onError: (err) => {
      toast({
        title: "Approve failed",
        description: err?.message || "Unknown error",
        variant: "destructive",
      });
    },
  });
  const rejectMutation = useRejectStartRequest({
    onSuccess: () => {
      toast({
        title: "Start request rejected",
        description: "The campaign is available again.",
      });
      setShowRejectDialog(false);
      setRemark("");
      onSuccess?.();
    },
    onError: (err) => {
      toast({
        title: "Reject failed",
        description: err?.message || "Unknown error",
        variant: "destructive",
      });
    },
  });

  const handleReject = () => {
    if (!remark.trim()) {
      toast({
        title: "Remark required",
        description: "Please add a remark explaining why this was rejected.",
        variant: "destructive",
      });
      return;
    }
    rejectMutation.mutate({ campaignId, remark: remark.trim() });
  };

  const busy = approveMutation.isPending || rejectMutation.isPending;
  const large = size === "default";

  return (
    <>
      <div
        className={
          className ??
          "flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
        }
      >
        {leading}
        <Button
          size={size}
          variant="outline"
          className={
            large
              ? "px-5 py-2.5 h-auto rounded-xl shadow-sm font-bold text-red-600 border-red-500/30 hover:bg-red-500/10"
              : "text-red-600 border-red-500/30 hover:bg-red-500/10"
          }
          disabled={busy}
          onClick={() => setShowRejectDialog(true)}
        >
          {large && <X className="w-4 h-4 mr-1.5" />}
          {large ? "Reject Request" : "Reject"}
        </Button>
        <Button
          size={size}
          className={
            large
              ? "px-5 py-2.5 h-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md font-bold"
              : "bg-emerald-500 hover:bg-emerald-500/90 text-white"
          }
          disabled={busy}
          onClick={() => setShowApproveDialog(true)}
        >
          {large && <Check className="w-4 h-4 mr-1.5" />}
          {large ? "Approve & Start Testing" : "Approve & Start"}
        </Button>
      </div>

      {/* Approve confirmation dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="w-[95vw] sm:w-[480px] rounded-3xl overflow-hidden p-0 gap-0 border-none shadow-2xl bg-white dark:bg-[#1A1A1A]">
          <div className="bg-emerald-500/5 p-6 border-b border-emerald-500/10">
            <DialogHeader>
              <DialogTitle className="text-emerald-600 flex items-center gap-2 text-xl font-bold">
                <PlayCircle className="w-6 h-6" />
                Approve Start Request
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Begin the active testing period for this application.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The application will be marked as &quot;TESTING ACTIVE&quot;
              {summary && (
                <>
                  {" "}
                  with{" "}
                  <strong className="text-foreground">
                    {summary.currentTester} of {summary.totalTester}
                  </strong>{" "}
                  testers joined
                </>
              )}
              . Testers will be able to see the instructions and begin the{" "}
              {summary?.totalDay ?? 16}-day testing period immediately.
            </p>
            <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20">
              <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed font-medium">
                Note: The 12-tester minimum is re-validated on approval. If
                testers dropped below 12, the approval will be rejected.
              </p>
            </div>
          </div>

          <DialogFooter className="p-6 bg-secondary/30 gap-3 border-t border-border/50">
            <Button
              variant="ghost"
              onClick={() => setShowApproveDialog(false)}
              className="h-11 rounded-xl px-6"
              disabled={approveMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={() => approveMutation.mutate({ campaignId })}
              className="h-11 rounded-xl px-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
              disabled={approveMutation.isPending}
            >
              {approveMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Approving...
                </>
              ) : (
                "Approve & Start"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject dialog with compulsory remark */}
      <Dialog
        open={showRejectDialog}
        onOpenChange={(open) => {
          setShowRejectDialog(open);
          if (!open) setRemark("");
        }}
      >
        <DialogContent className="w-[95vw] sm:w-[500px] rounded-3xl overflow-hidden p-0 gap-0 border-none shadow-2xl bg-white dark:bg-[#1A1A1A]">
          <div className="bg-destructive/5 p-6 border-b border-destructive/10">
            <DialogHeader>
              <DialogTitle className="text-red-600 flex items-center gap-2 text-xl font-bold">
                <ShieldAlert className="w-5 h-5" />
                Reject Start Request
              </DialogTitle>
              <DialogDescription className="text-red-600/70">
                The campaign returns to AVAILABLE. Your remark is required —
                the owner will see it.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-2">
            <label className="text-sm font-medium">
              Rejection remark <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="e.g. Only 8 testers joined — handshake with more developers and re-request once 12 have joined..."
              className="min-h-[100px] bg-secondary/30 border-primary/10 focus:border-primary/30 resize-none"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              disabled={rejectMutation.isPending}
            />
          </div>

          <DialogFooter className="p-6 bg-secondary/30 gap-3 border-t border-border/50">
            <Button
              variant="ghost"
              onClick={() => {
                setShowRejectDialog(false);
                setRemark("");
              }}
              className="h-11 rounded-xl px-6"
              disabled={rejectMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              className="h-11 rounded-xl px-8"
              disabled={rejectMutation.isPending || !remark.trim()}
            >
              {rejectMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Rejecting...
                </>
              ) : (
                "Confirm Reject"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
