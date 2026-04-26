"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SafeImage } from "@/components/safe-image";
import { useBlogFormContext } from "./useBlogForm";
import { format } from "date-fns";

interface PreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PreviewModal({ open, onOpenChange }: PreviewModalProps) {
  const { form, isNew } = useBlogFormContext();
  const blog = form.getValues();

  const watchTitle = form.watch("title");
  const watchExcerpt = form.watch("excerpt");
  const watchContent = form.watch("content");
  const watchImageUrl = form.watch("imageUrl");
  const watchAuthorName = form.watch("authorName");
  const watchAuthorAvatarUrl = form.watch("authorAvatarUrl");
  const currentTags = form.watch("tags") || [];
  const watchIsActive = form.watch("isActive");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Preview: {watchTitle || "Untitled"}</span>
            <Badge variant={watchIsActive ? "default" : "secondary"}>
              {watchIsActive ? "Published" : "Draft"}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Featured Image */}
          {watchImageUrl && (
            <div className="relative aspect-video w-full rounded-lg overflow-hidden">
              <SafeImage
                src={watchImageUrl}
                alt={watchTitle}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold">{watchTitle || "Untitled"}</h1>

          {/* Author & Date */}
          <div className="flex items-center gap-4 text-muted-foreground">
            {watchAuthorAvatarUrl && (
              <Avatar className="h-10 w-10">
                <AvatarImage src={watchAuthorAvatarUrl} />
                <AvatarFallback>
                  {watchAuthorName?.slice(0, 2)?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
            )}
            <div>
              <p className="font-medium text-foreground">{watchAuthorName || "Unknown Author"}</p>
            </div>
          </div>

          {/* Excerpt */}
          {watchExcerpt && (
            <p className="text-xl text-muted-foreground font-medium border-l-4 border-primary pl-4">
              {watchExcerpt}
            </p>
          )}

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: watchContent || "" }}
          />

          {/* Tags */}
          {currentTags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              {currentTags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
