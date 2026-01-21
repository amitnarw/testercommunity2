"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useAcceptHubAppTestingRequest,
  useRejectHubAppTestingRequest,
} from "@/hooks/useUser";
import {
  Check,
  X,
  User,
  Image as ImageIcon,
  Video,
  ShieldAlert,
  Eye,
  Smartphone,
  Star,
  Loader2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { HubSubmittedAppResponse } from "@/lib/types";
import { useR2 } from "@/hooks/useR2";

import { ActionFeedbackDialog } from "@/components/action-feedback-dialog";

export interface TesterRequestsSectionProps {
  hubId: string;
  requests: HubSubmittedAppResponse["testerRelations"];
  refetch: () => void;
}

export function TesterRequestsSection({
  hubId,
  requests,
  refetch,
}: TesterRequestsSectionProps) {
  const [selectedRequest, setSelectedRequest] = useState<
    (typeof requests)[0] | null
  >(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Feedback State
  const [feedback, setFeedback] = useState<{
    open: boolean;
    status: "success" | "error";
    title: string;
    description: string;
    actionLabel?: string;
  }>({
    open: false,
    status: "success",
    title: "",
    description: "",
  });

  // Rejection Form State
  const [rejectTitle, setRejectTitle] = useState("");
  const [rejectDescription, setRejectDescription] = useState("");
  const [rejectImage, setRejectImage] = useState<File | null>(null);
  const [rejectVideo, setRejectVideo] = useState<File | null>(null);

  const [uploadPercent, setUploadPercent] = useState(0);

  const pendingRequests = requests.filter((r) => r.status === "PENDING");

  const { createUploadUrl, isPendingCUU, uploadFileToR2 } = useR2();
  const acceptMutation = useAcceptHubAppTestingRequest();
  const rejectMutation = useRejectHubAppTestingRequest();

  const handleRejectClick = (request: (typeof requests)[0]) => {
    setSelectedRequest(request);
    setRejectTitle("");
    setRejectDescription("");
    setRejectImage(null);
    setRejectVideo(null);
    setIsRejectModalOpen(true);
  };

  const handleDetailsClick = (request: (typeof requests)[0]) => {
    setSelectedRequest(request);
    setIsDetailsModalOpen(true);
  };

  const handleAccept = async (testerId: string) => {
    setProcessingId(testerId);
    try {
      await acceptMutation.mutateAsync({
        hub_id: hubId,
        tester_id: testerId,
      });
      setFeedback({
        open: true,
        status: "success",
        title: "Tester Accepted",
        description:
          "The tester has been successfully approved and added to your project.",
        actionLabel: "Done",
      });
      refetch();
    } catch (error) {
      console.error("Error accepting request:", error);
      setFeedback({
        open: true,
        status: "error",
        title: "Action Failed",
        description: "Could not accept the tester request. Please try again.",
        actionLabel: "Close",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const submitRejection = async () => {
    if (selectedRequest) {
      try {
        let imageUrl: undefined | string = undefined;
        let videoUrl: undefined | string = undefined;

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

          imageUrl = uploadConfig.url;
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

          videoUrl = uploadConfig.url;
        }

        await rejectMutation.mutateAsync({
          hub_id: hubId,
          tester_id: selectedRequest.testerId,
          title: rejectTitle,
          description: rejectDescription,
          image: imageUrl,
          video: videoUrl,
        });

        setIsRejectModalOpen(false);
        setFeedback({
          open: true,
          status: "success",
          title: "Request Rejected",
          description:
            "The tester request has been rejected and the user notified.",
          actionLabel: "Done",
        });
        refetch();
      } catch (error) {
        console.error("Error submitting rejection:", error);
        setFeedback({
          open: true,
          status: "error",
          title: "Action Failed",
          description: "Could not reject the request. Please try again.",
          actionLabel: "Close",
        });
      }
    }
  };

  return (
    <section className="space-y-6 bg-card/50 rounded-2xl p-3 sm:p-6 pt-2 sm:pt-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold">Tester Requests</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage users who want to join your testing program.
          </p>
        </div>
        <div className="absolute top-0 right-0">
          <Badge
            variant="secondary"
            className="w-7 h-7 sm:w-auto sm:h-auto text-xs sm:text-sm rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors gap-1"
          >
            <span>{pendingRequests.length}</span>
            <span className="hidden sm:block">Pending</span>
          </Badge>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden hidden md:grid md:grid-cols-1">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[300px]">Tester</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {pendingRequests.map((req) => (
                <motion.tr
                  key={req.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-border">
                        <AvatarImage src={req.tester?.image || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {req.tester?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">
                          {req.tester?.name || "Unknown"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {req.tester?.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span>
                        {req?.tester?.userDetail?.experience_level || "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="font-normal text-xs gap-1"
                      >
                        <Smartphone className="w-3 h-3 opacity-70" />
                        {req?.tester?.userDetail?.device_company ||
                        req?.tester?.userDetail?.device_model
                          ? req?.tester?.userDetail?.device_company +
                            " " +
                            req?.tester?.userDetail?.device_model
                          : "N/A"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="font-medium text-xs bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border-orange-200 dark:border-orange-900"
                    >
                      Pending Review
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => handleDetailsClick(req)}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <div className="h-4 w-px bg-border mx-1" />
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 text-green-600 border-green-200 dark:border-green-900 hover:bg-green-50 hover:text-green-700 hover:border-green-300 dark:hover:bg-green-900/20"
                        onClick={() => handleAccept(req.testerId)}
                        title="Accept"
                        disabled={processingId === req.testerId}
                      >
                        {processingId === req.testerId ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 text-red-600 border-red-200 dark:border-red-900 hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:hover:bg-red-900/20"
                        onClick={() => handleRejectClick(req)}
                        title="Reject"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
        {pendingRequests.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No pending requests found.
          </div>
        )}
      </div>

      {/* Mobile Layout (Cards) */}
      <div className="md:hidden space-y-4">
        <AnimatePresence>
          {pendingRequests.map((req) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-card border border-border rounded-xl p-4 shadow-lg shadow-primary/20 flex flex-col gap-4"
            >
              <div className="flex items-start justify-between relative">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={req.tester?.image || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {req.tester?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">
                      {req.tester?.name || "Unknown"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {req.tester?.email}
                    </span>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 font-medium text-[8px] bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border-orange-200 dark:border-orange-900 whitespace-nowrap"
                >
                  Pending
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <span>
                    {req?.tester?.userDetail?.experience_level || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 opacity-70" />
                  <span>
                    {req?.tester?.userDetail?.device_company ||
                    req?.tester?.userDetail?.device_model
                      ? req?.tester?.userDetail?.device_company +
                        " " +
                        req?.tester?.userDetail?.device_model
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 overflow-hidden text-xs h-9"
                  onClick={() => handleDetailsClick(req)}
                >
                  Details
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 w-10 px-0 text-green-600 border-green-200 dark:border-green-900 hover:bg-green-50 hover:text-green-700 hover:border-green-300 dark:hover:bg-green-900/20"
                  onClick={() => handleAccept(req.testerId)}
                  title="Accept"
                  disabled={processingId === req.testerId}
                >
                  {processingId === req.testerId ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 w-10 px-0 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:border-orange-900 dark:hover:bg-red-900/20"
                  onClick={() => handleRejectClick(req)}
                  title="Reject"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {pendingRequests.length === 0 && (
          <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-xl">
            No pending requests found.
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="w-[95vw] h-full max-h-[90vh] sm:w-[500px] rounded-3xl overflow-hidden p-0 gap-0">
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
                placeholder="e.g. Incompatible Device"
                value={rejectTitle}
                onChange={(e) => setRejectTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Explain why their request was rejected..."
                className="min-h-[100px] resize-none"
                value={rejectDescription}
                onChange={(e) => setRejectDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase">
                  Attachment (Image)
                </label>
                <div className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground relative">
                  <ImageIcon className="w-6 h-6" />
                  <span className="text-xs text-center truncate w-full">
                    {rejectImage ? rejectImage.name : "Upload Image"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) =>
                      setRejectImage(e.target.files?.[0] || null)
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase">
                  Attachment (Video)
                </label>
                <div className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground relative">
                  <Video className="w-6 h-6" />
                  <span className="text-xs text-center truncate w-full">
                    {rejectVideo ? rejectVideo.name : "Upload Video"}
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) =>
                      setRejectVideo(e.target.files?.[0] || null)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="p-4 sm:p-6 pt-2 bg-secondary/10 flex-row gap-5">
            <Button
              variant="ghost"
              onClick={() => setIsRejectModalOpen(false)}
              className="w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={submitRejection}
              className="w-full sm:w-auto"
              disabled={
                !rejectTitle ||
                !rejectDescription ||
                isPendingCUU ||
                uploadFileToR2.isPending ||
                rejectMutation.isPending
              }
            >
              {isPendingCUU ||
              uploadFileToR2.isPending ||
              rejectMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {isPendingCUU || uploadFileToR2.isPending
                    ? `Uploading... ${uploadPercent}%`
                    : "Rejecting..."}
                </>
              ) : (
                "Reject Request"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="w-[95vw] sm:w-[600px] rounded-3xl p-0 gap-0 overflow-hidden">
          <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 w-full flex flex-row gap-2 items-center justify-between px-4 sm:px-8 pt-8 pb-2 sm:pb-4">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-background shadow-lg">
              <AvatarImage src={selectedRequest?.tester?.image || ""} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl sm:text-2xl">
                {selectedRequest?.tester?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-end">
              <h2 className="text-lg sm:text-2xl font-bold">
                {selectedRequest?.tester?.name}
              </h2>
              <p className="text-xs sm:text-base text-muted-foreground break-all">
                {selectedRequest?.tester?.email}
              </p>
            </div>
          </div>
          <div className="p-4 sm:p-8 pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Personal Info
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground whitespace-nowrap">
                      Country
                    </span>
                    <span className="truncate ml-2">
                      {selectedRequest?.tester?.userDetail?.country || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground whitespace-nowrap">
                      Join Date
                    </span>
                    <span className="truncate ml-2">
                      {selectedRequest?.tester?.createdAt
                        ? new Date(
                            selectedRequest?.tester?.createdAt,
                          )?.toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  {/* Device Icon if I had one handy, using generic for now */}
                  <Smartphone className="w-4 h-4 text-primary" />
                  Device Info
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground whitespace-nowrap">
                      Model
                    </span>
                    <span className="truncate ml-2">
                      {selectedRequest?.tester?.userDetail?.device_company ||
                      selectedRequest?.tester?.userDetail?.device_model
                        ? selectedRequest?.tester?.userDetail?.device_company +
                          " " +
                          selectedRequest?.tester?.userDetail?.device_model
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground whitespace-nowrap">
                      Android Ver.
                    </span>
                    <span className="truncate ml-2">
                      {selectedRequest?.tester?.userDetail?.os
                        ? selectedRequest?.tester?.userDetail?.os
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-row justify-end gap-3">
              <Button
                variant="outline"
                className="w-auto"
                onClick={() => {
                  if (selectedRequest) handleRejectClick(selectedRequest);
                  setIsDetailsModalOpen(false);
                }}
              >
                Reject
              </Button>
              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  if (selectedRequest) handleAccept(selectedRequest.testerId);
                  setIsDetailsModalOpen(false);
                }}
                disabled={processingId === selectedRequest?.testerId}
              >
                {selectedRequest &&
                processingId === selectedRequest.testerId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Accepting...
                  </>
                ) : (
                  "Accept Request"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Feedback Dialog */}
      <ActionFeedbackDialog
        open={feedback.open}
        onOpenChange={(open) => setFeedback((prev) => ({ ...prev, open }))}
        status={feedback.status}
        title={feedback.title}
        description={feedback.description}
        actionLabel={feedback.actionLabel}
        onAction={() => setFeedback((prev) => ({ ...prev, open: false }))}
      />
    </section>
  );
}
