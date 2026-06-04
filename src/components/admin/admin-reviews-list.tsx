"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReviewResponse } from "@/lib/types";
import { useUpdateUserReviewStatus } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";

interface AdminReviewsListProps {
  reviews?: ReviewResponse[];
  appOwnerId?: string;
  onRefetch?: () => void;
}

export function AdminReviewsList({ reviews, appOwnerId, onRefetch }: AdminReviewsListProps) {
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const { toast } = useToast();

  const { mutate: updateReviewStatus } = useUpdateUserReviewStatus({
    onSuccess: () => {
      toast({ title: "Success", description: "Review status updated successfully." });
      onRefetch?.();
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message || "Failed to update review status.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setUpdatingId(null);
    },
  });

  const handleStatusUpdate = (reviewId: number, newStatus: "APPROVED" | "REJECTED") => {
    setUpdatingId(reviewId);
    updateReviewStatus({
      id: reviewId,
      status: newStatus,
      isPublished: newStatus === "APPROVED",
    });
  };

  if (!reviews || reviews.length === 0) return null;

  const developerReviews = reviews.filter((r) => r.userId === appOwnerId);
  const testerReviews = reviews.filter((r) => r.userId !== appOwnerId);

  if (developerReviews.length === 0 && testerReviews.length === 0) return null;

  const statusBadgeConfig: Record<
    string,
    { variant: "default" | "secondary" | "destructive"; className: string }
  > = {
    PENDING: {
      variant: "secondary",
      className:
        "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    },
    APPROVED: {
      variant: "default",
      className:
        "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    },
    REJECTED: { variant: "destructive", className: "" },
  };

  const renderReviews = (list: ReviewResponse[], showActions: boolean) => {
    return (
      <div className="divide-y divide-border/50">
        {list.map((review) => {
          const cfg = statusBadgeConfig[review.status] || statusBadgeConfig.PENDING;
          const isPending = review.status === "PENDING";
          const isUpdating = updatingId === review.id;

          return (
            <div key={review.id} className="py-5 first:pt-0 last:pb-0 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {review.user?.image ? (
                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-muted border border-border">
                      <img
                        src={review.user.image}
                        alt={review.user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary border border-border">
                      {review.user?.name?.slice(0, 2).toUpperCase() || "UN"}
                    </div>
                  )}
                  <div>
                    <span className="font-semibold text-sm block">
                      {review.user?.name || "Unknown"}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "w-3.5 h-3.5",
                          star <= review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-muted text-muted"
                        )}
                      />
                    ))}
                  </div>
                  <Badge variant={cfg.variant} className={cn("font-bold", cfg.className)}>
                    {review.status}
                  </Badge>

                  {showActions && isPending && (
                    <div className="flex items-center gap-1.5 ml-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7 rounded-lg border-green-500/30 hover:border-green-500 hover:bg-green-500/10 text-green-600 dark:text-green-400 hover:text-green-600 transition-colors"
                        onClick={() => handleStatusUpdate(review.id, "APPROVED")}
                        disabled={updatingId !== null}
                        title="Approve Review"
                      >
                        {isUpdating ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7 rounded-lg border-red-500/30 hover:border-red-500 hover:bg-red-500/10 text-red-600 dark:text-red-400 hover:text-red-600 transition-colors"
                        onClick={() => handleStatusUpdate(review.id, "REJECTED")}
                        disabled={updatingId !== null}
                        title="Reject Review"
                      >
                        {isUpdating ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <X className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed pl-12 italic">
                "{review.comment}"
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {developerReviews.length > 0 && (
        <Card className="border border-border/50 shadow-sm bg-card rounded-3xl overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-border/50 pb-4">
            <CardTitle className="text-lg flex items-center gap-2 text-primary">
              <Star className="w-5 h-5 fill-indigo-500 text-indigo-500" />
              Developer Review &amp; Rating
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {renderReviews(developerReviews, true)}
          </CardContent>
        </Card>
      )}

      {testerReviews.length > 0 && (
        <Card className="border border-border/50 shadow-sm bg-card rounded-3xl overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-border/50 pb-4">
            <CardTitle className="text-lg flex items-center gap-2 text-primary">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              Tester Reviews &amp; Ratings ({testerReviews.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {renderReviews(testerReviews, true)}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
