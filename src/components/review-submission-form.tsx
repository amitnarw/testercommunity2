"use client";

import { useState } from "react";
import { Star, Send, Loader2, MessageSquare, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCreateReview } from "@/hooks/useReviews";
import { useToast } from "@/hooks/use-toast";

interface ReviewSubmissionFormProps {
  appId?: number;
  appName?: string;
  existingReview?: any;
  onSuccess?: () => void;
  showStatus?: boolean;
}

export function ReviewSubmissionForm({
  appId,
  appName,
  existingReview,
  onSuccess,
  showStatus = true,
}: ReviewSubmissionFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [submitted, setSubmitted] = useState(!!existingReview);
  const { toast } = useToast();

  const createMutation = useCreateReview({
    onSuccess: () => {
      toast({ title: "Success", description: "Review submitted!" });
      setSubmitted(true);
      onSuccess?.();
    },
    onError: (err: any) =>
      toast({
        title: "Error",
        description: err.message || "Failed to submit review",
        variant: "destructive",
      }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({ title: "Validation Error", description: "Please select a rating", variant: "destructive" });
      return;
    }
    if (!comment.trim()) {
      toast({ title: "Validation Error", description: "Please write a comment", variant: "destructive" });
      return;
    }
    createMutation.mutate({ rating, comment, appId });
  };

  if (submitted && !existingReview) {
    return (
      <Card className="border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-900/10">
        <CardContent className="flex items-center gap-3 pt-6">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
          <div>
            <p className="font-medium text-sm">Review Submitted</p>
            {showStatus && (
              <p className="text-xs text-muted-foreground">Your review is pending admin approval before it appears publicly.</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (existingReview) {
    const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
      PENDING: { label: "Pending Approval", color: "text-amber-600 dark:text-amber-400", icon: AlertCircle },
      APPROVED: { label: "Approved", color: "text-green-600 dark:text-green-400", icon: CheckCircle2 },
      REJECTED: { label: "Rejected", color: "text-red-600 dark:text-red-400", icon: AlertCircle },
    };
    const cfg = statusConfig[existingReview.status] || statusConfig.PENDING;
    const StatusIcon = cfg.icon;

    return (
      <Card className="border-green-200 dark:border-green-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Your Review
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "w-4 h-4",
                    star <= existingReview.rating
                      ? "fill-amber-400 text-amber-400"
                      : "fill-muted text-muted"
                  )}
                />
              ))}
            </div>
            {showStatus && (
              <span className={cn("text-xs font-medium flex items-center gap-1", cfg.color)}>
                <StatusIcon className="h-3.5 w-3.5" />
                {cfg.label}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">"{existingReview.comment}"</p>
          {existingReview.adminNote && showStatus && (
            <p className="text-xs bg-muted p-2 rounded-md">
              <span className="font-medium">Admin note:</span> {existingReview.adminNote}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Write a Review
        </CardTitle>
        <CardDescription className="text-xs">
          Share your experience{appName ? ` with ${appName}` : ""}. Your review will be published after admin approval.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 transition-colors hover:scale-110"
                >
                  <Star
                    className={cn(
                      "w-6 h-6 transition-colors",
                      star <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted-foreground"
                    )}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">{rating} / 5</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Your Review</label>
            <Textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
            />
          </div>

          <Button
            type="submit"
            className="gap-2"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Submit Review
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}