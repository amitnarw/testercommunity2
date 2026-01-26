"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAcceptApp } from "@/hooks/useAdmin";

interface AdminAcceptDialogProps {
  appId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AdminAcceptDialog({
  appId,
  open,
  onOpenChange,
  onSuccess,
}: AdminAcceptDialogProps) {
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
    acceptApp(appId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-[500px] rounded-3xl overflow-hidden p-0 gap-0 border-none shadow-2xl bg-white dark:bg-[#1A1A1A]">
        <div className="bg-green-500/5 p-6 border-b border-green-500/10">
          <DialogHeader>
            <DialogTitle className="text-green-600 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Approve Request
            </DialogTitle>
            <DialogDescription className="text-green-600/70">
              Are you sure you want to approve this application?
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-6">
          <p className="text-muted-foreground leading-relaxed">
            By approving this application, you confirm that it meets all the
            necessary requirements and guidelines. The application will be
            marked as "Approved" and will proceed to the next stage.
          </p>
        </div>

        <DialogFooter className="p-6 pt-2 bg-transparent gap-3">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-11 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApprove}
            className="h-11 rounded-lg px-6 bg-gradient-to-br from-green-500 to-green-500/50 hover:from-green-500 hover:to-emerald-600 text-white shadow-lg hover:shadow-green-500/40"
            disabled={isAccepting}
          >
            {isAccepting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Approving...
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
