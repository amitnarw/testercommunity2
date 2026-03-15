"use client";

import { useState, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Smartphone,
  CalendarDays,
  Users,
  Check,
  X,
  Expand,
  AlertTriangle,
  Clock,
  Package,
  ShieldAlert,
  FileText,
  Video,
  ExternalLink,
  Activity,
  CheckCircle2,
  Pencil,
  MessageSquare,
  Bug,
  Lightbulb,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/back-button";
import { useSingleHubAppDetails } from "@/hooks/useHub";
import { SafeImage } from "@/components/safe-image";
import { ExpandableText } from "@/components/expandable-text";
import DeveloperInstructions from "@/components/developerInstructions";
import { AdminAssignedTestersTable } from "@/components/admin/admin-assigned-testers-table";
import { adminCompleteApp } from "@/lib/apiCalls";
import { useToast } from "@/hooks/use-toast";
import dynamic from "next/dynamic";
import { SubmittedFeedback } from "@/components/community-dashboard/submitted-feedback";

const AdminRejectDialog = dynamic(
  () =>
    import("@/components/admin/admin-reject-dialog").then(
      (mod) => mod.AdminRejectDialog,
    ),
  { ssr: false },
);
const AdminAcceptDialog = dynamic(
  () =>
    import("@/components/admin/admin-accept-dialog").then(
      (mod) => mod.AdminAcceptDialog,
    ),
  { ssr: false },
);

export default function AdminSubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Details Dialog State
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const { toast } = useToast();

  const {
    data: project,
    isLoading,
    error,
    refetch,
  } = useSingleHubAppDetails({ id });

  const handleAdminComplete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to mark this app as COMPLETED? This will notify the owner.",
      )
    )
      return;
    setIsCompleting(true);
    try {
      await adminCompleteApp({ appId: project!.id });
      toast({ title: "Success", description: "App marked as completed." });
      refetch();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSuccess = () => {
    router.push("/admin/submissions-free");
  };

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

  const visitUrl = `https://play.google.com/store/apps/details?id=${project.androidApp.packageName}`;
  const requiredTesters = project?.totalTester || 0;

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0f151e] text-foreground min-h-screen pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="pt-2 pb-4 pl-0 xl:pl-4">
          <BackButton href="/admin/submissions-free" />
        </div>

        <main className="max-w-7xl mx-auto flex flex-col gap-8 mt-2">
          {/* Header Action Card - THE MOST CRITICAL BUTTONS & APP STATUS */}
          <div className="bg-card border border-border/60 shadow-md rounded-3xl p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5 z-10">
                <SafeImage
                  src={project.androidApp?.appLogoUrl}
                  alt={project.androidApp?.appName}
                  width={80}
                  height={80}
                  className="rounded-2xl shadow-sm border border-border"
                />
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent truncate">
                      {project.androidApp?.appName || `App #${project.appId}`}
                    </h1>
                    <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-[0.2em] uppercase shadow-sm">
                      {project.appType} Submission
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground mr-1">
                        Status:
                      </span>
                      <Badge
                        variant={
                          project.status === "REJECTED"
                            ? "destructive"
                            : "secondary"
                        }
                        className={
                          project.status === "ACCEPTED" ||
                          project.status === "AVAILABLE" ||
                          project.status === "IN_TESTING" ||
                          project.status === "COMPLETED"
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold border-emerald-500/20"
                            : "font-bold"
                        }
                      >
                        {project.status.replace("_", " ")}
                      </Badge>
                    </div>
                    {(project.status === "ACCEPTED" ||
                      project.status === "AVAILABLE" ||
                      project.status === "IN_TESTING" ||
                      project.status === "COMPLETED") && (
                      <p className="text-sm text-muted-foreground max-w-xl leading-snug">
                        {project.status === "ACCEPTED" &&
                          "This application has been approved. It is currently in the queue waiting for setup before becoming available to testers."}
                        {project.status === "AVAILABLE" &&
                          "This application is active and listed on the Dashboard. Testers can now join this project."}
                        {project.status === "IN_TESTING" &&
                          "Active testing phase. Testers are participating and feedback is being collected."}
                        {project.status === "COMPLETED" &&
                          "Testing completed. All required testers have participated and duration fulfilled."}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons Zone */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto z-10 shrink-0">
                <a
                  href={visitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground px-4 py-2.5 rounded-xl font-semibold transition-colors shadow-sm text-sm border border-border/50"
                >
                  <ExternalLink className="w-4 h-4" /> Play Store
                </a>

                {project.status === "IN_REVIEW" && (
                  <>
                    <Button
                      variant="destructive"
                      onClick={() => setShowRejectDialog(true)}
                      className="px-5 py-2.5 h-auto rounded-xl shadow-sm font-bold"
                    >
                      <X className="w-4 h-4 mr-1.5" /> Reject
                    </Button>
                    <Button
                      onClick={() => setShowAcceptDialog(true)}
                      className="px-5 py-2.5 h-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md font-bold"
                    >
                      <Check className="w-4 h-4 mr-1.5" /> Approve
                    </Button>
                  </>
                )}

                {project.status === "IN_TESTING" && (
                  <Button
                    onClick={handleAdminComplete}
                    disabled={isCompleting}
                    className="px-5 py-2.5 h-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md font-bold"
                  >
                    {isCompleting ? (
                      <Clock className="w-4 h-4 mr-1.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    )}
                    Mark Completed
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-stretch">
            {/* APP IDENTITY & DETAILS */}
            <Card className="border border-border/50 shadow-sm bg-card rounded-3xl overflow-hidden h-full flex flex-col">
              <CardHeader className="bg-secondary/20 border-b border-border/50 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  App Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 bg-background p-4 rounded-2xl border border-border/50 shadow-sm">
                  <Avatar className="h-14 w-14 border-2 border-background shadow-sm ring-2 ring-primary/10">
                    <AvatarImage
                      src={project.appOwner?.image || ""}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-secondary text-primary font-bold text-lg">
                      {project.appOwner?.name?.slice(0, 2)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base truncate">
                        {project.appOwner?.name}
                      </h3>
                      {project.appOwner?.emailVerified && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] h-4 px-1.5 bg-green-500/10 text-green-600 border-green-500/20 shrink-0"
                        >
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {project.appOwner?.email}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
                      <CalendarDays className="w-3.5 h-3.5" />
                      <span className="truncate">
                        Submitted{" "}
                        {new Date(project.createdAt).toLocaleDateString(
                          undefined,
                          { year: "numeric", month: "short", day: "numeric" },
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5" /> Package ID
                    </span>
                    <p className="font-mono text-sm break-all bg-secondary/30 p-2 rounded-xl border border-border/50">
                      {project.androidApp?.packageName}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> Category
                    </span>
                    <div className="pt-0.5">
                      <Badge
                        variant="outline"
                        className="bg-background text-sm"
                      >
                        {project.androidApp?.appCategory?.name || "N/A"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 flex-1 flex flex-col">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4" /> Description
                  </span>
                  <div className="bg-background p-4 rounded-2xl border border-border/50 flex-1">
                    <ExpandableText
                      text={project.androidApp?.description}
                      className="text-sm text-foreground/80 leading-relaxed"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* TESTING REQUIREMENTS (No Financials for Free Apps) */}
            <Card className="border border-border/50 shadow-sm bg-card rounded-3xl overflow-hidden h-full flex flex-col">
              <CardHeader className="bg-emerald-500/5 border-b border-emerald-500/10 pb-4">
                <CardTitle className="text-lg flex items-center justify-between gap-2 text-emerald-600 dark:text-emerald-500">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Execution Plan
                  </div>
                  {project.status !== "IN_REVIEW" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-lg hover:bg-emerald-500/10 text-emerald-600"
                      onClick={() => setShowAcceptDialog(true)}
                    >
                      <Pencil className="w-4 h-4" />
                      <span className="sr-only">Edit Plan</span>
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1 flex flex-col">
                {/* Primary Requirements Row */}
                <div className="grid grid-cols-3 divide-x border-b border-border/50 bg-background/50">
                  <div className="p-4 flex flex-col items-center justify-center text-center space-y-1.5 hover:bg-background transition-colors">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-primary" />
                      Testers
                    </span>
                    <span className="text-2xl font-black text-amber-600 dark:text-amber-500">
                      {requiredTesters}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col items-center justify-center text-center space-y-1.5 hover:bg-background transition-colors">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      Duration
                    </span>
                    <span className="text-2xl font-black">
                      {project.totalDay || 0}{" "}
                      <span className="text-xs font-bold text-muted-foreground lowercase">
                        Days
                      </span>
                    </span>
                  </div>
                  <div className="p-4 flex flex-col items-center justify-center text-center space-y-1.5 hover:bg-background transition-colors">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-primary" />
                      Min OS
                    </span>
                    <span className="text-2xl font-black truncate">
                      v{project.minimumAndroidVersion}
                    </span>
                  </div>
                </div>

                {/* Rewards & Payments Row */}
                <div className="grid grid-cols-2 divide-x border-b border-border/50 bg-secondary/20">
                  <div className="p-4 flex flex-col items-center justify-center text-center space-y-1.5 hover:bg-background transition-colors">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-primary" />
                      Cost Points
                    </span>
                    <span className="text-2xl font-black text-blue-600">
                      {project.costPoints || 0} <span className="text-xs font-bold text-muted-foreground lowercase">Pts</span>
                    </span>
                  </div>
                  <div className="p-4 flex flex-col items-center justify-center text-center space-y-1.5 hover:bg-background transition-colors">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-primary" />
                      Reward Points
                    </span>
                    <span className="text-2xl font-black text-emerald-600">
                      {project.rewardPoints || 0} <span className="text-xs font-bold text-muted-foreground lowercase">Pts</span>
                    </span>
                  </div>
                </div>

                <div className="p-6 bg-card flex flex-col items-center justify-center text-center gap-3">
                  <div className="p-4 bg-emerald-500/10 rounded-full">
                    <Users className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-700 dark:text-emerald-500">
                      Free Testing Campaign
                    </h4>
                    <p className="text-sm text-muted-foreground max-w-[250px] mt-1 mx-auto leading-relaxed">
                      This is a free community testing project. No direct
                      financial transactions are attached to this specific
                      submission.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rejection Details Section */}
          {project.status === "REJECTED" && (
            <Card className="border-destructive/20 shadow-sm bg-destructive/5 relative overflow-hidden rounded-3xl">
              <div className="absolute top-0 left-0 w-2 h-full bg-destructive" />
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col gap-5">
                  <div className="space-y-3">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-destructive">
                      <AlertTriangle className="w-6 h-6" />
                      Rejection Reason
                    </h2>
                    <div className="space-y-2 bg-background p-5 rounded-2xl border border-destructive/10">
                      {project.statusDetails?.title && (
                        <h3 className="font-bold text-lg text-destructive/90">
                          {project.statusDetails.title}
                        </h3>
                      )}
                      <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {project.statusDetails?.description ||
                          "No specific reason provided."}
                      </p>
                    </div>
                  </div>

                  {(project.statusDetails?.image ||
                    project.statusDetails?.video) && (
                    <div className="space-y-3 pt-2">
                      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4" /> Evidence Provided
                      </h3>
                      <div className="flex flex-wrap gap-4">
                        {project.statusDetails?.image && (
                          <div
                            className="relative h-48 w-full sm:w-72 rounded-xl overflow-hidden border bg-black/5 cursor-pointer shadow-sm group-hover:shadow-md transition-all"
                            onClick={() =>
                              setFullscreenImage(project.statusDetails!.image)
                            }
                          >
                            <SafeImage
                              src={project.statusDetails.image}
                              alt="Rejection Image"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center group">
                              <Expand className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all font-bold scale-90 group-hover:scale-100" />
                            </div>
                          </div>
                        )}
                        {project.statusDetails?.video && (
                          <div className="h-48 w-full sm:w-72 rounded-xl overflow-hidden border bg-black relative shadow-sm">
                            <video
                              src={project.statusDetails.video}
                              controls
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assigned Testers Section */}
          {(project.status === "AVAILABLE" ||
            project.status === "IN_TESTING" ||
            project.status === "COMPLETED") && (
            <div className="bg-card rounded-3xl overflow-hidden border border-border/50 shadow-sm">
              <AdminAssignedTestersTable
                testerRelations={project.testerRelations}
                appId={project.id}
                totalDays={project.totalDay || 14}
                onRefetch={refetch}
                appType="FREE"
              />
            </div>
          )}

          {/* Tester Feedback Section */}
          <SubmittedFeedback
            feedback={project.feedback}
            isCompleted={true}
            isLoading={isLoading}
          />

          {/* Developer Instructions Block */}
          {project.instructionsForTester && (
            <DeveloperInstructions
              instruction={project.instructionsForTester}
              mt={0}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <AdminRejectDialog
        appId={project.id}
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        onSuccess={handleSuccess}
      />
      <AdminAcceptDialog
        appId={project.id}
        appType={project.appType}
        open={showAcceptDialog}
        onOpenChange={setShowAcceptDialog}
        onSuccess={() => {
          refetch();
          setShowAcceptDialog(false);
        }}
        initialData={{
          totalTester: project.totalTester,
          totalDay: project.totalDay,
          minimumAndroidVersion: project.minimumAndroidVersion,
          costPoints: project.costPoints || 0,
          rewardPoints: project.rewardPoints || 0,
        }}
        isReview={project.status === "IN_REVIEW"}
      />
      {/* Fullscreen Image Viewer */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 animate-in fade-in-0"
          onClick={() => setFullscreenImage(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:text-white bg-red-500/60 hover:bg-red-500 h-12 w-12 rounded-lg z-50 transition-colors"
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
              loadingClassName="w-32 h-32 rounded-full border-4 border-white/10"
            />
          </div>
        </div>
      )}
    </div>
  );
}
