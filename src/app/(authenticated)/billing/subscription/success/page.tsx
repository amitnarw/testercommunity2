"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ROUTES } from "@/lib/routes";
import {
  CheckCircle2,
  FileText,
  ArrowRight,
  ShieldCheck,
  Handshake,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { useSubscriptionStatus } from "@/hooks/useBilling";
import { Skeleton } from "@/components/ui/skeleton";

function SuccessContent() {
  const searchParams = useSearchParams();
  const subscriptionId = searchParams.get("subscriptionId");
  const invoiceNumber = searchParams.get("invoiceNumber");

  const { data: sub, isPending, isError } = useSubscriptionStatus(subscriptionId, false);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  if (isPending) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
        <Skeleton className="w-24 h-24 rounded-full mx-auto mb-8" />
        <Skeleton className="h-8 w-64 mx-auto mb-4" />
        <Skeleton className="h-4 w-96 mx-auto mb-8" />
        <Skeleton className="h-48 w-full rounded-[2rem] mb-8" />
      </div>
    );
  }

  const amount = sub?.latestPayment
    ? (sub.latestPayment.amount / 100).toLocaleString(undefined, { minimumFractionDigits: 0 })
    : "99";
  const currency = sub?.latestPayment?.currency || "INR";
  const planName = "Handshake Testing Subscription";
  const periodStart = sub?.currentPeriodStart
    ? new Date(sub.currentPeriodStart).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : null;
  const periodEnd = sub?.currentPeriodEnd
    ? new Date(sub.currentPeriodEnd).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : null;
  const displayInvoice = sub?.latestInvoice?.invoice_number || invoiceNumber;

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="text-center space-y-8"
      >
        <motion.div variants={itemVariants} className="flex justify-center">
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </motion.div>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-green-500/20"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-3">
          <h1 className="text-4xl font-black tracking-tight">Subscription Successful!</h1>
          <p className="text-muted-foreground text-lg">
            Your handshake testing subscription is now active. You can publish and test apps immediately.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-xl"
        >
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Plan</p>
                <p className="font-bold flex items-center gap-2">
                  <Handshake className="w-4 h-4 text-emerald-500" />
                  {planName}
                </p>
              </div>
              <div className="space-y-1 sm:text-right">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Amount</p>
                <p className="font-bold text-lg">{currency === "INR" ? "₹" : "$"}{amount}/month</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</p>
                <div className="flex items-center gap-2 text-green-500 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Active</span>
                </div>
              </div>
              {displayInvoice && (
                <div className="space-y-1 sm:text-right">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Invoice</p>
                  <p className="font-mono font-bold text-primary">{displayInvoice}</p>
                </div>
              )}
            </div>

            {(periodStart || periodEnd) && (
              <div className="pt-6 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium text-foreground">Current Billing Period</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {periodStart || "N/A"} — {periodEnd || "N/A"}
                </p>
              </div>
            )}

            {displayInvoice && (
              <div className="pt-6 border-t border-border flex justify-center">
                <Button variant="outline" size="sm" asChild className="rounded-full">
                  <Link href={`/invoice/${displayInvoice}`}>
                    <FileText className="w-4 h-4 mr-2" />
                    View Invoice
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button size="lg" className="rounded-full h-14 text-lg font-bold" asChild>
            <Link href={ROUTES.AUTHENTICATED.HANDSHAKE_TESTING}>
              <Handshake className="w-5 h-5 mr-2" />
              Go to Handshake Testing
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full h-14 text-lg font-bold" asChild>
            <Link href={ROUTES.AUTHENTICATED.SUBSCRIPTION_MANAGE}>
              Manage Subscription
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </motion.div>

        <motion.p variants={itemVariants} className="text-sm text-muted-foreground">
          Having issues?{" "}
          <Link href={ROUTES.PUBLIC.SUPPORT} className="text-primary hover:underline font-medium">
            Contact our billing support
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Subscription Success"
        backHref={ROUTES.AUTHENTICATED.BILLING}
        className="max-w-5xl mx-auto px-4"
      />
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
