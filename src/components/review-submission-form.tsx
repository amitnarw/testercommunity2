"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, Loader2, Quote, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useCreateReview } from "@/hooks/useReviews";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

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
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [submitted, setSubmitted] = useState(!!existingReview);
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: session } = authClient.useSession();

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

  const displayRating = hoveredStar || rating;

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

  const cardClasses =
    "break-inside-avoid rounded-3xl p-6 md:p-8 shadow-sm border border-border/50 flex flex-col relative group overflow-hidden transition-all duration-300 bg-gradient-to-br from-background to-purple-50/50 dark:from-background dark:to-purple-900/10";

  const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
    PENDING: {
      label: "Pending Approval",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
      icon: AlertCircle,
    },
    APPROVED: {
      label: "Approved",
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-500/10 border-green-500/20",
      icon: CheckCircle2,
    },
    REJECTED: {
      label: "Rejected",
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-500/10 border-red-500/20",
      icon: AlertCircle,
    },
  };

  // ── SUCCESS STATE (brief, between form submit and refetch) ──
  if (submitted && !existingReview) {
    return (
      <motion.div
        key="success"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cardClasses}
      >
        <div className="absolute top-4 right-6 opacity-5">
          <Quote className="w-16 h-16 text-primary rotate-12" />
        </div>

        <div className="flex items-center gap-4 mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25"
          >
            <CheckCircle2 className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <p className="font-bold text-sm text-foreground">Review Submitted!</p>
            {showStatus && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Your review is pending admin approval before it appears publicly.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-border/50 mt-auto">
          <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-background shadow-md bg-muted">
            {session?.user?.image ? (
              <img src={session.user.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-bold">
                {session?.user?.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}
          </div>
          <span className="font-bold text-sm text-foreground truncate">{session?.user?.name || "You"}</span>
        </div>
      </motion.div>
    );
  }

  // ── EXISTING REVIEW STATE ──
  if (existingReview) {
    const cfg = statusConfig[existingReview.status] || statusConfig.PENDING;
    const StatusIcon = cfg.icon;
    const isLongComment = existingReview.comment?.length >= 100;

    return (
      <motion.div
        key="existing"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        whileHover={{ y: -4, scale: 1.01 }}
        className={cn(cardClasses, "hover:shadow-xl hover:border-primary/20")}
      >
        <div className="absolute top-4 right-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <Quote className="w-16 h-16 text-primary rotate-12" />
        </div>

        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.div
              key={star}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: star * 0.04, type: "spring", stiffness: 300 }}
            >
              <Star
                className={cn(
                  "w-4 h-4 drop-shadow-sm",
                  star <= existingReview.rating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted/40 text-muted-foreground/20",
                )}
              />
            </motion.div>
          ))}
        </div>

        <p
          className={cn(
            "text-muted-foreground leading-relaxed mb-6 font-medium relative z-10",
            isLongComment ? "text-sm md:text-base" : "text-lg md:text-xl",
          )}
        >
          &ldquo;{existingReview.comment}&rdquo;
        </p>

        {existingReview.adminNote && showStatus && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-start gap-2 bg-muted/50 p-3 rounded-lg border border-border/50 mb-6"
          >
            <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground/70">Admin note:</span> {existingReview.adminNote}
            </p>
          </motion.div>
        )}

        <div className="flex items-center gap-4 pt-4 border-t border-border/50 mt-auto">
          <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-background shadow-md bg-muted flex-shrink-0">
            {existingReview.user?.image ? (
              <img src={existingReview.user.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-bold">
                {existingReview.user?.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-bold text-sm text-foreground truncate">
              {existingReview.user?.name || "Anonymous"}
            </span>
            <div className="flex flex-col items-start gap-1">
              {showStatus ? (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className={cn(
                    "inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full border",
                    cfg.bg,
                    cfg.color,
                  )}
                >
                  <StatusIcon className="w-3 h-3" />
                  {cfg.label}
                </motion.span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full text-green-600 bg-green-500/10 dark:text-green-400 dark:bg-green-500/20">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Developer
                </span>
              )}
              {appName && (
                <span className="text-xs text-muted-foreground truncate">Developed {appName}</span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── FORM STATE ──
  return (
    <motion.div
      key="form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(cardClasses, "hover:shadow-xl hover:border-primary/20")}
    >
      <div className="absolute top-4 right-6 opacity-5 group-hover:opacity-10 transition-opacity">
        <Quote className="w-16 h-16 text-primary rotate-12" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        {/* Stars */}
        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              onClick={() => {
                setRating(star);
                setTimeout(() => textareaRef.current?.focus(), 150);
              }}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              className="p-0.5 -m-0.5 relative"
            >
              <Star
                className={cn(
                  "w-5 h-5 drop-shadow-sm transition-colors duration-200",
                  star <= displayRating
                    ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]"
                    : "fill-muted/30 text-muted-foreground/20",
                )}
              />
            </motion.button>
          ))}
        </div>

        {/* Rating label */}
        <AnimatePresence mode="wait">
          {displayRating > 0 && (
            <motion.p
              key={displayRating}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-4"
            >
              {RATING_LABELS[displayRating]} &mdash; {displayRating}/5
            </motion.p>
          )}
        </AnimatePresence>

        {/* Textarea */}
        <div className="mb-6">
          <Textarea
            ref={textareaRef}
            rows={3}
            value={comment}
            onChange={(e) => {
              if (e.target.value.length <= 500) setComment(e.target.value);
            }}
            placeholder={
              rating > 0
                ? `Tell us why you gave it ${RATING_LABELS[rating]?.toLowerCase() || rating}/5...`
                : "Tap a star above, then share your thoughts..."
            }
            className="resize-none text-sm transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/30"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 pt-4 border-t border-border/50 mt-auto">
          <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-background shadow-md bg-muted flex-shrink-0">
            {session?.user?.image ? (
              <img src={session.user.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-bold">
                {session?.user?.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-bold text-sm text-foreground truncate block">
              {session?.user?.name || "You"}
            </span>
            <span className="text-xs text-muted-foreground">
              {showStatus ? "Your review needs admin approval" : "App Developer"}
            </span>
          </div>
          <Button
            type="submit"
            disabled={createMutation.isPending || rating === 0}
            className={cn(
              "relative h-9 px-4 rounded-xl text-sm font-semibold flex-shrink-0 transition-all duration-300",
              "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary",
              "shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30",
              "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none",
            )}
          >
            {createMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
