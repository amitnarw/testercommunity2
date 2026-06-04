"use client";

import { useStartHubAppTesting } from "@/hooks/useHub";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, PlayCircle, AlertTriangle } from "lucide-react";

interface StartTestingDialogProps {
  appId: number | string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  currentTester: number;
  totalTester: number;
}

export function StartTestingDialog({
  appId,
  open,
  onOpenChange,
  onSuccess,
  currentTester,
  totalTester,
}: StartTestingDialogProps) {
  const { toast } = useToast();
  const { mutate: startTesting, isPending: isStarting } =
    useStartHubAppTesting({
      onSuccess: () => {
        toast({
          title: "Testing Started",
          description: "Your app testing phase has started successfully.",
        });
        onOpenChange(false);
        onSuccess?.();
      },
      onError: (err: any) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: err?.message || "Failed to start testing.",
        });
      },
    });

  const handleStartTesting = () => {
    startTesting({ appId });
  };

  const showWarning = currentTester < totalTester;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-[480px] rounded-3xl overflow-hidden p-0 gap-0 border-none shadow-2xl bg-white dark:bg-[#1A1A1A]">
        <div className="bg-primary/5 p-6 border-b border-primary/10">
          <DialogHeader>
            <DialogTitle className="text-primary flex items-center gap-2 text-xl font-bold">
              <PlayCircle className="w-6 h-6" />
              Start Testing Phase
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Begin the active testing period for your application.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            By starting the testing phase, the application will be marked as "IN
            TESTING". Testers joined to this project will be able to see the
            instructions and begin testing.
          </p>

          {showWarning ? (
            <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 text-amber-700 dark:text-amber-400">
              <p className="text-sm font-semibold flex items-center gap-1.5 mb-1 text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0" /> Warning: Cohort Incomplete
              </p>
              <p className="text-xs leading-relaxed">
                The target number of testers has not been reached (<strong>{currentTester}</strong> joined out of <strong>{totalTester}</strong> required). Starting the test now will lock this cohort and start the 14-day duration immediately. Do you still want to proceed?
              </p>
            </div>
          ) : (
            <div className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/20">
              <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed font-medium">
                Note: Starting the testing phase will lock the tester cohort and start the duration of testing.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 bg-secondary/30 gap-3 border-t border-border/50">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-11 rounded-xl px-6"
            disabled={isStarting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleStartTesting}
            className="h-11 rounded-xl px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
            disabled={isStarting}
          >
            {isStarting ? (
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
