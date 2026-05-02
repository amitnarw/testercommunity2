"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SafeImage } from "@/components/safe-image";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { updateDailyVerificationStatus } from "@/lib/apiCalls";

interface VerificationData {
  id: number;
  dayNumber: number;
  proofImageUrl: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  verifiedAt: string;
  rejectionReason?: string;
  metaData?: any;
}

interface AdminVerificationReviewProps {
  isOpen: boolean;
  onClose: () => void;
  testerName: string;
  verifications: VerificationData[];
  onSuccess: () => void;
}

export function AdminVerificationReview({
  isOpen,
  onClose,
  testerName,
  verifications,
  onSuccess,
}: AdminVerificationReviewProps) {
  const [selectedVerification, setSelectedVerification] =
    useState<VerificationData | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectingLocal, setIsRejectingLocal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const sortedVerifications = [...verifications].sort(
    (a, b) => b.dayNumber - a.dayNumber,
  );

  const handleUpdateStatus = async (status: "VERIFIED" | "REJECTED") => {
    if (!selectedVerification) return;
    if (status === "REJECTED" && !rejectionReason.trim()) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await updateDailyVerificationStatus({
        id: selectedVerification.id.toString(),
        status,
        reason: rejectionReason,
      });

      toast({
        title: "Success",
        description: `Verification marked as ${status.toLowerCase()}.`,
      });

      onSuccess();
      setSelectedVerification(null);
      setRejectionReason("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-2 border-b">
            <DialogTitle className="text-xl font-bold">
              Verification History: {testerName}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Review and manage daily proof submissions.
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sortedVerifications.map((v) => (
                <div
                  key={v.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer hover:border-primary/50 hover:bg-muted/50",
                    v.status === "REJECTED"
                      ? "border-red-200 bg-red-50/10"
                      : "bg-card",
                  )}
                  onClick={() => setSelectedVerification(v)}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg overflow-hidden relative border shadow-sm shrink-0">
                      <SafeImage
                        src={v.proofImageUrl}
                        alt={`Day ${v.dayNumber}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-bold">Day {v.dayNumber}</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <Badge
                          variant="outline"
                          className={cn(
                            "h-4 px-1 text-[8px] font-bold uppercase",
                            v.status === "VERIFIED"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : v.status === "REJECTED"
                                ? "bg-red-500/10 text-red-600 border-red-500/20"
                                : "bg-amber-500/10 text-amber-600 border-amber-500/20",
                          )}
                        >
                          {v.status}
                        </Badge>
                        <span>{format(new Date(v.verifiedAt), "MMM d")}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground/30" />
                </div>
              ))}
              {sortedVerifications.length === 0 && (
                <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-2xl">
                  No verifications submitted yet.
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail View / Review Dialog */}
      <Dialog
        open={!!selectedVerification}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedVerification(null);
            setIsRejectingLocal(false);
            setRejectionReason("");
          }
        }}
      >
        <DialogContent className="max-w-[95vw] sm:max-w-5xl p-0 overflow-hidden bg-background rounded-3xl border-none shadow-2xl">
          <div className="flex flex-col md:flex-row h-auto md:h-[600px]">
            {/* Left: Image Preview */}
            <div className="flex-1 relative bg-slate-900 flex items-center justify-center p-4 border-r border-border/10 overflow-hidden min-h-[300px] md:min-h-0">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              {selectedVerification && (
                <SafeImage
                  src={selectedVerification.proofImageUrl}
                  alt="Proof"
                  fill
                  className="object-contain"
                />
              )}
              {/* Floating Day Badge */}
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-primary hover:bg-primary text-primary-foreground px-4 py-1 rounded-lg shadow-lg font-black tracking-wider uppercase text-xs">
                  Day {selectedVerification?.dayNumber}
                </Badge>
              </div>
            </div>

            {/* Right: Review Actions */}
            <div className="w-full md:w-[380px] flex flex-col bg-card h-full border-l border-border/40">
              <DialogHeader className="p-6 pb-4 border-b shrink-0 bg-secondary/10">
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Review Proof
                </DialogTitle>
                <p className="text-[11px] text-muted-foreground uppercase font-bold tracking-widest mt-1">
                  Tester: {testerName}
                </p>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Meta Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 bg-muted/40 rounded-2xl border border-border/60 transition-colors hover:bg-muted/60">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="p-2 bg-background rounded-xl">
                        <CalendarDays className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wide">
                        Submitted
                      </span>
                    </div>
                    <span className="text-xs font-mono font-medium text-foreground">
                      {selectedVerification?.verifiedAt
                        ? format(
                          new Date(selectedVerification.verifiedAt),
                          "MMM d, h:mm a",
                        )
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 bg-muted/40 rounded-2xl border border-border/60 transition-colors hover:bg-muted/60">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="p-2 bg-background rounded-xl">
                        <Clock className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wide">
                        Status
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "h-6 px-2.5 text-[10px] uppercase font-black tracking-wider",
                        selectedVerification?.status === "VERIFIED"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-[0_0_15px_-5px_#10b98155]"
                          : selectedVerification?.status === "REJECTED"
                            ? "bg-red-500/10 text-red-600 border-red-500/20"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20",
                      )}
                    >
                      {selectedVerification?.status}
                    </Badge>
                  </div>
                </div>

                {/* Status-specific Display */}
                {selectedVerification?.status === "REJECTED" &&
                  !isRejectingLocal && (
                    <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/10 space-y-2 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center gap-2 text-destructive font-bold text-xs">
                        <AlertTriangle className="w-4 h-4" /> REJECTION REASON
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed italic">
                        "
                        {selectedVerification.rejectionReason ||
                          "No reason provided at the time of rejection."}
                        "
                      </p>
                    </div>
                  )}

                {/* Reject Area - Only shown during rejection flow */}
                {isRejectingLocal && (
                  <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-4 h-4" />
                        <h4 className="text-xs font-black uppercase tracking-wider">
                          Reason for Rejection
                        </h4>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-[10px] font-bold uppercase px-2 hover:bg-red-500/10 hover:text-red-600"
                        onClick={() => {
                          setIsRejectingLocal(false);
                          setRejectionReason("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Explain why this proof is being rejected. This will be visible to the tester..."
                      className="min-h-[120px] text-sm bg-background/50 border-red-200 focus:border-red-500 focus:ring-red-500/20 rounded-2xl resize-none shadow-sm"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      autoFocus
                    />
                    <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                      * Testers will need to resubmit proof for this day to
                      continue.
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter className="p-6 border-t gap-3 flex !flex-col justify-end items-center bg-secondary/5 mt-auto">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedVerification(null);
                    setIsRejectingLocal(false);
                    setRejectionReason("");
                  }}
                  disabled={isSubmitting}
                  className="rounded-xl flex-1 font-bold h-11"
                >
                  Close
                </Button>

                {!isRejectingLocal ? (
                  <>
                    <Button
                      variant="outline"
                      className="rounded-xl flex-1 h-11 font-bold border-red-500/20 bg-red-500/5 text-red-600 hover:bg-red-500/10 hover:text-red-700 hover:border-red-500/40"
                      onClick={() => setIsRejectingLocal(true)}
                      disabled={isSubmitting || selectedVerification?.status === "VERIFIED"}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      className="rounded-xl flex-1 h-11 font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
                      onClick={() => handleUpdateStatus("VERIFIED")}
                      disabled={isSubmitting || selectedVerification?.status === "REJECTED"}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <p className="text-[10px] text-muted-foreground text-center w-full mt-1">
                      Auto-approved proofs can be manually rejected if needed
                    </p>
                  </>
                ) : (
                  <Button
                    variant="destructive"
                    className="rounded-xl flex-1 h-11 font-bold shadow-lg shadow-red-500/20 bg-gradient-to-r from-red-600 to-red-500"
                    onClick={() => handleUpdateStatus("REJECTED")}
                    disabled={isSubmitting || !rejectionReason.trim()}
                  >
                    {isSubmitting ? "Processing..." : "Confirm Rejection"}
                  </Button>
                )}
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
