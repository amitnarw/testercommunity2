"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ROUTES } from "@/lib/routes";
import { 
  CheckCircle2, 
  FileText, 
  Wallet, 
  ArrowRight, 
  ShieldCheck, 
  Package,
  ExternalLink,
  Printer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const orderId = searchParams.get("orderId");
  const invoiceId = searchParams.get("invoiceId");

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="text-center space-y-8"
      >
        {/* Success Icon */}
        <motion.div 
          variants={itemVariants}
          className="flex justify-center"
        >
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

        {/* Title & Description */}
        <motion.div variants={itemVariants} className="space-y-3">
          <h1 className="text-4xl font-black tracking-tight">Payment Successful!</h1>
          <p className="text-muted-foreground text-lg">
            Thank you for your purchase. Your account has been credited with the new testing packages.
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div 
          variants={itemVariants}
          className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-xl"
        >
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Invoice Number</p>
                <p className="font-mono font-bold text-primary">{invoiceId || "N/A"}</p>
              </div>
              <div className="space-y-1 sm:text-right">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Payment ID</p>
                <p className="font-mono text-sm">{paymentId || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</p>
                <div className="flex items-center gap-2 text-green-500 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified</span>
                </div>
              </div>
              <div className="space-y-1 sm:text-right">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Package Type</p>
                <p className="font-bold">Professional Testing</p>
              </div>
            </div>

            <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold">Testing Credits Added</p>
                    <p className="text-xs text-muted-foreground">Ready to use in dashboard</p>
                  </div>
               </div>
               {invoiceId && (
                 <Button variant="outline" size="sm" asChild className="rounded-full">
                    <Link href={`/invoice/${invoiceId}`}>
                      <FileText className="w-4 h-4 mr-2" />
                      View Invoice
                    </Link>
                 </Button>
               )}
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button size="lg" className="rounded-full h-14 text-lg font-bold" asChild>
            <Link href={ROUTES.AUTHENTICATED.WALLET}>
              <Wallet className="w-5 h-5 mr-2" />
              Go to Wallet
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full h-14 text-lg font-bold" asChild>
            <Link href={ROUTES.AUTHENTICATED.FREE_TESTING}>
              Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </motion.div>

        {/* Need Help */}
        <motion.p variants={itemVariants} className="text-sm text-muted-foreground">
          Having issues? <Link href={ROUTES.PUBLIC.SUPPORT} className="text-primary hover:underline font-medium">Contact our billing support</Link>
        </motion.p>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen">
      <PageHeader title="Purchase Success" backHref={ROUTES.AUTHENTICATED.BILLING} className="max-w-5xl mx-auto px-4" />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
