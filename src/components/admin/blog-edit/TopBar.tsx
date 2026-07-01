"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBlogFormContext } from "./useBlogForm";
import { FeedbackModal } from "@/components/feedback-modal";
import { ArrowLeft, Globe, Lock, Eye, Save, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";

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
    const hasTitle = values.title.trim();
    const hasContent = values.content.trim();

    if (!hasTitle && !hasContent) {
      setFeedbackModal({
        open: true,
        status: "warning",
        title: "Title or Content Required",
        description: "Please add a title or article content before saving as draft.",
      });
      return;
    }

    const draftValues = {
      ...values,
      slug: "",
      excerpt: values.excerpt || "",
      authorName: values.authorName || "",
      authorAvatarUrl: values.authorAvatarUrl || "",
      imageUrl: values.imageUrl || "",
      isActive: false,
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
          onClick: () => router.push(ROUTES.ADMIN.BLOG_MANAGEMENT),
        },
      });
    });
  };

  const handlePublish = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      const fieldLabels: Record<string, string> = {
        title: "Title",
        slug: "Slug",
        excerpt: "Excerpt",
        content: "Content",
        authorName: "Author name",
        authorAvatarUrl: "Author avatar URL",
        imageUrl: "Featured image URL",
      };
      const fieldOrder = ["title", "slug", "excerpt", "content", "authorName", "authorAvatarUrl", "imageUrl"];
      const errors = form.formState.errors;
      const missingFields = fieldOrder.filter((key) => errors[key]?.message);

      if (missingFields.length > 0) {
        const labels = missingFields.map((f) => fieldLabels[f]);
        const list = labels.length > 1
          ? `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`
          : labels[0];
        setFeedbackModal({
          open: true,
          status: "warning",
          title: "Missing Required Fields",
          description: `Please fill in the following required fields: ${list}.`,
        });
      }
      return;
    }

    const values = form.getValues();
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
            onClick={() => router.push(ROUTES.ADMIN.BLOG_MANAGEMENT)}
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
