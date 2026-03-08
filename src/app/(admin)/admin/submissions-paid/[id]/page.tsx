"use client";

import { useState, use } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Smartphone,
  Calendar,
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
  CreditCard,
  Image as ImageIcon,
  Bug,
  Lightbulb,
  PartyPopper,
  MessageSquare,
  Wallet,
  TrendingUp,
  ExternalLink,
  User,
  CalendarDays,
  Activity,
  ArrowRight,
  ChevronRight,
  Pencil,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/back-button";
import { useSingleHubAppDetails } from "@/hooks/useHub";
import { toast } from "@/hooks/use-toast";
import { SafeImage } from "@/components/safe-image";
import { ExpandableText } from "@/components/expandable-text";
import DeveloperInstructions from "@/components/developerInstructions";
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
const AdminStartTestingDialog = dynamic(
  () =>
    import("@/components/admin/admin-start-testing-dialog").then(
      (mod) => mod.AdminStartTestingDialog,
    ),
  { ssr: false },
);
const AdminManageTestersDialog = dynamic(
  () =>
    import("@/components/admin/admin-manage-testers-dialog").then(
      (mod) => mod.AdminManageTestersDialog,
    ),
  { ssr: false },
);
const AdminAssignedTestersTable = dynamic(
  () =>
    import("@/components/admin/admin-assigned-testers-table").then(
      (mod) => mod.AdminAssignedTestersTable,
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
  const [showManageTestersDialog, setShowManageTestersDialog] = useState(false);
  const [showStartTestingDialog, setShowStartTestingDialog] = useState(false);

  const {
    data: project,
    isLoading,
    error,
    refetch,
  } = useSingleHubAppDetails({ id });

  const handleSuccess = () => {
    router.push("/admin/submissions-paid");
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

  // Derived calculations for interconnected financial representation
  const requiredTesters = project.totalTester || 0;
  const rewardPerTester = project.rewardMoney || 0;
  const amountPaidByDeveloper =
    project.costMoney || project.paymentInfo?.amountPaid || 0;
  const totalPayout = requiredTesters * rewardPerTester;
  const platformEarnings = amountPaidByDeveloper - totalPayout;
  const isLoss = platformEarnings < 0;

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0f151e] text-foreground min-h-screen pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="pt-2 pb-4 pl-0 xl:pl-4">
          <BackButton href="/admin/submissions-paid" />
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
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                      {project.androidApp?.appName || `App #${project.appId}`}
                    </h1>
                    <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-[0.2em] uppercase shadow-sm">
                      {project.appType} Submission
                    </div>
                  </div>
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

                {(project.status === "ACCEPTED" ||
                  project.status === "AVAILABLE" ||
                  project.status === "IN_TESTING") && (
                  <Button
                    variant="outline"
                    onClick={() => setShowManageTestersDialog(true)}
                    className="px-5 py-2.5 h-auto rounded-xl shadow-sm border-primary/20 hover:border-primary/50 text-primary font-bold bg-primary/5"
                  >
                    <Users className="w-4 h-4 mr-1.5" /> Manage Testers
                  </Button>
                )}

                {project.status === "AVAILABLE" && (
                  <Button
                    onClick={() => setShowStartTestingDialog(true)}
                    className="px-6 py-2.5 h-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md font-bold shadow-blue-600/20"
                  >
                    <Clock className="w-4 h-4 mr-1.5" /> Start Testing
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
                {/* Developer Info injected intelligently */}
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
              </CardContent>
            </Card>

            {/* FINANCIALS & TESTING REQUIREMENTS */}
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
                {/* Requirements Grid */}
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
                    <span className="text-2xl font-black">
                      v{project.minimumAndroidVersion}
                    </span>
                  </div>
                </div>

                {/* Financial Breakdown Sequence */}
                <div className="p-6 space-y-6 flex-1 flex flex-col justify-center bg-card">
                  {/* Step 1: Input */}
                  <div className="flex justify-between items-center p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-blue-600/70 dark:text-blue-400/70 uppercase tracking-widest mb-0.5">
                          Paid by Developer
                        </p>
                        <p className="font-bold text-sm text-foreground">
                          Initial Revenue
                        </p>
                      </div>
                    </div>
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                      ₹{amountPaidByDeveloper.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Step 2: Distribution */}
                  <div className="relative pl-7 space-y-5">
                    {/* Dashed connector line */}
                    <div className="absolute left-3.5 top-0 bottom-6 w-px bg-border/80 border-dashed" />

                    <div className="relative group">
                      <div className="absolute -left-[29px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-[3px] border-background bg-muted-foreground transition-colors group-hover:bg-red-400 z-10" />
                      <div className="flex justify-between items-center text-sm py-3 px-4 rounded-2xl bg-background border border-border/50 shadow-sm hover:border-border transition-colors">
                        <span className="text-muted-foreground font-medium flex items-center gap-2">
                          <Users className="w-4 h-4 text-emerald-500" />
                          {requiredTesters || 0} Testers × ₹
                          {rewardPerTester.toLocaleString("en-IN")}
                        </span>
                        <span className="font-bold text-red-500 dark:text-red-400">
                          -₹{totalPayout.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    <div className="relative group">
                      <div className="absolute -left-[29px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-[3px] border-background bg-emerald-500 transition-transform group-hover:scale-110 z-10 shadow-sm shadow-emerald-500/20" />
                      <div className="flex justify-between items-center py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 shadow-sm">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Platform Earnings
                        </span>
                        <span
                          className={`text-2xl font-black ${isLoss ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-500"}`}
                        >
                          {isLoss && "-"}₹
                          {Math.abs(platformEarnings).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
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

          {/* Active Testing Stats / Assigned Testers Placeholder Area */}

          {/* Active Testing Stats / Assigned Testers Placeholder Area */}
          {(project.status === "ACCEPTED" ||
            project.status === "AVAILABLE" ||
            project.status === "IN_TESTING" ||
            project.status === "COMPLETED") && (
            <div className="rounded-3xl overflow-hidden border border-border/50 shadow-sm bg-card">
              <AdminAssignedTestersTable
                testerRelations={project.testerRelations}
                appId={project.id}
                totalDays={project.totalDay || 14}
                onRefetch={() => refetch()}
                appType="PAID"
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
        paymentInfo={project.paymentInfo}
        open={showAcceptDialog}
        onOpenChange={setShowAcceptDialog}
        onSuccess={() => {
          refetch();
          setShowAcceptDialog(false);
        }}
        initialData={
          project.status !== "IN_REVIEW"
            ? {
                totalTester: project.totalTester,
                totalDay: project.totalDay,
                minimumAndroidVersion: project.minimumAndroidVersion,
                rewardMoney: project.rewardMoney,
              }
            : undefined
        }
      />
      <AdminStartTestingDialog
        appId={project.id}
        open={showStartTestingDialog}
        onOpenChange={setShowStartTestingDialog}
        onSuccess={() => refetch()}
      />
      <AdminManageTestersDialog
        appId={project.id}
        open={showManageTestersDialog}
        onOpenChange={setShowManageTestersDialog}
        onSuccess={() => refetch()}
        totalRequired={project.totalTester}
        currentAssigned={project.currentTester}
        assignedTesterIds={
          project.testerRelations?.map((rel) => rel.testerId) || []
        }
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
