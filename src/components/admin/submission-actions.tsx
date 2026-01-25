"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Check, X, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { HubSubmittedAppResponse } from "@/lib/types";
import { useAcceptApp, useRejectApp } from "@/hooks/useAdmin";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SubmissionActionsProps {
  submission: HubSubmittedAppResponse;
}

export function SubmissionActions({ submission }: SubmissionActionsProps) {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const { mutate: acceptApp, isPending: isAccepting } = useAcceptApp({
    onSuccess: () => {
      toast({
        title: "App Approved",
        description: "The application has been successfully approved.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to approve application.",
      });
    },
  });

  const { mutate: rejectApp, isPending: isRejecting } = useRejectApp({
    onSuccess: () => {
      toast({
        title: "App Rejected",
        description: "The application has been rejected.",
      });
      setShowRejectDialog(false);
      setRejectReason("");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to reject application.",
      });
    },
  });

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast({
        variant: "destructive",
        title: "Reason Required",
        description: "Please provide a reason for rejection.",
      });
      return;
    }
    rejectApp({ id: submission.id, reason: rejectReason });
  };

  if (submission.status !== "IN_REVIEW") {
    return (
      <div className="flex items-center gap-2 justify-end">
        <Link href={`/admin/submissions/${submission.id}`}>
          <Button size="icon" variant="outline" className="h-8 w-8">
            <Eye className="h-4 w-4" />
            <span className="sr-only">View</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 justify-end">
      <Link href={`/admin/submissions/${submission.id}`}>
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title="View Details"
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">View</span>
        </Button>
      </Link>

      <Button
        size="icon"
        variant="outline"
        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30"
        onClick={() => acceptApp(submission.id)}
        disabled={isAccepting || isRejecting}
        title="Accept"
      >
        <Check className="h-4 w-4" />
        <span className="sr-only">Accept</span>
      </Button>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
            disabled={isAccepting || isRejecting}
            title="Reject"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Reject</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this application. This will
              be sent to the developer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                placeholder="E.g., App crashes, Policy violation..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
              disabled={isRejecting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isRejecting}
            >
              {isRejecting ? "Rejecting..." : "Reject App"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
