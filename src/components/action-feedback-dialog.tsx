"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ActionFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: "success" | "error";
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ActionFeedbackDialog({
  open,
  onOpenChange,
  status,
  title,
  description,
  actionLabel = "Continue",
  onAction,
}: ActionFeedbackDialogProps) {
  const isSuccess = status === "success";

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full rounded-3xl p-0 overflow-hidden border-none bg-transparent shadow-none">
        <div className="bg-background rounded-3xl shadow-2xl overflow-hidden w-full">
          <div className="relative p-8 flex flex-col items-center text-center">
            {/* Confetti / Decoration Background for Success */}
            {isSuccess && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-70" />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="absolute top-10 left-10 w-2 h-2 rounded-full bg-emerald-400"
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute top-20 right-20 w-3 h-3 rounded-full bg-blue-400"
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="absolute bottom-20 left-20 w-2 h-2 rounded-full bg-purple-400"
                />
              </div>
            )}

            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.1,
              }}
              className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ring-8 ${
                isSuccess
                  ? "bg-emerald-100 dark:bg-emerald-900/30 ring-emerald-50 dark:ring-emerald-900/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-100 dark:bg-red-900/30 ring-red-50 dark:ring-red-900/10 text-red-600 dark:text-red-400"
              }`}
            >
              {isSuccess ? (
                <CheckCircle2 className="w-10 h-10" />
              ) : (
                <XCircle className="w-10 h-10" />
              )}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold tracking-tight text-foreground mb-3"
            >
              {title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground mb-8 max-w-sm text-sm"
            >
              {description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full"
            >
              <Button
                size="lg"
                className={`w-full py-3 ${!isSuccess ? "bg-red-600 hover:bg-red-700 text-white" : ""}`}
                onClick={handleAction}
              >
                {actionLabel}
              </Button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
