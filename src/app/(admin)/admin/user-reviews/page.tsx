"use client";

import { useState, Suspense } from "react";
import { Search, Star, Eye, EyeOff, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useAllUserReviews, useUpdateUserReviewStatus, useDeleteUserReview } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";

function UserReviewsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const { toast } = useToast();

  const { data: reviews = [], isLoading, refetch } = useAllUserReviews(
    statusFilter !== "ALL" ? { status: statusFilter, search: searchQuery || undefined } : { search: searchQuery || undefined },
  );

  const updateStatusMutation = useUpdateUserReviewStatus({
    onSuccess: () => {
      toast({ title: "Success", description: "Review status updated" });
      refetch();
    },
    onError: (err: any) =>
      toast({ title: "Error", description: err.message || "Failed to update", variant: "destructive" }),
  });

  const deleteMutation = useDeleteUserReview({
    onSuccess: () => {
      toast({ title: "Success", description: "Review deleted" });
      refetch();
    },
    onError: (err: any) =>
      toast({ title: "Error", description: err.message || "Failed to delete", variant: "destructive" }),
  });

  const handleApprove = (id: number) => {
    updateStatusMutation.mutate({ id, status: "APPROVED", isPublished: true });
  };

  const handleReject = (id: number) => {
    updateStatusMutation.mutate({ id, status: "REJECTED", isPublished: false });
  };

  const handleTogglePublish = (id: number, currentPublished: boolean) => {
    updateStatusMutation.mutate({ id, isPublished: !currentPublished });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this review?")) {
      deleteMutation.mutate(id);
    }
  };

  const statusBadgeConfig: Record<string, { variant: "default" | "secondary" | "destructive"; className: string }> = {
    PENDING: { variant: "secondary", className: "bg-amber-500/20 text-amber-700 hover:bg-amber-500/30 border-amber-500/30" },
    APPROVED: { variant: "default", className: "bg-green-500/20 text-green-700 hover:bg-green-500/30 border-green-500/30" },
    REJECTED: { variant: "destructive", className: "" },
  };

  return (
    <div className="flex-1 space-y-6 container mx-auto px-4 md:px-6 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">
            User Reviews
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage reviews submitted by users and testers. Approve, reject, or publish them.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full md:w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
            >
              {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-md border overflow-hidden grid grid-cols-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead className="max-w-[250px]">Comment</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No reviews found.
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review: any) => {
                const cfg = statusBadgeConfig[review.status] || statusBadgeConfig.PENDING;
                return (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {review.user?.image && (
                          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted shrink-0">
                            <img src={review.user.image} alt={review.user.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <span className="font-medium text-sm truncate max-w-[120px]">{review.user?.name || "Unknown"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[250px] truncate">
                      &quot;{review.comment}&quot;
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">{review.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={cfg.variant} className={cn(cfg.className)}>
                        {review.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={review.isPublished ? "default" : "secondary"}
                        className={cn(
                          review.isPublished
                            ? "bg-green-500/20 text-green-700 hover:bg-green-500/30 border-green-500/30"
                            : "",
                        )}
                      >
                        {review.isPublished ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                      {format(new Date(review.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {review.status === "PENDING" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600 hover:text-green-700 hover:bg-green-500/10"
                              onClick={() => handleApprove(review.id)}
                              title="Approve & Publish"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700 hover:bg-red-500/10"
                              onClick={() => handleReject(review.id)}
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {review.status === "APPROVED" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              review.isPublished
                                ? "text-amber-600 hover:text-amber-700 hover:bg-amber-500/10"
                                : "text-green-600 hover:text-green-700 hover:bg-green-500/10",
                            )}
                            onClick={() => handleTogglePublish(review.id, review.isPublished)}
                            title={review.isPublished ? "Unpublish" : "Publish"}
                          >
                            {review.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(review.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function UserReviewsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <UserReviewsContent />
    </Suspense>
  );
}