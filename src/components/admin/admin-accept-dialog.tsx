"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAcceptApp } from "@/hooks/useAdmin";
import { toast } from "@/hooks/use-toast";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@/components/ui/dialog";
import { DialogDescription } from "@/components/ui/dialog";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  Loader2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";

// Fixed plan price — single Professional plan at ₹999
const PLAN_PRICE_INR = 999;

interface AdminAcceptDialogProps {
  appId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  appType?: "PAID" | "FREE" | string;
  paymentInfo?: {
    amountPaid: number;
    currency: string;
    isPersisted?: boolean;
  } | null;
  initialData?: {
    totalTester?: number;
    totalDay?: number;
    minimumAndroidVersion?: number;
    rewardMoney?: number;
    costPoints?: number;
    rewardPoints?: number;
  };
  isReview?: boolean;
}

const ANDROID_VERSIONS = [
  "5.0",
  "5.1",
  "6.0",
  "7.0",
  "7.1",
  "8.0",
  "8.1",
  "9.0",
  "10.0",
  "11.0",
  "12.0",
  "12.1",
  "13.0",
  "14.0",
  "15.0",
  "16.0",
];

export function AdminAcceptDialog({
  appId,
  open,
  onOpenChange,
  onSuccess,
  appType,
  paymentInfo,
  initialData,
  isReview,
}: AdminAcceptDialogProps) {
  const isEditing = !!initialData && !isReview;

  // Helper to match numeric version to dropdown string values (e.g., 13 -> "13.0")
  const getVersionString = (v: number | undefined) => {
    if (v === undefined || v === null) return "";
    const s = v.toString();
    if (ANDROID_VERSIONS.includes(s)) return s;
    const withDotZero = `${v}.0`;
    if (ANDROID_VERSIONS.includes(withDotZero)) return withDotZero;
    return s;
  };

  // Initialize with initialData if provided, otherwise defaults
  const [totalTester, setTotalTester] = useState<string>(
    initialData?.totalTester?.toString() || "20",
  );
  const [totalDay, setTotalDay] = useState<string>(
    initialData?.totalDay?.toString() || "14",
  );
  const [minimumAndroidVersion, setMinimumAndroidVersion] = useState<string>(
    getVersionString(initialData?.minimumAndroidVersion),
  );
  const [rewardPoints, setRewardPoints] = useState<string>(
    initialData?.rewardMoney?.toString() || initialData?.rewardPoints?.toString() || "",
  );

  useEffect(() => {
    if (open) {
      setTotalTester(initialData?.totalTester?.toString() || "20");
      setTotalDay(initialData?.totalDay?.toString() || "14");
      setMinimumAndroidVersion(
        getVersionString(initialData?.minimumAndroidVersion),
      );
      // Try rewardMoney (PAID) then rewardPoints (FREE)
      const initialReward =
        initialData?.rewardMoney || initialData?.rewardPoints;
      setRewardPoints(initialReward?.toString() || "");
    }
  }, [open, initialData]);

  const { mutate: acceptApp, isPending: isAccepting } = useAcceptApp({
    onSuccess: () => {
      toast({
        title: "Submission Approved",
        description: "The app has been approved successfully.",
      });
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.message || "Failed to approve app.",
      });
    },
  });

  const handleApprove = () => {
    if (!totalTester || !totalDay || !minimumAndroidVersion || !rewardPoints) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all the required testing parameters, including tester rewards.",
      });
      return;
    }

    const payload: any = {
      id: appId,
      totalTester: Number(totalTester),
      totalDay: Number(totalDay),
      minimumAndroidVersion: parseFloat(minimumAndroidVersion),
      rewardPoints: Number(rewardPoints),
    };

    acceptApp(payload);
  };

  // ─── Financial Calculations ──────────────────────────────────────────────
  const testers = Number(totalTester) || 0;
  const payoutPerTester = Number(rewardPoints) || 0;
  const totalPayout = testers * payoutPerTester;

  // Income: use persisted payment if available, otherwise use the known plan price
  const income = paymentInfo?.amountPaid ?? PLAN_PRICE_INR;

  const profit = income - totalPayout;
  const isLoss = profit < 0;
  const payoutExceedsIncome = totalPayout > income;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-[580px] h-[90dvh] rounded-3xl overflow-hidden p-0 gap-0 border-none shadow-2xl bg-white dark:bg-[#1A1A1A]">
        <div className="bg-green-500/5 p-4 sm:p-6 border-b border-green-500/10">
          <DialogHeader>
            <DialogTitle className="text-green-600 flex items-center gap-2 text-lg sm:text-xl font-bold">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
              {isEditing ? "Update Plan" : "Approve Request"}
            </DialogTitle>
            <DialogDescription className="text-green-600/70 text-xs sm:text-sm">
              {isEditing
                ? "Update the current testing parameters."
                : "Set parameters and review financials."}
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-4 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {initialData && (
            <div className="space-y-2 mb-2">
              {isReview && (
                <div className="bg-blue-500/5 px-4 py-2.5 rounded-xl border border-blue-500/10 flex flex-wrap items-center gap-x-6 gap-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600/80 dark:text-blue-400/80 shrink-0">
                    User Request:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground font-medium">Testers:</span>
                    <span className="text-xs font-bold">{initialData.totalTester}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground font-medium">Duration:</span>
                    <span className="text-xs font-bold">{initialData.totalDay}d</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground font-medium">Min OS:</span>
                    <span className="text-xs font-bold truncate">
                      {initialData.minimumAndroidVersion ? `v${initialData.minimumAndroidVersion}` : "Any"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 ml-auto">
                    <span className="text-[10px] text-muted-foreground font-medium">Paid:</span>
                    <span className="text-xs font-bold text-blue-600">
                      {appType === "FREE"
                        ? `${initialData.costPoints || 0} Pts`
                        : `₹${(paymentInfo?.amountPaid || PLAN_PRICE_INR).toLocaleString("en-IN")}`}
                    </span>
                  </div>
                </div>
              )}

              {appType === "FREE" && (
                <div className="bg-amber-500/5 px-4 py-2.5 rounded-xl border border-amber-500/10 flex flex-wrap items-center gap-x-6 gap-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600/80 dark:text-amber-400/80 shrink-0">
                    Calculated Summary:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground font-medium">Testers:</span>
                    <span className="text-xs font-bold">{testers}</span>
                  </div>
                  <div className="flex items-center gap-1.5 align-baseline">
                    <span className="text-[10px] text-muted-foreground font-medium">Reward/Tester:</span>
                    <span className="text-xs font-bold text-emerald-600">{payoutPerTester} Pts</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="totalTester"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
              >
                Total Testers
              </Label>
              <Input
                id="totalTester"
                type="number"
                placeholder="e.g. 20"
                value={totalTester}
                onChange={(e) => setTotalTester(e.target.value)}
                min="1"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="totalDay"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
              >
                Total Duration (Days)
              </Label>
              <Input
                id="totalDay"
                type="number"
                placeholder="e.g. 14"
                value={totalDay}
                onChange={(e) => setTotalDay(e.target.value)}
                min="1"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="minAndroid"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
              >
                Min Android Version
              </Label>
              <Select
                value={minimumAndroidVersion}
                onValueChange={setMinimumAndroidVersion}
              >
                <SelectTrigger id="minAndroid" className="h-11">
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>
                <SelectContent>
                  {ANDROID_VERSIONS.map((v) => (
                    <SelectItem key={v} value={v}>
                      Android {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="reward"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
              >
                {appType === "PAID" ? "Payout per Tester (₹)" : "Reward for Testers (Points)"}
              </Label>
              <Input
                id="reward"
                type="number"
                placeholder={appType === "PAID" ? "e.g. 30" : "e.g. 100"}
                value={rewardPoints}
                onChange={(e) => setRewardPoints(e.target.value)}
                min="0"
                className="h-11"
              />
            </div>
          </div>

          {appType === "PAID" && (
            <div className="mt-2 p-5 bg-secondary/30 rounded-2xl border border-border/50 space-y-4">
              <h4 className="text-sm font-bold flex items-center gap-2 text-primary">
                Financial Summary
              </h4>

              <div className="space-y-2.5">
                {/* Income */}
                <div className="flex justify-between items-start gap-4 text-xs sm:text-sm">
                  <span className="text-muted-foreground">
                    Paid by Developer:
                  </span>
                  <span className="font-bold text-blue-600 shrink-0">
                    ₹{income.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Testers info row */}
                {testers > 0 && payoutPerTester > 0 && (
                  <div className="flex justify-between items-start gap-4 text-xs sm:text-sm text-muted-foreground">
                    <span>
                      {testers} tester{testers !== 1 ? "s" : ""} × ₹
                      {payoutPerTester.toLocaleString("en-IN")}
                    </span>
                    <span className="font-medium text-red-500 shrink-0">
                      -₹{totalPayout.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                {/* Divider + Profit */}
                <div className="pt-2 border-t border-border flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold">Platform Earnings:</span>
                    {payoutPerTester > 0 &&
                      (isLoss ? (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ))}
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        "text-lg font-black",
                        profit >= 0 ? "text-green-600" : "text-red-600",
                      )}
                    >
                      ₹{profit.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Max safe payout hint */}
                <div className="text-xs text-muted-foreground/70 pt-1">
                  {testers > 0
                    ? `Max suggested payout: ₹${(income / testers).toFixed(2)} per tester`
                    : `Total available budget: ₹${income.toLocaleString("en-IN")}`}
                </div>
              </div>

              {/* Loss warning */}
              {payoutExceedsIncome && (
                <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                    Warning: You are paying out more money (₹
                    {totalPayout.toLocaleString("en-IN")}) than the developer
                    paid (₹{income.toLocaleString("en-IN")}). Please lower the
                    payout or the number of testers.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="bg-amber-500/5 p-3 sm:p-4 rounded-xl border border-amber-500/20">
            <p className="text-[11px] sm:text-xs text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
              Note: Approving this app will set it to "AVAILABLE" status. Add testers via the "Manage Testers" option to start the campaign.
            </p>
          </div>
        </div>

        <DialogFooter className="p-4 sm:p-6 bg-secondary/30 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 border-t border-border/50">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-10 sm:h-11 rounded-xl px-6 w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApprove}
            className="h-10 sm:h-11 rounded-xl px-8 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 w-full sm:w-auto"
            disabled={isAccepting}
          >
            {isAccepting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Processing...
              </>
            ) : isEditing ? (
              "Update Project"
            ) : (
              "Confirm Approval"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
