"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Info, ArrowRight, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ComplianceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
}

export function ComplianceModal({
  open,
  onOpenChange,
  onContinue,
}: ComplianceModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-[500px] p-0 overflow-hidden border-none bg-zinc-50 dark:bg-zinc-950 rounded-[2rem] shadow-2xl">
        <div className="relative p-8 flex flex-col items-center text-center">
          {/* Decorative background */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <div className="w-20 h-20 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl flex items-center justify-center border border-zinc-100 dark:border-zinc-800 mx-auto">
              <ShieldCheck className="w-10 h-10 text-primary" />
            </div>

            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Compliance Required
              </DialogTitle>
              <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                To comply with Indian government regulations, we need your billing information before you can purchase any package.
              </DialogDescription>
            </div>

            <div className="bg-white/50 dark:bg-zinc-900/50 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 flex items-start gap-3 text-left">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                This information is required for tax purposes and will be used to generate your official GST/Tax invoice for this purchase.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Button
                onClick={onContinue}
                className="group bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-xl h-12 px-8 font-semibold shadow-lg transition-all"
              >
                <span>Fill Billing Info</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="rounded-xl h-12 text-zinc-500"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
