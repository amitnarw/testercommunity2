"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { HubSubmittedAppResponse } from "@/lib/types";
import { format } from "date-fns";
import { SubmissionActions } from "./submission-actions";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface SubmissionsTableProps {
  submissions: HubSubmittedAppResponse[];
  isLoading: boolean;
  showAppType?: boolean;
}

// Status Badge Component with clear visual distinction
function StatusBadge({ status }: { status: string }) {
  const getStatusStyles = () => {
    switch (status) {
      case "ACCEPTED":
      case "AVAILABLE":
      case "IN_TESTING":
      case "COMPLETED":
        return "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/30";
      case "REJECTED":
        return "bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-500/30";
      case "IN_REVIEW":
        return "bg-amber-500/20 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-500/30";
      case "DRAFT":
        return "bg-gray-500/20 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400 border-gray-500/30";
      case "ON_HOLD":
        return "bg-purple-500/20 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-500/30";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn("font-medium border", getStatusStyles())}
    >
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function SubmissionsTable({
  submissions,
  isLoading,
  showAppType = true,
}: SubmissionsTableProps) {
  return (
    <div className="rounded-md border grid grid-cols-1">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Application</TableHead>
            <TableHead className="hidden sm:table-cell">Developer</TableHead>
            <TableHead className="hidden md:table-cell">
              Submission Date
            </TableHead>
            {showAppType && <TableHead>Type</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-8 h-8 rounded-md" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                {showAppType && (
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                )}
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-8 ml-auto rounded-md" />
                </TableCell>
              </TableRow>
            ))
          ) : submissions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={showAppType ? 6 : 5}
                className="text-center py-8 text-muted-foreground"
              >
                No submissions found.
              </TableCell>
            </TableRow>
          ) : (
            submissions.map((submission) => (
              <TableRow key={submission.id} className="group">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    {submission.androidApp?.appLogoUrl ? (
                      <Image
                        src={submission.androidApp.appLogoUrl}
                        alt=""
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-lg object-cover ring-1 ring-border"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center ring-1 ring-border">
                        <span className="text-xs text-muted-foreground">?</span>
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="truncate text-xs md:text-sm max-w-[150px] sm:max-w-none font-medium">
                        {submission.androidApp?.appName ||
                          `App #${submission.appId}`}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span className="text-muted-foreground">
                    {submission.appOwner?.name || submission.appOwnerId}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="text-muted-foreground">
                    {submission.createdAt
                      ? format(new Date(submission.createdAt), "yyyy-MM-dd")
                      : "N/A"}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={submission.status} />
                </TableCell>
                <TableCell className="text-right">
                  <SubmissionActions submission={submission} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
