"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MailWarning } from "lucide-react";
import { LoadingButton } from "../ui/loading-button";

interface NotVerifiedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResend: () => void;
  resendIsPending: boolean;
  resendIsSuccess: boolean;
  resendIsError: boolean;
}

export function NotVerifiedDialog({
  open,
  onOpenChange,
  onResend,
  resendIsPending,
  resendIsSuccess,
  resendIsError,
}: NotVerifiedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/50 mb-4">
            <MailWarning className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <DialogTitle className="text-center text-red-500">
            Email Not Verified
          </DialogTitle>
          <DialogDescription className="text-center">
            Your email address has not been verified yet. Please check your
            inbox (and spam folder) for the verification link.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 !items-center !justify-center mt-4">
          <LoadingButton
            isLoading={resendIsPending}
            isSuccess={resendIsSuccess}
            isError={resendIsError}
            className="text-sm sm:text-base"
            onClick={onResend}
          >
            Resend Verification Email
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
