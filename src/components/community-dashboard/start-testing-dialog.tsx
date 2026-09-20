"use client";

import { useRequestStartTesting } from "@/hooks/useHub";
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
import {
  Loader2,
  PlayCircle,
  AlertTriangle,
  Handshake,
  Sparkles,
} from "lucide-react";

/** Minimum joined testers before a start request can be sent (L1 slot cap). */
export const START_REQUEST_MIN_TESTERS = 12;

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
  const { mutate: sendRequest, isPending: isSending } = useRequestStartTesting({
    onSuccess: () => {
      toast({
        title: "Request Sent",
        description:
          "Your request to start testing has been sent to admin for approval.",
      });
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (err: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.message || "Failed to send start request.",
      });
    },
  });

  const handleSendRequest = () => {
    sendRequest({ appId });
  };

  const testersJoined = currentTester || 0;
  const hasEnoughTesters = testersJoined >= START_REQUEST_MIN_TESTERS;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-[520px] rounded-3xl overflow-hidden p-0 gap-0 border-none shadow-2xl bg-white dark:bg-[#1A1A1A]">
        <div className="bg-emerald-500/5 p-6 border-b border-emerald-500/10">
          <DialogHeader>
            <DialogTitle className="text-emerald-600 flex items-center gap-2 text-xl font-bold">
              <PlayCircle className="w-6 h-6" />
              Request to Start Testing
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              This request will go to admin for approval. Testing starts only
              after admin approves.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-4">
          <ul className="space-y-2.5 text-sm text-foreground/80 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>
                Only request if you have completed all testers for your app,
                otherwise your request will be rejected.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Handshake className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
              <span>Get more testers by handshaking with more developers.</span>
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
              <span>
                For hassle free app testing choose inTesters Pro Testing.
              </span>
            </li>
          </ul>

          <div className="bg-secondary/40 rounded-xl px-4 py-3 border border-border/50">
            <p className="text-xs text-muted-foreground">
              Testers joined:{" "}
              <strong className="text-foreground">
                {testersJoined} out of {totalTester || 16}
              </strong>
            </p>
          </div>

          {!hasEnoughTesters && (
            <p className="text-xs font-medium text-red-600 dark:text-red-500 leading-relaxed">
              12 Handshake Required for Request to Start Testing if 12 testers
              not joined yet
            </p>
          )}

          {hasEnoughTesters && (
            <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
              <p className="text-xs leading-relaxed font-medium">
                Note: Your request will be sent to admin for approval. Once
                approved, the {totalTester || 16}-day testing period will begin.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 bg-secondary/30 gap-3 border-t border-border/50">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-11 rounded-xl px-6"
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendRequest}
            className="h-11 rounded-xl px-8 bg-emerald-500 hover:bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            disabled={isSending || !hasEnoughTesters}
            title={
              !hasEnoughTesters
                ? "12 Handshake Required for Request to Start Testing if 12 testers not joined yet"
                : undefined
            }
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Sending...
              </>
            ) : (
              "Send Request"
            )}
          </Button>
        </DialogFooter>

        {!hasEnoughTesters && (
          <div className="px-6 pb-5 -mt-2 bg-secondary/30">
            <p className="text-xs flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              You can send this request once 12 testers have joined your app.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
