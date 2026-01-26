"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ShieldAlert, Trash2, ImageIcon, Video } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRejectApp } from "@/hooks/useAdmin";
import { useR2 } from "@/hooks/useR2";

interface AdminRejectDialogProps {
  appId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AdminRejectDialog({
  appId,
  open,
  onOpenChange,
  onSuccess,
}: AdminRejectDialogProps) {
  const [rejectTitle, setRejectTitle] = useState("");
  const [rejectDescription, setRejectDescription] = useState("");
  const [rejectImage, setRejectImage] = useState<File | null>(null);
  const [rejectVideo, setRejectVideo] = useState<File | null>(null);
  const [rejectImagePreview, setRejectImagePreview] = useState<string | null>(
    null,
  );
  const [rejectVideoPreview, setRejectVideoPreview] = useState<string | null>(
    null,
  );
  const [uploadPercent, setUploadPercent] = useState(0);

  const { createUploadUrl, isPendingCUU, uploadFileToR2 } = useR2();

  const { mutate: rejectApp, isPending: isRejecting } = useRejectApp({
    onSuccess: () => {
      toast({
        title: "Submission Rejected",
        description: "The app has been rejected successfully.",
      });
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.message || "Failed to reject app.",
      });
    },
  });

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      if (rejectImagePreview) URL.revokeObjectURL(rejectImagePreview);
      if (rejectVideoPreview) URL.revokeObjectURL(rejectVideoPreview);
    };
  }, [rejectImagePreview, rejectVideoPreview]);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setRejectTitle("");
      setRejectDescription("");
      setRejectImage(null);
      setRejectVideo(null);
      setRejectImagePreview(null);
      setRejectVideoPreview(null);
      setUploadPercent(0);
    }
  }, [open]);

  const handleRejectSubmit = async () => {
    if (!rejectDescription) {
      toast({
        variant: "destructive",
        title: "Description Required",
        description: "Please provide a reason/description for rejection.",
      });
      return;
    }

    try {
      let imageUrl: undefined | string = undefined;
      let videoUrl: undefined | string = undefined;
      const r2Url = process.env.NEXT_PUBLIC_R2_MEDIA_BASE_URL || "";

      if (rejectImage) {
        setUploadPercent(0);
        const uploadConfig = await createUploadUrl.mutateAsync({
          filename: rejectImage.name,
          contentType: rejectImage.type,
          size: rejectImage.size,
          type: "image",
        });

        await uploadFileToR2.mutateAsync({
          file: rejectImage,
          uploadUrl: uploadConfig.uploadUrl,
          onProgress: (percent) => setUploadPercent(percent),
        });

        imageUrl = uploadConfig.key;
      }

      if (rejectVideo) {
        setUploadPercent(0);
        const uploadConfig = await createUploadUrl.mutateAsync({
          filename: rejectVideo.name,
          contentType: rejectVideo.type,
          size: rejectVideo.size,
          type: "video",
        });

        await uploadFileToR2.mutateAsync({
          file: rejectVideo,
          uploadUrl: uploadConfig.uploadUrl,
          onProgress: (percent) => setUploadPercent(percent),
        });

        videoUrl = uploadConfig.key;
      }

      rejectApp({
        id: appId,
        title: rejectTitle || "Submission Rejected",
        description: rejectDescription,
        image: imageUrl ? r2Url + "/" + imageUrl : undefined,
        video: videoUrl ? r2Url + "/" + videoUrl : undefined,
      });
    } catch (error) {
      console.error("Error submitting rejection:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload files or reject app.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] h-full max-h-[90vh] sm:w-[500px] rounded-3xl overflow-hidden p-0 gap-0 border-none shadow-2xl bg-white dark:bg-[#1A1A1A]">
        <div className="bg-destructive/5 p-6 border-b border-destructive/10">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              Reject Request
            </DialogTitle>
            <DialogDescription className="text-red-600/70">
              Provide a reason for rejecting this tester. This will be shared
              with them.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="e.g. Policy Violation, Crash Issue"
              value={rejectTitle}
              onChange={(e) => setRejectTitle(e.target.value)}
              className="bg-secondary/30 border-primary/10 focus:border-primary/30"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Explain the specific reasons for rejection..."
              className="min-h-[100px] bg-secondary/30 border-primary/10 focus:border-primary/30 resize-none"
              value={rejectDescription}
              onChange={(e) => setRejectDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase">
                Attachment (Image)
              </label>
              <div className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground relative overflow-hidden min-h-[120px]">
                {rejectImage && rejectImagePreview ? (
                  <>
                    <div className="absolute inset-0">
                      <img
                        src={rejectImagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover opacity-60"
                      />
                      <div className="absolute inset-0 bg-black/40" />
                    </div>
                    <div className="z-10 bg-black/50 p-1.5 rounded-lg text-white text-xs truncate max-w-[90%] flex items-center gap-2">
                      <ImageIcon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{rejectImage.name}</span>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7 z-20 shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRejectImage(null);
                        setRejectImagePreview(null);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-6 h-6" />
                    <span className="text-xs text-center truncate w-full">
                      Upload Image
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setRejectImage(file);
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setRejectImagePreview(url);
                    } else {
                      setRejectImagePreview(null);
                    }
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase">
                Attachment (Video)
              </label>
              <div className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground relative overflow-hidden min-h-[120px]">
                {rejectVideo && rejectVideoPreview ? (
                  <>
                    <div className="absolute inset-0">
                      <video
                        src={rejectVideoPreview}
                        className="h-full w-full object-cover opacity-60"
                      />
                      <div className="absolute inset-0 bg-black/40" />
                    </div>
                    <div className="z-10 bg-black/50 p-1.5 rounded-lg text-white text-xs truncate max-w-[90%] flex items-center gap-2">
                      <Video className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{rejectVideo.name}</span>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7 z-20 shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRejectVideo(null);
                        setRejectVideoPreview(null);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Video className="w-6 h-6" />
                    <span className="text-xs text-center truncate w-full">
                      Upload Video
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="video/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setRejectVideo(file);
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setRejectVideoPreview(url);
                    } else {
                      setRejectVideoPreview(null);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 sm:p-6 pt-2 bg-transparent gap-3">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-11 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleRejectSubmit}
            className="h-11 rounded-lg px-6 bg-gradient-to-br from-red-500 to-red-500/50 hover:from-red-500 hover:to-red-600 shadow-lg hover:shadow-red-500/40"
            disabled={
              isRejecting ||
              !rejectDescription ||
              isPendingCUU ||
              uploadFileToR2.isPending
            }
          >
            {isRejecting || isPendingCUU || uploadFileToR2.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                {isPendingCUU || uploadFileToR2.isPending
                  ? `Uploading... ${uploadPercent}%`
                  : "Rejecting..."}
              </>
            ) : (
              "Confirm Rejection"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
