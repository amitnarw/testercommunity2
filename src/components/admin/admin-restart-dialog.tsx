"use client";

import { useMutation } from "@tanstack/react-query";
import { adminRestartApp } from "@/lib/apiCalls";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, RotateCcw } from "lucide-react";

interface AdminRestartDialogProps {
  appId: number;
  appName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AdminRestartDialog({
  appId,
  appName,
  open,
  onOpenChange,
  onSuccess,
}: AdminRestartDialogProps) {
  const restartMutation = useMutation({
    mutationFn: () => adminRestartApp({ id: appId }),
    onSuccess: () => {
      toast({
        title: "Testing Reopened",
        description: "The campaign has been re-opened for testing.",
      });
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.message || "Failed to restart testing.",
      });
    },
  });

  const handleRestart = () => {
    restartMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-[480px] rounded-3xl overflow-hidden p-0 gap-0 border-none shadow-2xl bg-white dark:bg-[#1A1A1A]">
        <div className="bg-amber-500/5 p-6 border-b border-amber-500/10">
          <DialogHeader>
            <DialogTitle className="text-amber-600 flex items-center gap-2 text-xl font-bold">
              <RotateCcw className="w-6 h-6" />
              Reopen Testing
            </DialogTitle>
            <DialogDescription className="text-amber-600/70">
              Reopen this completed campaign for a new testing cycle.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Reopening will re-activate the testing phase for{" "}
            <span className="font-semibold text-foreground">
              {appName || "this campaign"}
            </span>
            . The clock will be reset, completed testers reactivated, and the
            owner will be notified.
          </p>
          <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 space-y-2">
            <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
              Status-only reset:
            </p>
            <ul className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed list-disc pl-4 space-y-1">
              <li>testing start/end dates re-stamped to now</li>
              <li>completed testers reactivated to in-progress</li>
              <li>previous progress kept as audit trail</li>
            </ul>
          </div>
          <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20">
            <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed font-medium">
              Note: This action will move the app back to active testing and
              notify the app owner.
            </p>
          </div>
        </div>

        <DialogFooter className="p-6 bg-secondary/30 gap-3 border-t border-border/50">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-11 rounded-xl px-6"
            disabled={restartMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRestart}
            className="h-11 rounded-xl px-8 bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20"
            disabled={restartMutation.isPending}
          >
            {restartMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reopen Testing
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
