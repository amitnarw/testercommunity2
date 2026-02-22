"use client";

import { useState, use } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/back-button";
import { useAcceptApp, useUpdateProjectStatus } from "@/hooks/useAdmin";
import { useSingleHubAppDetails } from "@/hooks/useHub";
import { toast } from "@/hooks/use-toast";
import { SafeImage } from "@/components/safe-image";
import { ExpandableText } from "@/components/expandable-text";
import { AppInfoSidebar } from "@/components/appInfoSidebar";
import DeveloperInstructions from "@/components/developerInstructions";
import { StatusDropdown } from "@/components/dashboard/status-dropdown";
import dynamic from "next/dynamic";

const APP_STATUS_OPTIONS = [
  {
    value: "PENDING",
    label: "Pending",
    dotClass: "bg-gray-500",
    desc: "Awaiting submission",
    color: "#6b7280",
  },
  {
    value: "IN_REVIEW",
    label: "In Review",
    dotClass: "bg-yellow-500",
    desc: "Currently under review",
    color: "#eab308",
  },
  {
    value: "ACCEPTED",
    label: "Accepted",
    dotClass: "bg-blue-500",
    desc: "Approved, awaiting setup",
    color: "#3b82f6",
  },
  {
    value: "AVAILABLE",
    label: "Available",
    dotClass: "bg-emerald-500",
    desc: "Ready for testers",
    color: "#10b981",
  },
  {
    value: "IN_TESTING",
    label: "In Testing",
    dotClass: "bg-purple-500",
    desc: "Test is in progress",
    color: "#a855f7",
  },
  {
    value: "COMPLETED",
    label: "Completed",
    dotClass: "bg-green-500",
    desc: "Testing finished",
    color: "#22c55e",
  },
  {
    value: "REJECTED",
    label: "Rejected",
    dotClass: "bg-red-500",
    desc: "Submission rejected",
    color: "#ef4444",
  },
];

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

  const {
    data: project,
    isLoading,
    error,
    refetch,
  } = useSingleHubAppDetails({ id });

  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateProjectStatus({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "App status updated to In Testing successfully.",
        });
        refetch();
      },
      onError: (err: any) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: err?.message || "Failed to update app status.",
        });
      },
    });

  const handleStatusUpdate = (status: string) => {
    if (!project) return;
    if (
      !window.confirm(
        `Are you sure you want to change the status to ${status}?`,
      )
    )
      return;
    updateStatus({ id: project.id, status });
  };

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

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0f151e] text-foreground min-h-screen mb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="pt-2 pb-4 pl-0 xl:pl-8 w-1/2">
          <BackButton href="/admin/submissions-paid" />
        </div>

        <main className="max-w-7xl mx-auto flex flex-col gap-6 mt-4">
          {/* Header with Actions */}
          <div className="bg-background/80 border border-border/50 shadow-sm rounded-2xl p-3 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3 relative">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                  {project.androidApp?.appName || `App #${project.appId}`}
                </h1>
                <Badge
                  variant="outline"
                  className="text-xs uppercase tracking-wider absolute -top-2 -right-2 sm:static"
                >
                  {project.appType}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground mr-1">
                  Status:
                </span>
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
                  {project.status.replace("_", " ")}
                </Badge>
              </div>
            </div>

            {/* Top Level Actions */}
            <div className="flex flex-row sm:flex-col justify-center sm:justify-end items-center md:items-end gap-2 sm:gap-3 w-full md:w-auto mt-4 md:mt-0">
              <div className="flex flex-wrap justify-end gap-1 md:gap-3 w-auto">
                {project.status === "IN_REVIEW" && (
                  <>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setShowRejectDialog(true)}
                      className="flex-1 md:flex-none shadow-sm"
                    >
                      <X className="w-4 h-4 mr-1.5" /> Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setShowAcceptDialog(true)}
                      className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
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
                    size="sm"
                    onClick={() => setShowManageTestersDialog(true)}
                    className="flex-none shadow-sm"
                  >
                    <Users className="w-4 h-4 mr-1.5 text-primary hidden m:block" />{" "}
                    Manage Testers
                  </Button>
                )}
                {project.status === "AVAILABLE" && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusUpdate("IN_TESTING")}
                    disabled={isUpdating}
                    className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    ) : (
                      <Clock className="w-4 h-4 mr-1.5" />
                    )}
                    {isUpdating ? "Updating..." : "Start Testing"}
                  </Button>
                )}
              </div>
              <StatusDropdown
                label="App Status"
                options={APP_STATUS_OPTIONS}
                value={project.status}
                onChange={(newStatus) => handleStatusUpdate(newStatus)}
              />
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6 overflow-hidden">
              {/* Summary Cards Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="bg-card/50 border border-border/50">
                  <CardContent className="p-4 flex flex-col justify-center h-full">
                    <p className="text-xs font-medium flex items-center gap-1.5 mb-1 text-primary">
                      Package
                    </p>
                    <p
                      className="font-mono text-xs font-semibold truncate"
                      title={project.androidApp?.packageName}
                    >
                      {project.androidApp?.packageName}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 border border-border/50">
                  <CardContent className="p-4 flex flex-col justify-center h-full">
                    <p className="text-xs font-medium flex items-center gap-1.5 mb-1 text-primary">
                      Category
                    </p>
                    <p className="text-sm font-semibold truncate">
                      {project.androidApp?.appCategory?.name || "N/A"}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 border border-border/50">
                  <CardContent className="p-4 flex flex-col justify-center h-full">
                    <p className="text-xs text-amber-600 dark:text-amber-500 font-medium flex items-center gap-1.5 mb-1">
                      <Users className="w-3.5 h-3.5" /> Testers
                    </p>
                    <p className="text-lg font-bold">
                      {project.currentTester || 0}{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        / {project.totalTester}
                      </span>
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 border border-border/50">
                  <CardContent className="p-4 flex flex-col justify-center h-full">
                    <p className="text-xs text-amber-600 dark:text-amber-500 font-medium flex items-center gap-1.5 mb-1">
                      <Clock className="w-3.5 h-3.5" /> Duration
                    </p>
                    <p className="text-lg font-bold">
                      {project.totalDay || 0}{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        Days
                      </span>
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Description & Internal Details */}
              <Card className="border border-border/50 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Description
                  </h3>
                  <ExpandableText
                    text={project.androidApp?.description}
                    className="text-muted-foreground text-sm leading-relaxed mb-6"
                  />

                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/50">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-primary" /> Min
                        Android
                      </p>
                      <p className="font-semibold text-md">
                        Android {project.minimumAndroidVersion}+
                      </p>
                    </div>
                    {(project.costPoints || 0) > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-emerald-500" />{" "}
                          Reward
                        </p>
                        <p className="font-semibold text-md text-emerald-600 dark:text-emerald-400">
                          {project.costPoints} Points
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Rejection Details Section */}
              {project.status === "REJECTED" && (
                <section className="mb-6">
                  <Card className="border-destructive/20 shadow-sm bg-destructive/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-destructive" />
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex flex-col gap-4">
                        <div className="space-y-3">
                          <h2 className="text-xl font-bold flex items-center gap-2 text-destructive">
                            <AlertTriangle className="w-5 h-5 absolute sm:static scale-[2] sm:scale-100 top-4 right-4 opacity-10 sm:opacity-100" />
                            Rejection Reason
                          </h2>

                          <div className="space-y-2">
                            {project.statusDetails?.title && (
                              <h3 className="font-semibold text-md text-destructive/90">
                                {project.statusDetails.title}
                              </h3>
                            )}
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                              {project.statusDetails?.description ||
                                "No specific reason provided."}
                            </p>
                          </div>
                        </div>

                        {(project.statusDetails?.image ||
                          project.statusDetails?.video) && (
                          <div className="space-y-3 pt-4 border-t border-destructive/10">
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                              <ShieldAlert className="w-3 h-3" /> Evidence
                            </h3>
                            <div className="flex flex-wrap gap-4">
                              {project.statusDetails?.image && (
                                <div className="space-y-2 group">
                                  <div
                                    className="relative h-32 w-full sm:w-48 rounded-lg overflow-hidden border bg-black/5 cursor-pointer shadow-sm group-hover:shadow-md transition-all"
                                    onClick={() =>
                                      setFullscreenImage(
                                        project.statusDetails!.image,
                                      )
                                    }
                                  >
                                    <SafeImage
                                      src={project.statusDetails.image}
                                      alt="Rejection Image"
                                      fill
                                      className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                      <Expand className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 group-hover:scale-100 duration-200" />
                                    </div>
                                  </div>
                                </div>
                              )}

                              {project.statusDetails?.video && (
                                <div className="space-y-2">
                                  <div className="h-32 w-full sm:w-48 rounded-lg overflow-hidden border bg-black relative shadow-sm">
                                    <video
                                      src={project.statusDetails.video}
                                      controls
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </section>
              )}

              {/* Rejection Modal */}
              <AdminRejectDialog
                appId={project.id}
                open={showRejectDialog}
                onOpenChange={setShowRejectDialog}
                onSuccess={handleSuccess}
              />

              {/* Accept Modal */}
              <AdminAcceptDialog
                appId={project.id}
                open={showAcceptDialog}
                onOpenChange={setShowAcceptDialog}
                onSuccess={() => {
                  refetch();
                  setShowAcceptDialog(false);
                }}
              />

              {/* Manage Testers Modal */}
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

              {/* Assigned Testers Table */}
              {(project.status === "ACCEPTED" ||
                project.status === "AVAILABLE" ||
                project.status === "IN_TESTING" ||
                project.status === "COMPLETED") && (
                <AdminAssignedTestersTable
                  testerRelations={project.testerRelations}
                  appId={project.id}
                  onRefetch={() => refetch()}
                />
              )}

              {/* Previous Instructions Block (for reference) */}
              {project.instructionsForTester && (
                <DeveloperInstructions
                  instruction={project.instructionsForTester}
                  mt={0}
                />
              )}
            </div>{" "}
            {/* End of lg:col-span-2 space-y-6 overflow-hidden */}
            {/* Right Column (Sidebars) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="block lg:hidden">
                <AppInfoSidebar
                  app={project}
                  hideButton={true}
                  visitUrl={visitUrl}
                />
              </div>
              <aside className="hidden lg:block">
                <AppInfoSidebar
                  app={project}
                  hideButton={true}
                  visitUrl={visitUrl}
                />
              </aside>
            </div>
          </div>{" "}
          {/* End of grid lg:grid-cols-3 gap-6 */}
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
