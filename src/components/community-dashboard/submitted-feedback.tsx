"use client";

import { useState, useCallback } from "react";
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
  const [message, setMessage] = useState(feedback?.message || "");
  const [type, setType] = useState<
    HubSubmittedAppResponse["feedback"][number]["type"] | undefined
  >(feedback?.type);
  const [media, setMedia] = useState<
    HubSubmittedAppResponse["feedback"][number]["media"]
  >(feedback?.media || []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Create a proper media object that matches the expected type
        const newMediaItem: HubSubmittedAppResponse["feedback"][number]["media"][number] =
          {
            type: file.type.startsWith("video/") ? "VIDEO" : "IMAGE",
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
        setMedia([newMediaItem]);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".png", ".jpg"] },
    maxFiles: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !message) return;
    onSave({ id: feedback?.id, type, message, media });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 bg-white dark:bg-[#121212] border-0 h-full sm:h-auto gap-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>
            {feedback ? "Edit Feedback" : "Submit New Feedback"}
          </DialogTitle>
          <DialogDescription>
            Your feedback helps developers build better apps. Provide clear and
            constructive comments.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto px-6">
            <div className="space-y-3">
              <Label className="text-base">Feedback Type</Label>
              <Select
                onValueChange={(value) =>
                  setType(
                    value as HubSubmittedAppResponse["feedback"][number]["type"],
                  )
                }
                defaultValue={type}
              >
                <SelectTrigger className="bg-gray-100 dark:bg-black border-0">
                  <SelectValue placeholder="Select feedback type" />
                </SelectTrigger>
                <SelectContent className="z-[60] bg-white dark:bg-[#121212] shadow-2xl dark:shadow-black border-[1px] border-gray-200 dark:border-[#232323] w-[98%] m-auto !py-0">
                  <SelectItem value="Bug">Bug Report</SelectItem>
                  <SelectItem value="Suggestion">Suggestion</SelectItem>
                  <SelectItem value="Praise">Praise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-base">Comment</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g., The app crashed when..."
                className="min-h-[120px] text-base bg-gray-100 dark:bg-black border-0"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base">Upload Screenshot (Optional)</Label>
              {media?.length > 0 ? (
                media?.map((item, index) => (
                  <div className="relative">
                    <SafeImage
                      src={item?.src}
                      alt="Screenshot preview"
                      width={550}
                      height={300}
                      className="rounded-lg object-contain border bg-secondary"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7"
                      onClick={() => setMedia([])}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div
                  {...getRootProps()}
                  className={cn(
                    `border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer hover:border-primary hover:bg-secondary/50`,
                    isDragActive && "border-primary bg-primary/10",
                  )}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="font-semibold">Click or drag file to upload</p>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="border-t p-6">
            <Button type="submit">Save Feedback</Button>
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

  const handleSaveFeedback = (data: Partial<SubmittedFeedbackType>) => {
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
        <div className="bg-card/50 rounded-2xl p-4 sm:p-6 sm:pt-4">
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
