"use client";

import { useState } from "react";
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
import { DialogClose } from "@/components/ui/dialog";
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
  "13.0",
  "14.0",
  "15.0",
];

export function AdminAcceptDialog({
  appId,
  open,
  onOpenChange,
  onSuccess,
  appType,
  paymentInfo,
}: AdminAcceptDialogProps) {
  // Default to 14 days (Google Play compliance) and sensible tester count
  const [totalTester, setTotalTester] = useState<string>("20");
  const [totalDay, setTotalDay] = useState<string>("14");
  const [minimumAndroidVersion, setMinimumAndroidVersion] =
    useState<string>("");
  const [rewardPoints, setRewardPoints] = useState<string>("");

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
    const payload: any = { id: appId };
    if (appType === "PAID") {
      if (
        !totalTester ||
        !totalDay ||
        !minimumAndroidVersion ||
        !rewardPoints
      ) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fill in all the required fields for paid apps.",
        });
        return;
      }
      payload.totalTester = Number(totalTester);
      payload.totalDay = Number(totalDay);
      payload.minimumAndroidVersion = parseFloat(minimumAndroidVersion);
      payload.rewardPoints = Number(rewardPoints);
    }
    acceptApp(payload);
  };

  // ─── Financial Calculations ──────────────────────────────────────────────
  const testers = Number(totalTester) || 0;
  const payoutPerTester = Number(rewardPoints) || 0;
  const totalPayout = testers * payoutPerTester;

  // Income: use persisted payment if available, otherwise use the known plan price
  const income = paymentInfo?.amountPaid ?? PLAN_PRICE_INR;
  const isIncomeKnown = paymentInfo?.isPersisted === true;
  const isIncomeEstimated = !isIncomeKnown;

  const profit = income - totalPayout;
  const profitMargin = income > 0 ? (profit / income) * 100 : 0;
  const profitPerTester = testers > 0 ? profit / testers : 0;
  const isLoss = profit < 0;
  const payoutExceedsIncome = totalPayout > income;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-[580px] rounded-3xl overflow-hidden p-0 gap-0 border-none shadow-2xl bg-white dark:bg-[#1A1A1A]">
        <div className="bg-green-500/5 p-6 border-b border-green-500/10">
          <DialogHeader>
            <DialogTitle className="text-green-600 flex items-center gap-2 text-xl font-bold">
              <CheckCircle2 className="w-6 h-6" />
              Approve Request
            </DialogTitle>
            <DialogDescription className="text-green-600/70">
              Set the testing parameters and review the financial summary.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {appType === "PAID" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="totalTester"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Total Paid Testers
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
                  Payout per Tester (₹)
                </Label>
                <Input
                  id="reward"
                  type="number"
                  placeholder="e.g. 30"
                  value={rewardPoints}
                  onChange={(e) => setRewardPoints(e.target.value)}
                  min="0"
                  className="h-11"
                />
              </div>
            </div>
          )}

          {appType === "PAID" && (
            <div className="mt-2 p-5 bg-secondary/30 rounded-2xl border border-border/50 space-y-4">
              <h4 className="text-sm font-bold flex items-center gap-2 text-primary">
                Financial Summary
                <span className="text-[10px] font-normal text-muted-foreground ml-1">
                  Professional Plan · ₹{PLAN_PRICE_INR.toLocaleString("en-IN")}{" "}
                  / cycle
                </span>
              </h4>

              <div className="space-y-2.5">
                {/* Income */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    Income from User:
                    {isIncomeKnown ? (
                      <span className="px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">
                        Confirmed
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/30 text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-tight">
                        Plan Price
                      </span>
                    )}
                  </span>
                  <span className="font-bold text-blue-600">
                    ₹{income.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Testers info row */}
                {testers > 0 && payoutPerTester > 0 && (
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>
                      {testers} tester{testers !== 1 ? "s" : ""} × ₹
                      {payoutPerTester.toLocaleString("en-IN")}
                    </span>
                    <span className="font-medium text-red-500">
                      -₹{totalPayout.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                {/* Total Payout */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    Total Payout (Expense):
                  </span>
                  <span className="font-bold text-red-500">
                    -₹{totalPayout.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Divider + Profit */}
                <div className="pt-2 border-t border-border flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold">Net Profit:</span>
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
                    <p
                      className={cn(
                        "text-xs font-medium",
                        profit >= 0 ? "text-green-600/70" : "text-red-600/70",
                      )}
                    >
                      {profitMargin.toFixed(1)}% margin
                    </p>
                  </div>
                </div>

                {/* Per-tester profit */}
                {testers > 0 && payoutPerTester > 0 && (
                  <div className="flex justify-between items-center text-xs text-muted-foreground border-t border-border/40 pt-2">
                    <span>Profit per tester slot:</span>
                    <span
                      className={cn(
                        "font-semibold",
                        profitPerTester >= 0
                          ? "text-green-600"
                          : "text-red-500",
                      )}
                    >
                      ₹{profitPerTester.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Max safe payout hint */}
                <div className="text-xs text-muted-foreground/70 pt-1">
                  {testers > 0
                    ? `Max breakeven payout: ₹${(income / testers).toFixed(2)}/tester`
                    : `Max budget: ₹${income.toLocaleString("en-IN")} across all testers`}
                </div>
              </div>

              {/* Loss warning */}
              {payoutExceedsIncome && (
                <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                    Total payout (₹{totalPayout.toLocaleString("en-IN")})
                    exceeds income (₹{income.toLocaleString("en-IN")}). Reduce
                    payout per tester or the number of testers to avoid a loss.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/20">
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
              Note: Approving this app will set it to "AVAILABLE" status. The
              app will automatically move to "IN TESTING" only after you
              manually add the required number of testers (
              {totalTester || "specified amount"}) via the "Manage Testers"
              option.
            </p>
          </div>
        </div>

        <DialogFooter className="p-6 bg-secondary/30 gap-3 border-t border-border/50">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-11 rounded-xl px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApprove}
            className="h-11 rounded-xl px-8 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"
            disabled={isAccepting}
          >
            {isAccepting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Confirm Approval"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
