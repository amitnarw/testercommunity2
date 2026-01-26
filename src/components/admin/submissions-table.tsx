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

interface SubmissionsTableProps {
  submissions: HubSubmittedAppResponse[];
  isLoading: boolean;
}

export function SubmissionsTable({
  submissions,
  isLoading,
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
            <TableHead>Type</TableHead>
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
                <TableCell>
                  <Skeleton className="h-5 w-16" />
                </TableCell>
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
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                No submissions found.
              </TableCell>
            </TableRow>
          ) : (
            submissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {submission.androidApp?.appLogoUrl ? (
                      <img
                        src={submission.androidApp.appLogoUrl}
                        alt=""
                        className="w-8 h-8 rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center">
                        <span className="text-xs">?</span>
                      </div>
                    )}
                    <span className="truncate max-w-[150px] sm:max-w-none">
                      {submission.androidApp?.appName ||
                        `App #${submission.appId}`}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {submission.appOwner?.name || submission.appOwnerId}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {submission.createdAt
                    ? format(new Date(submission.createdAt), "yyyy-MM-dd")
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      submission.appType === "PAID" ? "default" : "secondary"
                    }
                  >
                    {submission.appType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      submission.status === "REJECTED"
                        ? "destructive"
                        : "secondary"
                    }
                    className={
                      submission.status === "ACCEPTED" ||
                      submission.status === "AVAILABLE" ||
                      submission.status === "IN_TESTING" ||
                      submission.status === "COMPLETED"
                        ? "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                        : ""
                    }
                  >
                    {submission.status}
                  </Badge>
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
