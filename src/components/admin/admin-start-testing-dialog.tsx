"use client";

import { useUpdateProjectStatus } from "@/hooks/useAdmin";
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
import { Loader2, PlayCircle } from "lucide-react";

interface AdminStartTestingDialogProps {
  appId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AdminStartTestingDialog({
  appId,
  open,
  onOpenChange,
  onSuccess,
}: AdminStartTestingDialogProps) {
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateProjectStatus({
      onSuccess: () => {
        toast({
          title: "Status Updated",
          description: "The app testing phase has started successfully.",
        });
        onOpenChange(false);
        onSuccess?.();
      },
      onError: (err: any) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: err?.message || "Failed to update app status.",
        });
      },
    });

  const handleStartTesting = () => {
    updateStatus({ id: appId, status: "IN_TESTING" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-[480px] rounded-3xl overflow-hidden p-0 gap-0 border-none shadow-2xl bg-white dark:bg-[#1A1A1A]">
        <div className="bg-blue-500/5 p-6 border-b border-blue-500/10">
          <DialogHeader>
            <DialogTitle className="text-blue-600 flex items-center gap-2 text-xl font-bold">
              <PlayCircle className="w-6 h-6" />
              Start Testing Phase
            </DialogTitle>
            <DialogDescription className="text-blue-600/70">
              Begin the active testing period for this application.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            By starting the testing phase, the application will be marked as "IN
            TESTING". Testers assigned to this project will be able to see the
            instructions and begin testing.
          </p>
          <div className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/20">
            <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed font-medium">
              Note: Make sure you have assigned the required number of testers
              using the "Manage Testers" option before starting the testing
              phase.
            </p>
          </div>
        </div>

        <DialogFooter className="p-6 bg-secondary/30 gap-3 border-t border-border/50">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-11 rounded-xl px-6"
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleStartTesting}
            className="h-11 rounded-xl px-8 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Start Testing"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
