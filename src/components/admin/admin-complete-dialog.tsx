"use client";

import { useMutation } from "@tanstack/react-query";
import { adminCompleteApp } from "@/lib/apiCalls";
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
import { Loader2, CheckCircle2 } from "lucide-react";

interface AdminCompleteDialogProps {
  appId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AdminCompleteDialog({
  appId,
  open,
  onOpenChange,
  onSuccess,
}: AdminCompleteDialogProps) {
  const completeAppMutation = useMutation({
    mutationFn: () => adminCompleteApp({ id: appId }),
    onSuccess: () => {
      toast({
        title: "App Completed",
        description: "The application has been marked as completed successfully.",
      });
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.message || "Failed to mark app as completed.",
      });
    },
  });

  const handleComplete = () => {
    completeAppMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-[480px] rounded-3xl overflow-hidden p-0 gap-0 border-none shadow-2xl bg-white dark:bg-[#1A1A1A]">
        <div className="bg-emerald-500/5 p-6 border-b border-emerald-500/10">
          <DialogHeader>
            <DialogTitle className="text-emerald-600 flex items-center gap-2 text-xl font-bold">
              <CheckCircle2 className="w-6 h-6" />
              Complete Submission
            </DialogTitle>
            <DialogDescription className="text-emerald-600/70">
              Finalize this application and notify the owner.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            By marking this app as completed, you are confirming that all testing requirements have been met. This action will notify the app owner.
          </p>
          <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20">
            <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed font-medium">
              Note: This action is permanent and will move the app to the "COMPLETED" status.
            </p>
          </div>
        </div>

        <DialogFooter className="p-6 bg-secondary/30 gap-3 border-t border-border/50">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-11 rounded-xl px-6"
            disabled={completeAppMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleComplete}
            className="h-11 rounded-xl px-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
            disabled={completeAppMutation.isPending}
          >
            {completeAppMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Complete App"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
