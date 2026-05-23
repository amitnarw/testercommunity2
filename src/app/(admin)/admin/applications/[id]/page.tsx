"use client";

import { useRouter, notFound, useParams } from "next/navigation";
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
  Check,
  Download,
  Mail,
  Phone,
  Shield,
  X,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/back-button";
import { useState } from "react";
import {
  useTesterApplicationById,
  useUpdateTesterApplicationStatus,
} from "@/hooks/useAdmin";
import { useQueryClient } from "@tanstack/react-query";
import { FeedbackModal } from "@/components/feedback-modal";
import { ROUTES } from "@/lib/routes";

interface TesterApplication {
  id: string;
  name: string;
  email: string;
  date: string;
  experience: string;
  expertise: string[];
  status: string;
  bio: string;
  avatar?: string;
  phone?: string;
  screeningQ1?: string;
  screeningQ2?: string;
  devices?: string[];
  osVersions?: string[];
}
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function AdminApplicationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: application, isLoading, isError } = useTesterApplicationById(id) as {
    data: TesterApplication | undefined;
    isLoading: boolean;
    isError: boolean;
  };

  const [feedbackModal, setFeedbackModal] = useState<{
    open: boolean;
    status: "success" | "error" | "warning" | "info" | "loading";
    title: string;
    description?: string;
    primaryAction?: { label: string; onClick: () => void };
    secondaryAction?: { label: string; onClick: () => void };
  }>({ open: false, status: "info", title: "" });

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["useTesterApplicationById", id] });
    queryClient.invalidateQueries({ queryKey: ["useAllTesterApplications"] });
    queryClient.invalidateQueries({ queryKey: ["useTesterApplicationCounts"] });
  };

  const updateStatusMutation = useUpdateTesterApplicationStatus({
    onSuccess: (_data, variables) => {
      invalidateQueries();
      const action = variables.status === "approved" ? "approved" : "rejected";
      setFeedbackModal({
        open: true,
        status: "success",
        title: `Application ${action === "approved" ? "Approved" : "Rejected"}!`,
        description: `The tester application has been successfully ${action}.`,
        primaryAction: {
          label: "Back to Applications",
          onClick: () => router.push(ROUTES.ADMIN.APPLICATIONS),
        },
      });
    },
    onError: (err: Error) => {
      setFeedbackModal({
        open: true,
        status: "error",
        title: "Action Failed",
        description: err.message || "Failed to update application status. Please try again.",
        primaryAction: {
          label: "Try Again",
          onClick: () => setFeedbackModal((prev) => ({ ...prev, open: false })),
        },
      });
    },
  });

  const handleApprove = () => {
    updateStatusMutation.mutate({ id, status: "approved" });
  };

  const handleReject = () => {
    setRejectDialogOpen(true);
  };

  const confirmReject = () => {
    updateStatusMutation.mutate({
      id,
      status: "rejected",
      reason: rejectReason || undefined,
    });
    setRejectDialogOpen(false);
    setRejectReason("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !application) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="sticky top-0 z-[50] pt-2 pb-4 w-1/2">
        <BackButton href={ROUTES.ADMIN.APPLICATIONS} />
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-br from-primary to-primary/10 bg-clip-text text-transparent">
              Application
            </h2>
            <p className="text-lg sm:text-xl bg-gradient-to-br from-primary to-primary/10 bg-clip-text text-transparent">
              ( Tester )
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? (
                <Loader2 className="sm:mr-2 !h-3 !w-3 sm:!h-4 sm:!w-4 animate-spin" />
              ) : (
                <X className="sm:mr-2 !h-3 !w-3 sm:!h-4 sm:!w-4" />
              )}
              <span className="hidden sm:block">Reject Application</span>
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleApprove}
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? (
                <Loader2 className="sm:mr-2 !h-3 !w-3 sm:!h-4 sm:!w-4 animate-spin" />
              ) : (
                <Check className="sm:mr-2 !h-3 !w-3 sm:!h-4 sm:!w-4" />
              )}
              <span className="hidden sm:block">Approve Application</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={application.avatar || ""} />
                <AvatarFallback>
                  {application.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold">{application.name}</h3>
              <p className="text-sm text-muted-foreground">
                {application.email}
              </p>
              <Badge
                variant="secondary"
                className="mt-4 capitalize"
              >
                {application.status || "Pending"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <a
                  href={`mailto:${application.email}`}
                  className="hover:underline"
                >
                  {application.email}
                </a>
              </div>
              {application.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{application.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" /> Download Resume/CV
          </Button>
        </div>
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Professional Background</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {application.bio || "No bio provided."}
              </p>
              <Separator className="my-6" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-muted-foreground">
                    Experience
                  </p>
                  <p className="font-bold text-lg">
                    {application.experience || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-muted-foreground">
                    Submitted
                  </p>
                  <p>
                    {application.date
                      ? new Date(application.date).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              </div>
              {application.expertise && application.expertise.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <p className="font-semibold text-muted-foreground mb-3">
                      Areas of Expertise
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {application.expertise.map((e: string) => (
                        <Badge
                          key={e}
                          variant="outline"
                          className="text-base py-1 px-3 flex items-center gap-2"
                        >
                          <Shield className="w-4 h-4" />
                          {e}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Screening Questions</CardTitle>
              <CardDescription>
                Responses to our standard screening questions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-1">
                  Describe a critical bug you found and how you reported it.
                </h4>
                <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">
                  {application.screeningQ1 ||
                    "No response provided."}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">
                  How do you approach testing a new feature?
                </h4>
                <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">
                  {application.screeningQ2 ||
                    "No response provided."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reject Reason Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Optionally provide a reason for rejecting this application.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reject-reason">Reason (optional)</Label>
              <Textarea
                id="reject-reason"
                placeholder="Enter reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectReason("");
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmReject}>
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Modal */}
      <FeedbackModal
        open={feedbackModal.open}
        onOpenChange={(open) =>
          setFeedbackModal((prev) => ({ ...prev, open }))
        }
        status={feedbackModal.status}
        title={feedbackModal.title}
        description={feedbackModal.description}
        primaryAction={feedbackModal.primaryAction}
        secondaryAction={feedbackModal.secondaryAction}
      />
    </div>
  );
}
