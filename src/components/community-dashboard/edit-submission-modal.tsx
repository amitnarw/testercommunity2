"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SubmissionForm } from "./submission-form";
import { HubSubmittedAppResponse } from "@/lib/types";
import { useResubmitHubApp } from "@/hooks/useHub";
import { useToast } from "@/hooks/use-toast";

interface EditSubmissionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  app: HubSubmittedAppResponse;
  onSuccess?: () => void;
}

export function EditSubmissionModal({
  isOpen,
  onOpenChange,
  app,
  onSuccess,
}: EditSubmissionModalProps) {
  const { mutateAsync: resubmitApp, isPending, isSuccess, isError } = useResubmitHubApp();
  const { toast } = useToast();

  const initialData = {
    app_name: app.androidApp?.appName || "",
    app_url: `https://play.google.com/store/apps/details?id=${app.androidApp?.packageName}` || "",
    app_logo_url: app.androidApp?.appLogoUrl || "",
    app_screenshot_url_1: app.androidApp?.appScreenshotUrl1 || "",
    app_screenshot_url_2: app.androidApp?.appScreenshotUrl2 || "",
    category_id: String(app.androidApp?.appCategoryId) || "",
    app_description: app.androidApp?.description || "",
    instruction_for_tester: app.instructionsForTester || "",
    minimum_android_version: app.minimumAndroidVersion || 0,
    total_tester: app.totalTester || 10,
    total_days: app.totalDay || 14,
  };

  const handleFormSubmit = async (data: any) => {
    try {
      await resubmitApp({
        appId: app.id,
        ...data,
      });
      toast({
        title: "Resubmitted successfully",
        description: "Your app has been put back into review.",
      });
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Resubmission failed",
        description: error.message || "Failed to resubmit app",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold">Edit Submission</DialogTitle>
          <DialogDescription>
            Modify your app details and resubmit for review.
          </DialogDescription>
        </DialogHeader>
        <div className="p-0">
          <SubmissionForm
            initialData={initialData}
            onSubmit={handleFormSubmit}
            isPending={isPending}
            isSuccess={isSuccess}
            isError={isError}
            mode="edit"
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
