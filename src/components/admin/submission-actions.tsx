"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Check, X } from "lucide-react";
import Link from "next/link";
import { HubSubmittedAppResponse } from "@/lib/types";
import { AdminRejectDialog } from "./admin-reject-dialog";
import { AdminAcceptDialog } from "./admin-accept-dialog";
import { useQueryClient } from "@tanstack/react-query";

interface SubmissionActionsProps {
  submission: HubSubmittedAppResponse;
}

export function SubmissionActions({ submission }: SubmissionActionsProps) {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const queryClient = useQueryClient();

  // Refresh list on success
  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["useSubmittedApps"] });
    queryClient.invalidateQueries({ queryKey: ["useSubmittedAppsCount"] });
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
        onClick={() => setShowAcceptDialog(true)}
        title="Accept"
      >
        <Check className="h-4 w-4" />
        <span className="sr-only">Accept</span>
      </Button>

      <Button
        size="icon"
        variant="outline"
        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
        onClick={() => setShowRejectDialog(true)}
        title="Reject"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Reject</span>
      </Button>

      <AdminRejectDialog
        appId={submission.id}
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        onSuccess={onSuccess}
      />

      <AdminAcceptDialog
        appId={submission.id}
        open={showAcceptDialog}
        onOpenChange={setShowAcceptDialog}
        onSuccess={onSuccess}
      />
    </div>
  );
}
