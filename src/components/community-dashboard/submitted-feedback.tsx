"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  Lightbulb,
  Upload,
  Edit,
  List,
  Bug,
  Trash2,
  X,
  PartyPopper,
  MessageSquareQuote,
  Sparkles,
  Rocket,
  Video,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  HubSubmittedAppResponse,
  SubmittedFeedback as SubmittedFeedbackType,
} from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PlusCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { SafeImage } from "@/components/safe-image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppPagination } from "../app-pagination";

const FEEDBACK_PER_PAGE = 3;

const FeedbackFormModal = ({
  feedback,
  onSave,
  children,
}: {
  feedback?: HubSubmittedAppResponse["feedback"][number] | null;
  onSave: (data: Partial<HubSubmittedAppResponse["feedback"][number]>) => void;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(feedback?.message || "");
  const [type, setType] = useState<
    HubSubmittedAppResponse["feedback"][number]["type"]
  >(feedback?.type || "BUG");
  const [priority, setPriority] = useState<
    HubSubmittedAppResponse["feedback"][number]["priority"]
  >(feedback?.priority || "LOW");
  const [media, setMedia] = useState<
    HubSubmittedAppResponse["feedback"][number]["media"]
  >(feedback?.media || []);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (open) {
      setMessage(feedback?.message || "");
      setType(feedback?.type || "BUG");
      setPriority(feedback?.priority || "LOW");
      setMedia(feedback?.media || []);
    }
  }, [open, feedback]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsProcessing(true);
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const isVideo = file.type.startsWith("video/");
        const newMediaItem: HubSubmittedAppResponse["feedback"][number]["media"][number] =
          {
            type: isVideo ? "VIDEO" : "IMAGE",
            mime: file.type,
            category: "FEEDBACK_MEDIA",
            src: reader.result as string,
            appId: null,
            blogId: null,
            feedbackId: null,
            notificationId: null,
            supportRequestId: null,
            supportMessageId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

        // Replace existing media with new one (only 1 allowed)
        setMedia([newMediaItem]);
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } else {
      setIsProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".webp"],
      "video/*": [".mp4", ".webm", ".mov"],
    },
    maxFiles: 1, // One at a time, but can add multiple
  });

  const removeMedia = (indexToRemove: number) => {
    setMedia((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !message) return;
    onSave({ id: feedback?.id, type, message, media, priority });
    setOpen(false);
  };

  const getTypeStyles = (t: string) => {
    const isSelected = type === t;
    switch (t) {
      case "BUG":
        return isSelected
          ? "bg-red-50 dark:bg-red-900/10 border-red-500 ring-1 ring-red-500 text-red-700 dark:text-red-400"
          : "bg-white dark:bg-[#1a1a1a] hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-200 dark:hover:border-red-800 text-muted-foreground";
      case "SUGGESTION":
        return isSelected
          ? "bg-amber-50 dark:bg-amber-900/10 border-amber-500 ring-1 ring-amber-500 text-amber-700 dark:text-amber-400"
          : "bg-white dark:bg-[#1a1a1a] hover:bg-amber-50 dark:hover:bg-amber-900/10 hover:border-amber-200 dark:hover:border-amber-800 text-muted-foreground";
      case "PRAISE":
        return isSelected
          ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500 ring-1 ring-emerald-500 text-emerald-700 dark:text-emerald-400"
          : "bg-white dark:bg-[#1a1a1a] hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:border-emerald-200 dark:hover:border-emerald-800 text-muted-foreground";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-[600px] p-0 bg-[#fafafa] dark:bg-[#0f0f0f] shadow-2xl rounded-2xl sm:rounded-3xl border-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <DialogHeader className="relative z-10 w-full bg-white dark:bg-[#141414] border-b border-border/40">
          <div className="flex flex-row items-center justify-between p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="absolute sm:static top-0 left-0 scale-[2] sm:scale-100 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary opacity-20 sm:opacity-100 shadow-sm ring-2 ring-primary/20">
                {feedback ? (
                  <Edit className="w-5 h-5" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
              </div>
              <div className="text-left z-10">
                <DialogTitle className="text-lg sm:text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                  {feedback ? "Edit Feedback" : "Share Experience"}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Help us improve by sharing your thoughts.
                </DialogDescription>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-muted text-muted-foreground"
              onClick={() => setOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-full max-h-[80vh] overflow-y-auto"
        >
          <div className="px-3 sm:px-6 py-2 space-y-6">
            {/* Type Selector */}
            <div className="space-y-4">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                What kind of feedback?
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setType("BUG")}
                  className={cn(
                    "group relative flex flex-row sm:flex-col items-center p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    getTypeStyles("BUG"),
                  )}
                >
                  <div
                    className={cn(
                      "p-2 sm:p-2.5 rounded-lg sm:rounded-xl mr-3 sm:mr-0 sm:mb-3 transition-colors",
                      type === "BUG"
                        ? "bg-white/20 text-current"
                        : "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 group-hover:bg-red-200 dark:group-hover:bg-red-900/40",
                    )}
                  >
                    <Bug className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex flex-col sm:items-center text-left sm:text-center">
                    <span className="font-semibold text-sm sm:text-base">
                      Bug
                    </span>
                    <span className="hidden sm:block text-[10px] sm:text-xs opacity-70 mt-0.5">
                      Report an issue
                    </span>
                  </div>
                  {type === "BUG" && (
                    <div className="absolute top-2 right-2 sm:top-2 sm:right-2">
                      <Check className="w-4 h-4 text-current" />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setType("SUGGESTION")}
                  className={cn(
                    "group relative flex flex-row sm:flex-col items-center p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    getTypeStyles("SUGGESTION"),
                  )}
                >
                  <div
                    className={cn(
                      "p-2 sm:p-2.5 rounded-lg sm:rounded-xl mr-3 sm:mr-0 sm:mb-3 transition-colors",
                      type === "SUGGESTION"
                        ? "bg-white/20 text-current"
                        : "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/40",
                    )}
                  >
                    <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex flex-col sm:items-center text-left sm:text-center">
                    <span className="font-semibold text-sm sm:text-base">
                      Idea
                    </span>
                    <span className="hidden sm:block text-[10px] sm:text-xs opacity-70 mt-0.5">
                      Suggest feature
                    </span>
                  </div>
                  {type === "SUGGESTION" && (
                    <div className="absolute top-2 right-2 sm:top-2 sm:right-2">
                      <Check className="w-4 h-4 text-current" />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setType("PRAISE")}
                  className={cn(
                    "group relative flex flex-row sm:flex-col items-center p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    getTypeStyles("PRAISE"),
                  )}
                >
                  <div
                    className={cn(
                      "p-2 sm:p-2.5 rounded-lg sm:rounded-xl mr-3 sm:mr-0 sm:mb-3 transition-colors",
                      type === "PRAISE"
                        ? "bg-white/20 text-current"
                        : "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/40",
                    )}
                  >
                    <PartyPopper className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex flex-col sm:items-center text-left sm:text-center">
                    <span className="font-semibold text-sm sm:text-base">
                      Praise
                    </span>
                    <span className="hidden sm:block text-[10px] sm:text-xs opacity-70 mt-0.5">
                      What you liked
                    </span>
                  </div>
                  {type === "PRAISE" && (
                    <div className="absolute top-2 right-2 sm:top-2 sm:right-2">
                      <Check className="w-4 h-4 text-current" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Priority Selector (Only for Bugs) */}
            {type === "BUG" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                  How Critical is it?
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-muted/40 p-1.5 rounded-xl border border-border/50">
                  {(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={cn(
                        "flex items-center justify-center py-2.5 rounded-lg text-xs font-bold transition-all duration-200",
                        priority === p
                          ? "shadow-sm scale-[1.02]"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/5",
                        priority === p &&
                          p === "CRITICAL" &&
                          "bg-destructive text-destructive-foreground",
                        priority === p &&
                          p === "HIGH" &&
                          "bg-orange-500 text-white",
                        priority === p &&
                          p === "MEDIUM" &&
                          "bg-amber-400 text-amber-950",
                        priority === p &&
                          p === "LOW" &&
                          "bg-blue-500 text-white",
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Comment Area */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                Tell us more
              </Label>
              <div className="relative group">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    type === "BUG"
                      ? "Describe what happened, what you expected, and steps to reproduce..."
                      : type === "SUGGESTION"
                        ? "What feature or improvement would you like to see?"
                        : "What did you enjoy most about the app?"
                  }
                  className="min-h-[160px] resize-none text-sm sm:text-base bg-white dark:bg-black/20 border-border/60 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 rounded-2xl p-2 sm:p-5 shadow-sm transition-all placeholder:text-muted-foreground/50"
                />
                <div className="absolute bottom-4 right-4 text-xs text-muted-foreground pointer-events-none">
                  {message.length} chars
                </div>
              </div>
            </div>

            {/* Media Upload */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Attachment
                </Label>
                <span className="text-xs text-muted-foreground">
                  (Max 1 file)
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {media?.map((item, index) => (
                  <div
                    key={index}
                    className="relative aspect-square group rounded-lg overflow-hidden border bg-muted/20"
                  >
                    {item.type === "VIDEO" ? (
                      <div className="w-full h-full flex items-center justify-center bg-black/5">
                        <Video className="w-8 h-8 text-muted-foreground/50" />
                        <video
                          src={item.src}
                          className="absolute inset-0 w-full h-full object-cover opacity-50"
                        />
                      </div>
                    ) : (
                      <SafeImage
                        src={item.src}
                        alt="Preview"
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform group-hover:scale-105"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full transition-transform hover:bg-red-600 shadow-md z-10"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                ))}

                {media.length < 1 && (
                  <div
                    {...getRootProps()}
                    className={cn(
                      "aspect-square rounded-lg border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary gap-1",
                      isDragActive &&
                        "border-primary bg-primary/10 text-primary",
                    )}
                  >
                    <input {...getInputProps()} />
                    {isProcessing ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 mb-1 opacity-50" />
                        <span className="text-[10px] font-medium uppercase">
                          Upload
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Supports 1 Image (PNG, JPG) or Video (MP4, WebM)
              </p>
            </div>
          </div>

          <DialogFooter className="p-4 sm:p-6 bg-white dark:bg-[#141414] border-t border-border/40 mt-auto">
            <div className="flex w-full gap-3">
              <Button
                type="button"
                variant="ghost"
                className="flex-1 rounded-xl h-11 sm:h-12 hover:bg-muted/50"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-[2] rounded-xl h-11 sm:h-12 text-sm sm:text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all active:scale-[0.98]"
                disabled={!message || !type}
              >
                {feedback ? "Update Feedback" : "Submit Feedback"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const FeedbackIcon = ({
  type,
}: {
  type: HubSubmittedAppResponse["feedback"][0]["type"];
}) => {
  if (type === "BUG")
    return <Bug className="w-5 h-5 text-red-500 flex-shrink-0" />;
  if (type === "SUGGESTION")
    return <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0" />;
  return <PartyPopper className="w-5 h-5 text-green-500 flex-shrink-0" />;
};

const FeedbackListItem = ({
  fb,
  onSave,
  onDelete,
  onImageClick,
  isCompleted,
}: {
  fb: HubSubmittedAppResponse["feedback"][0];
  onSave: (data: any) => void;
  onDelete: (id: number) => void;
  onImageClick: (url: string) => void;
  isCompleted: boolean;
}) => (
  <Card
    className={`bg-gradient-to-tl ${
      fb.type === "BUG"
        ? "from-red-500/20"
        : fb.type === "SUGGESTION"
          ? "from-yellow-500/20"
          : "from-green-500/20"
    } ${
      fb.type === "BUG"
        ? "to-red-500/5"
        : fb.type === "SUGGESTION"
          ? "to-yellow-500/5"
          : "to-green-500/5"
    } p-4 pt-2 pr-2 shadow-none border-0 relative overflow-hidden pl-5`}
  >
    <div className="flex items-start flex-col gap-0">
      <div className="absolute scale-[2.5] rotate-45 top-2 left-1 opacity-5 dark:opacity-10">
        <FeedbackIcon type={fb.type} />
      </div>
      <div className="flex flex-row items-center justify-between w-full">
        <p className="font-semibold">{fb.type}</p>
        <div className={`flex items-center gap-1 ${isCompleted && "hidden"}`}>
          <FeedbackFormModal feedback={fb} onSave={onSave}>
            <button className="hover:bg-white/50 p-2 rounded-md duration-300">
              <Edit className="w-4 h-4" />
            </button>
          </FeedbackFormModal>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="hover:bg-red-200 p-2 rounded-md duration-300 text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-[90vw] rounded-2xl bg-white dark:bg-[#121212] border-0">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your feedback.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-white dark:bg-[#121212]">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-gradient-to-br from-red-500 to-red-500/40 dark:from-red-500/80 dark:to-red-500/20 hover:bg-red-500/50 !shadow-red-500/50"
                  onClick={() => onDelete(fb.id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-1">{fb?.message}</p>
      {fb?.media?.length > 0 &&
        fb?.media?.map((item, index) => (
          <div
            className="mt-3 cursor-pointer h-14"
            onClick={() => onImageClick(item?.src)}
          >
            <SafeImage
              src={item?.src}
              alt="Feedback screenshot"
              width={40}
              height={100}
              className="rounded-sm border object-cover"
            />
          </div>
        ))}
    </div>
  </Card>
);

const FeedbackGridItem = ({
  fb,
  onSave,
  onDelete,
  onImageClick,
  isCompleted,
}: {
  fb: HubSubmittedAppResponse["feedback"][number];
  onSave: (data: any) => void;
  onDelete: (id: number) => void;
  onImageClick: (url: string) => void;
  isCompleted: boolean;
}) => (
  <Card
    className={`bg-gradient-to-bl ${
      fb.type === "BUG"
        ? "from-red-500/20"
        : fb.type === "SUGGESTION"
          ? "from-yellow-500/20"
          : "from-green-500/20"
    } ${
      fb.type === "BUG"
        ? "to-red-500/10"
        : fb.type === "SUGGESTION"
          ? "to-yellow-500/10"
          : "to-green-500/10"
    } p-4 pr-2 shadow-none border-0 h-full flex flex-col relative overflow-hidden`}
  >
    <CardHeader className="p-0 flex-row items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-full absolute opacity-10 scale-[3] -right-1 -top-1 -rotate-45">
          <FeedbackIcon type={fb.type} />
        </div>
        <CardTitle className="text-base">{fb.type}</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="p-0 pt-2 flex-grow">
      <p className="text-sm text-muted-foreground line-clamp-3">
        {fb?.message}
      </p>
    </CardContent>
    <CardFooter className="p-0 flex items-center justify-between">
      {fb?.media?.length > 0 ? (
        <div className="grid grid-cols-4 gap-1">
          {fb?.media?.map((media, index) => (
            <div
              key={index}
              className="mt-3 cursor-pointer h-10"
              onClick={() => onImageClick(media?.src)}
            >
              <SafeImage
                src={media?.src}
                alt="Feedback screenshot"
                width={30}
                height={100}
                className="rounded-sm border object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <div />
      )}
      <div className={`flex items-center gap-1 ${isCompleted && "hidden"}`}>
        <FeedbackFormModal feedback={fb} onSave={onSave}>
          <button className="hover:bg-white/50 p-1 sm:p-2 rounded-md duration-300">
            <Edit className="w-3 h-3 sm:w-4 h-4" />
          </button>
        </FeedbackFormModal>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="hover:bg-red-200 p-2 rounded-md duration-300 text-red-500">
              <Trash2 className="w-4 h-4" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="w-[90vw] rounded-2xl bg-white dark:bg-[#121212] border-0">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                feedback.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-white dark:bg-[#121212]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-gradient-to-br from-red-500 to-red-500/40 dark:from-red-500/80 dark:to-red-500/20 hover:bg-red-500/50 !shadow-red-500/50"
                onClick={() => onDelete(fb.id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </CardFooter>
  </Card>
);

export function SubmittedFeedback({
  isCompleted = false,
  feedback,
}: {
  isCompleted?: boolean;
  feedback: HubSubmittedAppResponse["feedback"];
}) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const totalPages = Math.ceil(feedback?.length / FEEDBACK_PER_PAGE);
  const startIndex = (currentPage - 1) * FEEDBACK_PER_PAGE;
  const endIndex = startIndex + FEEDBACK_PER_PAGE;
  const currentFeedback = feedback?.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSaveFeedback = (
    data: Partial<HubSubmittedAppResponse["feedback"][number]>,
  ) => {
    if (data.id) {
      // Edit existing
    } else {
      // Add new
    }
  };

  const handleDeleteFeedback = (id: number) => {};

  const description = isCompleted
    ? "Here is a summary of the feedback you submitted."
    : "Here is the feedback you've submitted so far.";

  return (
    <>
      <section>
        <div className="bg-card/50 rounded-2xl p-4 sm:p-6 sm:pt-4 grid grid-cols-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">
                Submitted Feedback
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {description}
              </p>
            </div>
            <div className="flex items-center gap-2 justify-between w-full sm:w-auto">
              {isCompleted && <div />}
              <div className="flex items-center gap-1">
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
              </div>
              {!isCompleted && (
                <FeedbackFormModal onSave={handleSaveFeedback}>
                  <Button className="relative overflow-hidden">
                    <PlusCircle className="absolute sm:static mr-2 h-4 w-4 scale-[2.5] top-1 left-1 text-white/20 sm:text-white sm:scale-100" />{" "}
                    Submit New
                  </Button>
                </FeedbackFormModal>
              )}
            </div>
          </div>

          {currentFeedback.length > 0 ? (
            <>
              {viewMode === "list" ? (
                <div className="space-y-3">
                  {currentFeedback.map((fb) => (
                    <FeedbackListItem
                      key={fb.id}
                      fb={fb}
                      onSave={handleSaveFeedback}
                      onDelete={handleDeleteFeedback}
                      onImageClick={setFullscreenImage}
                      isCompleted={isCompleted}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
                  {currentFeedback.map((fb) => (
                    <FeedbackGridItem
                      key={fb.id}
                      fb={fb}
                      onSave={handleSaveFeedback}
                      onDelete={handleDeleteFeedback}
                      onImageClick={setFullscreenImage}
                      isCompleted={isCompleted}
                    />
                  ))}
                </div>
              )}
              <AppPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="relative overflow-hidden rounded-3xl border border-muted/20 bg-gradient-to-b from-muted/5 to-transparent p-8 md:p-12 text-center">
              {/* Abstract Background Shapes */}
              <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl animate-pulse" />
              <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-accent/5 blur-3xl animate-pulse delay-1000" />

              <div className="relative z-10 flex flex-col items-center gap-6">
                {/* Floating Icon Cluster */}
                <div className="flex gap-4 items-center mb-2">
                  <div className="p-3 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 transform -rotate-12 hover:rotate-0 transition-transform duration-300">
                    <Bug className="w-5 h-5" />
                  </div>
                  <div className="p-5 rounded-3xl bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/10 transform scale-110 z-10">
                    <MessageSquareQuote className="w-8 h-8" />
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 transform rotate-12 hover:rotate-0 transition-transform duration-300">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-2 max-w-lg mx-auto">
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Make Your <span className="text-primary">Impact</span>
                  </h3>

                  <p className="text-muted-foreground text-md sm:text-lg leading-relaxed">
                    This space is waiting for your unique perspective. Help
                    developers polish this gem by sharing bugs, ideas, or
                    praise.
                  </p>
                </div>

                <div className="pt-2">
                  <FeedbackFormModal onSave={handleSaveFeedback}>
                    <Button
                      size="lg"
                      className="rounded-full px-8 py-6 text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95 group"
                    >
                      <Sparkles className="mr-2 h-5 w-5 group-hover:animate-spin" />{" "}
                      Start Contributing
                    </Button>
                  </FeedbackFormModal>
                </div>

                <div className="flex items-center gap-6 text-xs text-muted-foreground/60 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Bug className="w-3 h-3" /> Report Bugs
                  </span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  <span className="flex items-center gap-1.5">
                    <Lightbulb className="w-3 h-3" /> Suggest Ideas
                  </span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  <span className="flex items-center gap-1.5">
                    <Rocket className="w-3 h-3" /> Help Grow
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 animate-in fade-in-0"
          onClick={() => setFullscreenImage(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:text-white bg-red-500/60 hover:bg-red-500 h-12 w-12 rounded-lg"
            onClick={() => setFullscreenImage(null)}
          >
            <X className="w-8 h-8" />
            <span className="sr-only">Close</span>
          </Button>
          <div className="relative w-full h-full max-w-4xl max-h-[90vh]">
            <SafeImage
              src={fullscreenImage}
              alt="Fullscreen view"
              layout="fill"
              objectFit="contain"
              className="animate-in zoom-in-95"
            />
          </div>
        </div>
      )}
    </>
  );
}
