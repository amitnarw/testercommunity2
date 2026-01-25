"use client";

import { useState, useCallback, useEffect, use } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  Calendar,
  Users,
  Check,
  X,
  ArrowLeft,
  Trash2,
  Expand,
  AlertTriangle,
  Clock,
  Package,
  ShieldAlert,
  FileText,
  Video,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { BackButton } from "@/components/back-button";
import { useSingleHubAppDetails } from "@/hooks/useHub";
import { useAcceptApp, useRejectApp } from "@/hooks/useAdmin";
import { SafeImage } from "@/components/safe-image";
import { ExpandableText } from "@/components/expandable-text";
import { AppInfoSidebar } from "@/components/appInfoSidebar";
import { useR2 } from "@/hooks/useR2";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminSubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Reject Modal State
  const [showRejectDialog, setShowRejectDialog] = useState(false);
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

  const { data: project, isLoading, error } = useSingleHubAppDetails({ id });

  const { mutate: acceptApp, isPending: isAccepting } = useAcceptApp({
    onSuccess: () => {
      toast({
        title: "Submission Approved",
        description: "The app has been approved successfully.",
      });
      router.push("/admin/submissions");
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.message || "Failed to approve app.",
      });
    },
  });

  const { mutate: rejectApp, isPending: isRejecting } = useRejectApp({
    onSuccess: () => {
      toast({
        title: "Submission Rejected",
        description: "The app has been rejected successfully.",
      });
      setShowRejectDialog(false);
      router.push("/admin/submissions");
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

  if (isLoading) {
    return (
      <div className="bg-[#f8fafc] dark:bg-[#0f151e] min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg font-medium text-muted-foreground">
          Loading details...
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="bg-[#f8fafc] dark:bg-[#0f151e] min-h-screen flex items-center justify-center">
        <div className="text-red-500 font-medium">
          Error loading app details or app not found.
        </div>
      </div>
    );
  }

  const handleApprove = () => {
    acceptApp(project.id);
  };

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
        id: project.id,
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

  const visitUrl = `https://play.google.com/store/apps/details?id=${project.androidApp.packageName}`;

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0f151e] text-foreground min-h-screen pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="sticky top-0 z-[50] pt-2 sm:pt-3 pb-4 pl-0 xl:pl-8 w-1/2">
          <BackButton href="/admin/submissions" />
        </div>

        <main className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12 mt-8">
          <div className="lg:col-span-2 space-y-12 overflow-hidden">
            {/* Sidebar for mobile, shown in flow */}

            {/* Header Section */}
            <section>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent pb-2">
                {project.androidApp?.appName || `App #${project.appId}`}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="text-sm">
                  {project.appType}
                </Badge>
                <Badge
                  variant={
                    project.status === "REJECTED" ? "destructive" : "secondary"
                  }
                  className={
                    project.status === "ACCEPTED" ||
                    project.status === "AVAILABLE" ||
                    project.status === "IN_TESTING" ||
                    project.status === "COMPLETED"
                      ? "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                      : ""
                  }
                >
                  {project.status}
                </Badge>
              </div>
              <ExpandableText
                text={project.androidApp?.description}
                className="text-muted-foreground text-md sm:text-lg leading-relaxed"
              />
            </section>

            {/* Screenshots Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Screenshots</h2>
              <div className="w-full">
                <div className="flex flex-row gap-2 overflow-x-auto pb-4 -mb-4">
                  {project.androidApp?.appScreenshotUrl1 && (
                    <div
                      className="overflow-hidden rounded-xl flex-shrink-0 w-40 sm:w-60 relative group cursor-pointer"
                      onClick={() => {
                        setFullscreenImage(
                          project.androidApp!.appScreenshotUrl1,
                        );
                      }}
                    >
                      <SafeImage
                        src={project.androidApp.appScreenshotUrl1}
                        alt="App Screenshot 1"
                        width={400}
                        height={800}
                        className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300 bg-muted/20"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Expand className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  )}
                  {project.androidApp?.appScreenshotUrl2 && (
                    <div
                      className="overflow-hidden rounded-xl flex-shrink-0 w-40 sm:w-60 relative group cursor-pointer"
                      onClick={() => {
                        setFullscreenImage(
                          project.androidApp!.appScreenshotUrl2,
                        );
                      }}
                    >
                      <SafeImage
                        src={project.androidApp.appScreenshotUrl2}
                        alt="App Screenshot 2"
                        width={400}
                        height={800}
                        className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300 bg-muted/20"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Expand className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Submission Meta Details (Redesigned) */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                Submission Details
              </h2>
              <Card className="border-0 shadow-lg shadow-gray-100 dark:shadow-gray-900 bg-card overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-gray-100 dark:border-gray-800">
                  {/* Column 1: App Identity */}
                  <div className="p-6 space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-primary font-medium text-sm uppercase tracking-wide">
                        <Package className="w-4 h-4" /> Package Name
                      </div>
                      <p className="font-mono text-sm bg-secondary/50 p-2 rounded-md break-all">
                        {project.androidApp?.packageName}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-primary font-medium text-sm uppercase tracking-wide">
                        <Package className="w-4 h-4" /> Category
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-sm font-medium px-3 py-1"
                      >
                        {project.androidApp?.appCategory?.name}
                      </Badge>
                    </div>
                  </div>

                  {/* Column 2: Requirements */}
                  <div className="p-6 space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-primary font-medium text-sm uppercase tracking-wide">
                        <Smartphone className="w-4 h-4" /> Min Android
                      </div>
                      <div className="text-2xl font-bold">
                        Android {project.minimumAndroidVersion}+
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-primary font-medium text-sm uppercase tracking-wide">
                        <Users className="w-4 h-4" /> Testers Required
                      </div>
                      <div className="text-2xl font-bold">
                        {project.totalTester}{" "}
                        <span className="text-sm text-muted-foreground font-normal">
                          Testers
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Timeline */}
                  <div className="p-6 space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-primary font-medium text-sm uppercase tracking-wide">
                        <Clock className="w-4 h-4" /> Duration
                      </div>
                      <div className="text-2xl font-bold">
                        {project.totalDay}{" "}
                        <span className="text-sm text-muted-foreground font-normal">
                          Days
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-primary font-medium text-sm uppercase tracking-wide">
                        <Calendar className="w-4 h-4" /> Submitted On
                      </div>
                      <div className="font-medium">
                        {new Date(project.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* Review & Action Section (Professional Design) */}
            {project.status === "IN_REVIEW" && (
              <section className="shadow-xl shadow-gray-200 dark:shadow-gray-900 bg-card">
                <Card className="border-0 bg-transparent overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-orange-500" />
                  <CardContent className="p-8">
                    <div className="flex flex-col items-start justify-between gap-6">
                      <div className="space-y-2 relative">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                          <ShieldAlert className="absolute sm:static scale-[2] sm:scale-100  w-6 h-6 text-amber-500 opacity-50 sm:opacity-100" />
                          Review Action Required
                        </h2>
                        <p className="text-sm sm:text-base text-muted-foreground max-w-lg">
                          This application is currently pending review. Please
                          evaluate the submission details and provide a verdict
                          to proceed.
                        </p>
                      </div>
                      <div className="flex flex-row gap-3 w-full md:w-auto">
                        <Button
                          variant="destructive"
                          onClick={() => setShowRejectDialog(true)}
                          disabled={isAccepting || isRejecting}
                          className="flex-1 md:flex-none h-12 px-6 text-sm sm:text-md font-semibold rounded-xl bg-gradient-to-br from-red-500 to-red-500/50 hover:from-red-500 hover:to-red-600 text-white shadow-lg hover:shadow-red-500/40"
                        >
                          <X className="w-4 h-4 mr-0 sm:mr-2" /> Reject
                        </Button>
                        <Button
                          onClick={handleApprove}
                          disabled={isAccepting || isRejecting}
                          className="flex-1 md:flex-none h-12 px-8 text-sm sm:text-md font-semibold rounded-xl bg-gradient-to-br from-green-500 to-green-500/50 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg hover:shadow-green-500/40"
                        >
                          <Check className="w-4 h-4 mr-0 sm:mr-2" /> Approve
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Rejection Modal (Updated to match TesterRequestsSection) */}
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
              <DialogContent className="w-[95vw] h-full max-h-[90vh] sm:w-[500px] rounded-3xl overflow-hidden p-0 gap-0 border-none shadow-2xl bg-white dark:bg-[#1A1A1A]">
                <div className="bg-destructive/5 p-6 border-b border-destructive/10">
                  <DialogHeader>
                    <DialogTitle className="text-red-600 flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5" />
                      Reject Request
                    </DialogTitle>
                    <DialogDescription className="text-red-600/70">
                      Provide a reason for rejecting this tester. This will be
                      shared with them.
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
                      Detailed Description{" "}
                      <span className="text-red-500">*</span>
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
                              <span className="truncate">
                                {rejectImage.name}
                              </span>
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
                              <span className="truncate">
                                {rejectVideo.name}
                              </span>
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
                    onClick={() => setShowRejectDialog(false)}
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

            {/* Previous Instructions Block (for reference) */}
            {project.instructionsForTester && (
              <section>
                <h2 className="mb-4 flex flex-row items-center justify-between gap-2 sm:justify-start">
                  <span className="text-2xl font-bold whitespace-nowrap">
                    Developer's Instructions
                  </span>
                </h2>
                <div className="prose prose-base dark:prose-invert leading-relaxed text-white dark:text-black bg-[#121212] dark:bg-white p-3 sm:p-6 rounded-lg border-primary border-l-4 shadow-xl shadow-gray-300 dark:shadow-gray-700 text-sm sm:text-base">
                  <p className="mt-2 sm:mt-0">
                    {project.instructionsForTester}
                  </p>
                </div>
              </section>
            )}
          </div>
          <div className="block lg:hidden mt-8">
            <AppInfoSidebar
              app={project}
              hideButton={true}
              visitUrl={visitUrl}
            />
          </div>
          <aside className="lg:col-span-1 hidden lg:block">
            <AppInfoSidebar
              app={project}
              hideButton={true}
              visitUrl={visitUrl}
            />
          </aside>
        </main>
      </div>
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 animate-in fade-in-0"
          onClick={() => setFullscreenImage(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:text-white bg-red-500/60 hover:bg-red-500 h-12 w-12 rounded-lg z-50"
            onClick={() => setFullscreenImage(null)}
          >
            <X className="w-8 h-8" />
            <span className="sr-only">Close</span>
          </Button>
          <div className="relative w-full h-full max-w-4xl max-h-[90vh] flex items-center justify-center">
            <SafeImage
              src={fullscreenImage}
              alt="Fullscreen view"
              layout="fill"
              objectFit="contain"
              priority
              className="animate-in zoom-in-95"
              loadingClassName="w-[300px] h-[600px] max-h-[80vh] rounded-[2.5rem] border-[6px] border-white/5 dark:border-white/10 shadow-2xl bg-muted/20"
            />
          </div>
        </div>
      )}
    </div>
  );
}
