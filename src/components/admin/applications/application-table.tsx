import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Check, X } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ApplicationData {
  id: string;
  name: string;
  email: string;
  date?: string;
  experience?: string;
  expertise?: string[];
  status?: string;
  [key: string]: unknown;
}

export const SkeletonRow = () => (
  <TableRow>
    <TableCell className="font-medium">
      <Skeleton className="h-4 w-24" />
    </TableCell>
    <TableCell className="hidden sm:table-cell">
      <Skeleton className="h-4 w-32" />
    </TableCell>
    <TableCell className="hidden md:table-cell">
      <Skeleton className="h-4 w-20" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-16" />
    </TableCell>
    <TableCell>
      <div className="flex gap-1">
        <Skeleton className="h-5 w-14" />
        <Skeleton className="h-5 w-14" />
      </div>
    </TableCell>
    <TableCell className="text-right">
      <div className="flex gap-1 justify-end">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </TableCell>
  </TableRow>
);

export const ApplicationTable = ({
  applications,
  isLoading,
  onApprove,
  onReject,
}: {
  applications: ApplicationData[];
  isLoading: boolean;
  onApprove?: (appId: string) => void;
  onReject?: (appId: string, reason?: string) => void;
}) => {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleRejectClick = (appId: string) => {
    setRejectTargetId(appId);
    setRejectReason("");
    setRejectDialogOpen(true);
  };

  const confirmReject = () => {
    if (rejectTargetId && onReject) {
      onReject(rejectTargetId, rejectReason || undefined);
    }
    setRejectDialogOpen(false);
    setRejectTargetId(null);
    setRejectReason("");
  };

  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant</TableHead>
            <TableHead className="hidden sm:table-cell">Email</TableHead>
            <TableHead className="hidden md:table-cell">Submitted</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Expertise</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </TableBody>
      </Table>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No applications found.
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant</TableHead>
            <TableHead className="hidden sm:table-cell">Email</TableHead>
            <TableHead className="hidden md:table-cell">Submitted</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Expertise</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app: ApplicationData) => (
            <TableRow key={app.id}>
              <TableCell className="font-medium">{app.name}</TableCell>
              <TableCell className="hidden sm:table-cell">{app.email}</TableCell>
              <TableCell className="hidden md:table-cell">
                {app.date
                  ? new Date(app.date).toLocaleDateString()
                  : "—"}
              </TableCell>
              <TableCell>
                {app.experience ? (
                  <span className="capitalize">
                    {app.experience.replace(/_/g, " ").toLowerCase()}
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                {app.expertise && app.expertise.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {app.expertise.map((e: string) => (
                      <Badge key={e} variant="secondary">
                        {e}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  <Link href={`/admin/applications/${app.id}`}>
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

                  {app.status === "PENDING" && (
                    <>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30"
                        title="Approve"
                        onClick={() => onApprove?.(app.id)}
                      >
                        <Check className="h-4 w-4" />
                        <span className="sr-only">Approve</span>
                      </Button>

                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                        title="Reject"
                        onClick={() => handleRejectClick(app.id)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Reject</span>
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Optionally provide a reason for rejecting this application.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reject-reason">Reason (optional)</Label>
              <Textarea
                id="reject-reason"
                placeholder="Enter reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectTargetId(null);
                setRejectReason("");
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmReject}>
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApplicationTable;
