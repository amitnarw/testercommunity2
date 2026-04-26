"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface InsufficientPackagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBalance: number;
  requiredPackages?: number;
  onGoToBilling?: () => void;
  onGoToWallet?: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 180, damping: 18 },
  },
};

export function InsufficientPackagesDialog({
  open,
  onOpenChange,
  currentBalance,
  requiredPackages = 1,
  onGoToBilling,
  onGoToWallet,
}: InsufficientPackagesDialogProps) {
  const handleBillingAction = () => {
    if (onGoToBilling) {
      onGoToBilling();
    } else {
      window.location.href = "/billing";
    }
    onOpenChange(false);
  };

  const handleWalletAction = () => {
    if (onGoToWallet) {
      onGoToWallet();
    } else {
      window.location.href = "/wallet";
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full rounded-3xl p-0 overflow-hidden border-none shadow-2xl bg-transparent">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-background rounded-3xl shadow-2xl overflow-hidden w-full"
        >
          <div className="relative p-8 flex flex-col items-center text-center">
            {/* Decorative gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-destructive/5 via-transparent to-transparent" />

            {/* Animated Warning Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6 ring-8 ring-destructive/10"
            >
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </motion.div>

            {/* Title */}
            <motion.h2
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="text-2xl font-bold tracking-tight text-foreground mb-6"
            >
              Insufficient Packages
            </motion.h2>

            {/* Balance Card */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="w-full p-5 rounded-2xl bg-gradient-to-br from-muted/50 via-muted/30 to-muted/20 border border-border/50 mb-5"
            >
              <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                Your Current Balance
              </p>
              <div className="flex items-center justify-center gap-3">
                <Package className="w-6 h-6 text-muted-foreground" />
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.3 }}
                  className="text-4xl font-bold text-foreground"
                >
                  {currentBalance}
                </motion.span>
                <span className="text-muted-foreground text-sm">packages</span>
              </div>
            </motion.div>

            {/* Explanation */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="mb-8"
            >
              <p className="text-muted-foreground text-sm">
                You need{" "}
                <span className="font-semibold text-foreground">
                  {requiredPackages}
                </span>{" "}
                package{requiredPackages !== 1 ? "s" : ""} to submit an app for
                testing.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="w-full space-y-3"
            >
              <Button
                size="lg"
                className="w-full py-3 bg-destructive hover:bg-destructive/90 text-white font-semibold rounded-xl shadow-lg shadow-destructive/25 transition-all duration-300 hover:shadow-destructive/40"
                onClick={handleBillingAction}
              >
                Purchase Packages
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full py-3 rounded-xl border-border/60 hover:bg-secondary/50 hover:border-border transition-all duration-300"
                onClick={handleWalletAction}
              >
                View Wallet
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}