"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBlogFormContext } from "./useBlogForm";
import { FeedbackModal } from "@/components/feedback-modal";
import { ArrowLeft, Globe, Lock, Eye, Save, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface TopBarProps {
  blogSlug?: string;
  onPreviewClick: () => void;
  onDelete?: () => void;
}

export function TopBar({ blogSlug, onPreviewClick, onDelete }: TopBarProps) {
  const router = useRouter();
  const { isNew, isPending, isSaving, form, onPublish, onSaveDraft } = useBlogFormContext();
  const watchIsActive = form.watch("isActive");
  const isPublished = watchIsActive;
  const [feedbackModal, setFeedbackModal] = useState<{
    open: boolean;
    status: "success" | "error" | "warning" | "info";
    title: string;
    description: string;
    primaryAction?: { label: string; onClick: () => void };
    secondaryAction?: { label: string; onClick: () => void };
  } | null>(null);

  const [deleteModal, setDeleteModal] = useState<{ open: boolean }>({ open: false });

  const handleSaveDraft = () => {
    const values = form.getValues();

    if (!values.title) {
      setFeedbackModal({
        open: true,
        status: "warning",
        title: "Title Required",
        description: "Please add a title before saving as draft.",
      });
      return;
    }

    const draftValues = {
      ...values,
      slug: values.slug || values.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      excerpt: values.excerpt || "No excerpt provided",
      content: values.content || "",
      authorName: values.authorName || "Anonymous",
      authorAvatarUrl: values.authorAvatarUrl || "/avatar-placeholder.svg",
      imageUrl: values.imageUrl || "/blog-placeholder.svg",
    };

    onSaveDraft(draftValues, (slug) => {
      setFeedbackModal({
        open: true,
        status: "success",
        title: "Draft Saved",
        description: `Your blog has been saved as a draft. You can continue editing it later.${slug ? ` Slug: ${slug}` : ""}`,
        primaryAction: {
          label: "Keep Editing",
          onClick: () => setFeedbackModal(null),
        },
        secondaryAction: {
          label: "Back to Blogs",
          onClick: () => router.push("/admin/blog-management"),
        },
      });
    });
  };

  const handlePublish = () => {
    const values = form.getValues();
    const errors: string[] = [];

    if (!values.title) errors.push("Title is required");
    if (!values.slug) errors.push("Slug is required");
    if (!values.excerpt) errors.push("Excerpt is required");
    if (!values.content) errors.push("Content is required");
    if (!values.authorName) errors.push("Author name is required");

    if (errors.length > 0) {
      setFeedbackModal({
        open: true,
        status: "warning",
        title: "Missing Required Fields",
        description: errors.join("\n"),
      });
      return;
    }

    onPublish(values, (slug) => {
      setFeedbackModal({
        open: true,
        status: "success",
        title: isNew ? "Blog Published!" : "Blog Updated!",
        description: isNew
          ? "Your blog has been published successfully and is now live."
          : "Your blog has been updated successfully.",
        primaryAction: {
          label: "View Blog",
          onClick: () => {
            setFeedbackModal(null);
            if (slug) window.open(`/blog/${slug}`, "_blank");
          },
        },
        secondaryAction: {
          label: "Keep Editing",
          onClick: () => setFeedbackModal(null),
        },
      });
    });
  };

  return (
    <div className="border-b border-border">
      {feedbackModal && (
        <FeedbackModal
          status={feedbackModal.status}
          title={feedbackModal.title}
          description={feedbackModal.description}
          open={feedbackModal.open}
          onOpenChange={(open) => {
            setFeedbackModal((prev) => prev ? { ...prev, open } : null);
          }}
          primaryAction={feedbackModal.primaryAction}
          secondaryAction={feedbackModal.secondaryAction}
        />
      )}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/blog-management")}
            className="gap-1 sm:gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">All Posts</span>
          </Button>
          <div className="h-6 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-2">
            {isPublished ? (
              <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/20 gap-1">
                <Globe className="h-3 w-3" />
                <span className="hidden xs:inline">Published</span>
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <Lock className="h-3 w-3" />
                <span className="hidden xs:inline">Draft</span>
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {isPublished && blogSlug && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => window.open(`/blog/${blogSlug}`, "_blank")}
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">View Live</span>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={onPreviewClick}
            disabled={isNew}
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Preview</span>
          </Button>

          {/* WordPress-style: Save Draft always available for drafts */}
          {!isPublished && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={handleSaveDraft}
              disabled={isPending || isSaving}
            >
              {isPending || isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Save Draft</span>
            </Button>
          )}

          {/* Delete button - only for existing blogs */}
          {!isNew && onDelete && (
            <Button
              variant="destructive"
              size="sm"
              className="gap-1"
              onClick={() => {
                setDeleteModal({ open: true });
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          )}

          {/* Delete confirmation modal */}
          {deleteModal.open && (
            <FeedbackModal
              status="warning"
              title="Delete Blog Post?"
              description="Are you sure you want to delete this blog post? This action cannot be undone."
              open={deleteModal.open}
              onOpenChange={(open) => setDeleteModal({ open })}
              primaryAction={{
                label: "Delete",
                onClick: () => {
                  setDeleteModal({ open: false });
                  onDelete?.();
                },
              }}
              secondaryAction={{
                label: "Cancel",
                onClick: () => setDeleteModal({ open: false }),
              }}
            />
          )}

          {/* Publish (new/draft) or Update (published) */}
          {isNew || !isPublished ? (
            <Button
              size="sm"
              className="gap-1"
              onClick={handlePublish}
              disabled={isPending || isSaving}
            >
              {isPending || isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Globe className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Publish</span>
            </Button>
          ) : (
            <Button
              size="sm"
              className="gap-1"
              onClick={handlePublish}
              disabled={isPending || isSaving}
            >
              {isPending || isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Update</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
