"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  Handshake,
  Calendar,
  CreditCard,
  FileText,
  ShieldCheck,
  ArrowRight,
  Loader2,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/lib/routes";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  getMyHandshakeSubscription,
  cancelHandshakeSubscription,
  getBillingHistory,
  syncSubscriptionPayments,
} from "@/lib/apiCalls";
import { useBillingHistory } from "@/hooks/useBilling";

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30",
  AUTHENTICATED: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  CANCELLED: "bg-red-500/20 text-red-600 border-red-500/30",
  HALTED: "bg-amber-500/20 text-amber-600 border-amber-500/30",
  PENDING: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
  COMPLETED: "bg-gray-500/20 text-gray-600 border-gray-500/30",
  EXPIRED: "bg-gray-500/20 text-gray-600 border-gray-500/30",
  CREATED: "bg-blue-500/20 text-blue-600 border-blue-500/30",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function SubscriptionManagePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const { data: sub, isLoading } = useQuery({
    queryKey: ["myHandshakeSubscription"],
    queryFn: () => getMyHandshakeSubscription(),
    retry: false,
  });

  const { data: billingHistory, isPending: historyLoading } = useBillingHistory();

  const syncMutation = useMutation({
    mutationFn: () => syncSubscriptionPayments(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myHandshakeSubscription"] });
      queryClient.invalidateQueries({ queryKey: ["getBillingHistory"] });
    },
  });

  const hasActiveSubscription =
    !!sub && (sub.status === "ACTIVE" || sub.status === "AUTHENTICATED");
  const subscriptionPayments = (billingHistory || []).filter(
    (item) => item.type === "SUBSCRIPTION",
  );

  const renewalDate = sub?.currentPeriodEnd
    ? new Date(sub.currentPeriodEnd).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const periodStart = sub?.currentPeriodStart
    ? new Date(sub.currentPeriodStart).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const handleCancel = async () => {
    if (!sub?.id) return;
    setCancelling(true);
    setCancelError(null);
    try {
      await cancelHandshakeSubscription(sub.id);
      queryClient.invalidateQueries({ queryKey: ["myHandshakeSubscription"] });
      queryClient.invalidateQueries({ queryKey: ["getBillingHistory"] });
      setShowCancelDialog(false);
    } catch (e: any) {
      setCancelError(e?.message || "Failed to cancel subscription.");
    } finally {
      setCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <PageHeader title="Subscription" backHref={ROUTES.AUTHENTICATED.BILLING} className="max-w-5xl mx-auto px-4" />
        <div className="container mx-auto px-4 py-12 max-w-3xl space-y-6">
          <Skeleton className="h-48 w-full rounded-[2rem]" />
          <Skeleton className="h-64 w-full rounded-[2rem]" />
        </div>
      </div>
    );
  }

  if (!sub) {
    return (
      <div className="min-h-screen">
        <PageHeader title="Subscription" backHref={ROUTES.AUTHENTICATED.BILLING} className="max-w-5xl mx-auto px-4" />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
              <Handshake className="w-10 h-10 text-muted-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">No Subscription Found</h1>
          <p className="text-muted-foreground mb-8">
            You don&apos;t have an active handshake testing subscription.
          </p>
          <Button asChild className="rounded-full">
            <Link href={ROUTES.AUTHENTICATED.BILLING}>
              View Plans
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader title="Subscription" backHref={ROUTES.AUTHENTICATED.BILLING} className="max-w-5xl mx-auto px-4" />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          {/* Status Card */}
          <motion.div
            variants={itemVariants}
            className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-xl"
          >
            <div className="p-8 space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                    <Handshake className="w-7 h-7 text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Handshake Testing Subscription</h2>
                    <p className="text-sm text-muted-foreground">₹99/month</p>
                  </div>
                </div>
                <Badge
                  className={`text-sm px-4 py-1.5 rounded-full ${
                    statusColors[sub.status] || "bg-gray-500/20 text-gray-600"
                  }`}
                >
                  {sub.status === "AUTHENTICATED" ? "ACTIVE" : sub.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-border">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Paid Cycles
                  </p>
                  <p className="font-bold text-lg">{sub.paidCount || 0}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Current Period Start
                  </p>
                  <p className="font-medium">{periodStart || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    {hasActiveSubscription ? "Renewal Date" : "Period End"}
                  </p>
                  <p className="font-medium">{renewalDate || "—"}</p>
                </div>
              </div>

              {hasActiveSubscription && (
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    <span>
                      Next renewal on <strong className="text-foreground">{renewalDate}</strong>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Payment History */}
          <motion.div
            variants={itemVariants}
            className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-xl"
          >
            <div className="p-6 border-b border-border flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Payment History</h3>
                <p className="text-sm text-muted-foreground">
                  Recent subscription charges
                </p>
              </div>
            </div>

            <div className="p-2 max-h-[300px] overflow-y-auto">
              {historyLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading payments...
                </div>
              ) : subscriptionPayments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No payments recorded yet. Your first payment will appear here after the subscription activates.
                </div>
              ) : (
                <>
                  {subscriptionPayments.map((p, i) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {p.currency === "INR" ? "₹" : p.currency}
                            {p.amount.toLocaleString(undefined, {
                              minimumFractionDigits: 0,
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(p.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="secondary"
                          className="bg-green-500/10 text-green-600 border-0"
                        >
                          Paid
                        </Badge>
                        {p.invoiceId && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs text-primary"
                            asChild
                          >
                            <Link href={`/invoice/${p.invoiceId}`}>
                              <FileText className="w-3 h-3 mr-1" />
                              Invoice
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Sync Button */}
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => syncMutation.mutate()}
                      disabled={syncMutation.isPending}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary/50 hover:bg-secondary/80 transition-all text-sm font-medium text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {syncMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                      {syncMutation.isPending ? "Syncing..." : "Sync from Razorpay"}
                      {syncMutation.isError && (
                        <AlertTriangle className="w-4 h-4 text-amber-500 ml-1" />
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Cancel Section */}
          <motion.div variants={itemVariants}>
            {hasActiveSubscription ? (
              <div className="bg-card border border-red-500/20 rounded-[2rem] overflow-hidden shadow-xl">
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Cancel Subscription</h3>
                      <p className="text-sm text-muted-foreground">
                        Once cancelled, you will lose access to handshake testing features at the end of the current billing period.
                        Your apps will remain but won&apos;t accept new handshake requests.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-full border-red-500/30 text-red-600 hover:bg-red-500/10 hover:text-red-700"
                    onClick={() => setShowCancelDialog(true)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel Subscription
                  </Button>
                </div>
              </div>
            ) : sub.status === "CANCELLED" ? (
              <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-xl">
                <div className="p-6 flex items-center gap-4">
                  <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center shrink-0">
                    <XCircle className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Subscription Cancelled</h3>
                    <p className="text-sm text-muted-foreground">
                      Your subscription has been cancelled. You can resubscribe anytime from the billing page.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <Button size="lg" className="rounded-full h-14 text-lg font-bold" asChild>
              <Link href={ROUTES.AUTHENTICATED.HANDSHAKE_TESTING}>
                <Handshake className="w-5 h-5 mr-2" />
                Go to Handshake Testing
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full h-14 text-lg font-bold"
              asChild
            >
              <Link href={ROUTES.AUTHENTICATED.BILLING}>
                Billing
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Cancel Subscription
            </DialogTitle>
            <DialogDescription className="pt-2 space-y-3">
              <p>
                Are you sure you want to cancel your Handshake Testing subscription?
              </p>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm">
                <p className="font-medium text-amber-700 dark:text-amber-400 mb-1">
                  What happens when you cancel?
                </p>
                <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                  <li>Your subscription will not renew</li>
                  <li>You keep access until the end of the current billing period</li>
                  <li>Your published apps and ongoing tests remain accessible</li>
                  <li>You can resubscribe anytime</li>
                </ul>
              </div>
              {cancelError && (
                <p className="text-sm text-red-500">{cancelError}</p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setShowCancelDialog(false);
                setCancelError(null);
              }}
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Yes, Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}