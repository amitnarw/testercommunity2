"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useAcceptHubAppTestingRequest,
  useRejectHubAppTestingRequest,
} from "@/hooks/useHub";
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
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarDays,
  Info,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
import { cn } from "@/lib/utils";

import { ActionFeedbackDialog } from "@/components/action-feedback-dialog";
import { SafeImage } from "@/components/safe-image";
import { format } from "date-fns";
import { updateDailyVerificationStatus } from "@/lib/apiCalls";

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
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState<{
    id: number;
    dayNumber: number;
    proofImageUrl: string;
    status: "PENDING" | "VERIFIED" | "REJECTED";
    verifiedAt: string;
    rejectionReason?: string;
    metaData?: any;
  } | null>(null);
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
  const [rejectImagePreview, setRejectImagePreview] = useState<string | null>(
    null,
  );
  const [rejectVideoPreview, setRejectVideoPreview] = useState<string | null>(
    null,
  );

  const [uploadPercent, setUploadPercent] = useState(0);
  const [verificationRejectionReason, setVerificationRejectionReason] = useState("");
  const [isUpdatingVerification, setIsUpdatingVerification] = useState(false);

  const pendingRequests = requests.filter((r) => r.status === "PENDING");
  const joinedTesters = requests.filter((r) => r.status !== "PENDING");

  const { createUploadUrl, isPendingCUU, uploadFileToR2 } = useR2();
  const acceptMutation = useAcceptHubAppTestingRequest();
  const rejectMutation = useRejectHubAppTestingRequest();

  useEffect(() => {
    return () => {
      if (rejectImagePreview) URL.revokeObjectURL(rejectImagePreview);
      if (rejectVideoPreview) URL.revokeObjectURL(rejectVideoPreview);
    };
  }, [rejectImagePreview, rejectVideoPreview]);

  const handleRejectClick = (request: (typeof requests)[0]) => {
    setSelectedRequest(request);
    setRejectTitle("");
    setRejectDescription("");
    setRejectImage(null);
    setRejectVideo(null);
    setRejectImagePreview(null);
    setRejectVideoPreview(null);
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

        await rejectMutation.mutateAsync({
          hub_id: hubId,
          tester_id: selectedRequest.testerId,
          title: rejectTitle,
          description: rejectDescription,
          image: imageUrl ? r2Url + "/" + imageUrl : undefined,
          video: videoUrl ? r2Url + "/" + videoUrl : undefined,
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

  const handleUpdateVerificationStatus = async (status: "VERIFIED" | "REJECTED") => {
    if (!selectedVerification) return;
    if (status === "REJECTED" && !verificationRejectionReason.trim()) {
      setFeedback({
        open: true,
        status: "error",
        title: "Reason required",
        description: "Please provide a reason for rejection.",
        actionLabel: "Close",
      });
      return;
    }

    setIsUpdatingVerification(true);
    try {
      await updateDailyVerificationStatus({
        id: selectedVerification.id.toString(),
        status,
        reason: verificationRejectionReason,
      });

      setFeedback({
        open: true,
        status: "success",
        title: "Verification Updated",
        description: `Verification has been ${status.toLowerCase()}.`,
        actionLabel: "Done",
      });

      setIsVerificationModalOpen(false);
      setSelectedVerification(null);
      setVerificationRejectionReason("");
      refetch();
    } catch (error: any) {
      setFeedback({
        open: true,
        status: "error",
        title: "Update Failed",
        description: error.message || "Could not update verification status.",
        actionLabel: "Close",
      });
    } finally {
      setIsUpdatingVerification(false);
    }
  };

  return (
    <section className="space-y-6 bg-card/50 rounded-2xl p-3 sm:p-6 pt-2 sm:pt-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold">Manage Testers</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage users who want to join your testing program and track those currently testing.
          </p>
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-4">
          <TabsTrigger value="pending" className="relative">
            Pending Requests
            {pendingRequests.length > 0 && (
              <Badge
                variant="destructive"
                className="ml-2 px-1.5 h-5 min-w-5 flex items-center justify-center rounded-full text-[10px]"
              >
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="joined">
            Joined Testers
            {joinedTesters.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 px-1.5 h-5 min-w-5 flex items-center justify-center rounded-full text-[10px]"
              >
                {joinedTesters.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="joined" className="space-y-4">
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden hidden md:grid md:grid-cols-1">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[300px]">Tester</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Verification</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {joinedTesters.map((req) => (
                    <motion.tr
                      key={req.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <TableCell className="py-4">
                        <span className="font-semibold text-sm">
                          {req.tester?.name || "Unknown"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            req.status === "COMPLETED"
                              ? "default"
                              : req.status === "IN_PROGRESS"
                                ? "secondary"
                                : "outline"
                          }
                          className={cn(
                            "font-medium text-xs",
                            req.status === "COMPLETED" &&
                              "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200",
                            req.status === "IN_PROGRESS" &&
                              "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-200",
                            (req.status === "REJECTED" ||
                              req.status === "DROPPED" ||
                              req.status === "REMOVED") &&
                              "bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-200",
                          )}
                        >
                          {req.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1 flex-wrap">
                          {Array.from({ length: 10 }, (_, i) => {
                            const dayNum = i + 1;
                            const verification = req.dailyVerifications?.find(
                              (v) => v.dayNumber === dayNum,
                            );
                            return (
                              <button
                                key={dayNum}
                                onClick={() => {
                                  if (verification) {
                                    setSelectedVerification(verification);
                                    setIsVerificationModalOpen(true);
                                  }
                                }}
                                className={cn(
                                  "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                                  verification?.status === "VERIFIED" &&
                                    "bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/30 cursor-pointer",
                                  verification?.status === "REJECTED" &&
                                    "bg-red-500/20 text-red-600 hover:bg-red-500/30 cursor-pointer",
                                  verification?.status === "PENDING" &&
                                    "bg-amber-500/20 text-amber-600 hover:bg-amber-500/30 cursor-pointer",
                                  !verification &&
                                    "bg-muted text-muted-foreground cursor-default",
                                )}
                                title={
                                  verification
                                    ? `Day ${dayNum}: ${verification.status}`
                                    : `Day ${dayNum}: Not submitted`
                                }
                              >
                                {verification?.status === "VERIFIED" ? (
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                ) : verification?.status === "REJECTED" ? (
                                  <XCircle className="h-3.5 w-3.5" />
                                ) : verification?.status === "PENDING" ? (
                                  <Clock className="h-3.5 w-3.5" />
                                ) : (
                                  <span className="opacity-50">{dayNum}</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
            {joinedTesters.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No joined testers found.
              </div>
            )}
          </div>

          <div className="md:hidden space-y-4">
            <AnimatePresence>
              {joinedTesters.map((req) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-sm">
                        {req.tester?.name || "Unknown"}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px]",
                        req.status === "COMPLETED" &&
                          "bg-green-500/10 text-green-600",
                        req.status === "IN_PROGRESS" &&
                          "bg-blue-500/10 text-blue-600",
                      )}
                    >
                      {req.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-center gap-1 flex-wrap">
                    {Array.from({ length: 10 }, (_, i) => {
                      const dayNum = i + 1;
                      const verification = req.dailyVerifications?.find(
                        (v) => v.dayNumber === dayNum,
                      );
                      return (
                        <button
                          key={dayNum}
                          onClick={() => {
                            if (verification) {
                              setSelectedVerification(verification);
                              setIsVerificationModalOpen(true);
                            }
                          }}
                          className={cn(
                            "h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-bold transition-all",
                            verification?.status === "VERIFIED" &&
                              "bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/30 cursor-pointer",
                            verification?.status === "REJECTED" &&
                              "bg-red-500/20 text-red-600 hover:bg-red-500/30 cursor-pointer",
                            verification?.status === "PENDING" &&
                              "bg-amber-500/20 text-amber-600 hover:bg-amber-500/30 cursor-pointer",
                            !verification &&
                              "bg-muted text-muted-foreground cursor-default",
                          )}
                          title={
                            verification
                              ? `Day ${dayNum}: ${verification.status}`
                              : `Day ${dayNum}: Not submitted`
                          }
                        >
                          {verification?.status === "VERIFIED" ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : verification?.status === "REJECTED" ? (
                            <XCircle className="h-3 w-3" />
                          ) : verification?.status === "PENDING" ? (
                            <Clock className="h-3 w-3" />
                          ) : (
                            <span className="opacity-50">{dayNum}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {joinedTesters.length === 0 && (
              <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                No joined testers found.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

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

      {/* Verification Details Modal */}
      <Dialog
        open={isVerificationModalOpen}
        onOpenChange={setIsVerificationModalOpen}
      >
        <DialogContent
          className={cn(
            "p-0 overflow-hidden border-none bg-background shadow-2xl block max-h-[90vh] md:max-h-none md:h-auto gap-0 rounded-[2rem]",
            selectedVerification?.proofImageUrl
              ? "max-w-[95vw] sm:max-w-4xl"
              : "max-w-[95vw] sm:max-w-md",
          )}
        >
          <div
            className={cn(
              "flex flex-col h-auto",
              selectedVerification?.proofImageUrl
                ? "md:grid md:grid-cols-5 md:h-[600px]"
                : "md:h-auto",
            )}
          >
            {/* Left: Image Preview (3 cols) */}
            {selectedVerification?.proofImageUrl && (
              <div className="md:col-span-3 relative bg-black/5 dark:bg-black flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-border h-64 shrink-0 md:h-full">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#52525b18_1px,transparent_1px),linear-gradient(to_bottom,#52525b18_1px,transparent_1px)]"></div>
                <div className="relative w-full h-full max-h-[500px] aspect-[9/16] rounded-xl overflow-hidden shadow-none md:shadow-2xl group">
                  <SafeImage
                    src={selectedVerification.proofImageUrl}
                    alt={`Day ${selectedVerification.dayNumber} Proof`}
                    fill
                    className="object-contain md:object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            )}

            {/* Right: Metadata */}
            <div
              className={cn(
                "flex flex-col w-full md:h-full bg-background md:bg-muted/5 md:overflow-hidden",
                selectedVerification?.proofImageUrl ? "md:col-span-2" : "",
              )}
            >
              <DialogHeader className="p-6 sm:p-8 pb-4 border-b border-border space-y-1 shrink-0 bg-muted/5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm ring-1 ring-primary/20">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <DialogTitle className="text-xl font-bold tracking-tight">
                      Day {selectedVerification?.dayNumber} Verification
                    </DialogTitle>
                    <p className="text-xs text-muted-foreground font-medium">
                      Verification proof and status
                    </p>
                  </div>
                </div>
              </DialogHeader>

              <div className="md:flex-1 md:overflow-y-auto p-3 sm:p-6 space-y-8">
                {/* Status Section */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Status
                  </h4>
                  <div
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border",
                      selectedVerification?.status === "VERIFIED"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : selectedVerification?.status === "REJECTED"
                          ? "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
                          : "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
                    )}
                  >
                    {selectedVerification?.status === "VERIFIED" ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : selectedVerification?.status === "REJECTED" ? (
                      <XCircle className="w-6 h-6" />
                    ) : (
                      <Clock className="w-6 h-6" />
                    )}
                    <div>
                      <p className="font-bold text-lg">
                        {selectedVerification?.status}
                      </p>
                      <p className="text-xs opacity-70">
                        {selectedVerification?.status === "VERIFIED"
                          ? "Successfully verified"
                          : "Pending review"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Security Metadata */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      Security Metadata
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarDays className="w-4 h-4" />
                        <span className="text-xs font-medium">Timestamp</span>
                      </div>
                      <span className="text-end text-xs font-mono text-foreground">
                        {selectedVerification?.verifiedAt
                          ? format(
                              new Date(selectedVerification.verifiedAt),
                              "PPP p",
                            )
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedVerification?.rejectionReason && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl space-y-2">
                    <h5 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                      <Info className="w-4 h-4" /> Rejection Reason
                    </h5>
                    <p className="text-xs text-red-600/80 dark:text-red-300/80 leading-relaxed">
                      {selectedVerification.rejectionReason}
                    </p>
                  </div>
                )}

                {/* Rejection Reason Input */}
                {selectedVerification?.status !== "VERIFIED" && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      {selectedVerification?.status === "REJECTED"
                        ? "Update Rejection Reason"
                        : "Rejection Reason"}
                    </label>
                    <Textarea
                      placeholder="Enter reason for rejection..."
                      className="min-h-[80px] text-sm resize-none"
                      value={verificationRejectionReason}
                      onChange={(e) => setVerificationRejectionReason(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-border bg-muted/20 shrink-0 flex flex-col gap-2">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-11 font-bold border-red-500/20 bg-red-500/5 text-red-600 hover:bg-red-500/10 hover:text-red-700 hover:border-red-500/40"
                    onClick={() => handleUpdateVerificationStatus("REJECTED")}
                    disabled={
                      isUpdatingVerification ||
                      selectedVerification?.status === "REJECTED"
                    }
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    {isUpdatingVerification ? "Rejecting..." : "Reject"}
                  </Button>
                  <Button
                    className="flex-1 h-11 font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
                    onClick={() => handleUpdateVerificationStatus("VERIFIED")}
                    disabled={
                      isUpdatingVerification ||
                      selectedVerification?.status === "VERIFIED"
                    }
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {isUpdatingVerification ? "Approving..." : "Approve"}
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground text-center">
                  Auto-approved proofs can be manually rejected if needed
                </p>
              </div>

              <div className="p-6 border-t border-border bg-muted/20 shrink-0">
                <p className="text-[10px] text-center text-muted-foreground">
                  Verification ID: {selectedVerification?.id} • Proof of daily
                  check-in
                </p>
              </div>
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
