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
  Image as ImageIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/back-button";
import { useSingleHubAppDetails } from "@/hooks/useHub";
import { SafeImage } from "@/components/safe-image";
import { ExpandableText } from "@/components/expandable-text";
import { AppInfoSidebar } from "@/components/appInfoSidebar";
import { AdminRejectDialog } from "@/components/admin/admin-reject-dialog";
import { AdminAcceptDialog } from "@/components/admin/admin-accept-dialog";

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

  const { data: project, isLoading, error } = useSingleHubAppDetails({ id });

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

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0f151e] text-foreground min-h-screen pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="sticky top-0 z-[50] pt-2 sm:pt-3 pb-4 pl-0 xl:pl-8 w-1/2">
          <BackButton href="/admin/submissions-free" />
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
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col items-start justify-between gap-6">
                      <div className="space-y-2 relative">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                          <ShieldAlert className="absolute sm:static -top-2 -right-2 scale-[2] sm:scale-100 w-6 h-6 text-amber-500 opacity-50 sm:opacity-100" />
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
                          className="flex-1 md:flex-none h-12 px-6 text-sm sm:text-md font-semibold rounded-xl bg-gradient-to-br from-red-500 to-red-500/50 hover:from-red-500 hover:to-red-600 text-white shadow-lg hover:shadow-red-500/40"
                        >
                          <X className="w-4 h-4 mr-0 sm:mr-2" /> Reject
                        </Button>
                        <Button
                          onClick={() => setShowAcceptDialog(true)}
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

            {/* Rejection Details Section */}
            {project.status === "REJECTED" && (
              <section className="shadow-xl shadow-gray-200 dark:shadow-gray-900 bg-card">
                <Card className="border-0 bg-transparent overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-500 to-red-700" />
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col gap-6">
                      <div className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2 text-destructive">
                          <AlertTriangle className="w-6 h-6 absolute sm:static scale-[2] sm:scale-100 top-5 right-5 opacity-50 sm:opacity-100" />
                          Submission Rejected
                        </h2>

                        <div className="space-y-2 bg-destructive/5 p-4 rounded-xl border border-destructive/10">
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
                          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <ShieldAlert className="w-3 h-3" /> Admin Evidence
                          </h3>
                          <div className="flex flex-wrap gap-4">
                            {project.statusDetails?.image && (
                              <div className="space-y-2 group">
                                <div
                                  className="relative h-48 w-full sm:w-72 rounded-xl overflow-hidden border bg-black/5 cursor-pointer shadow-sm group-hover:shadow-md transition-all"
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
                                    <Expand className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 group-hover:scale-100 duration-200" />
                                  </div>
                                </div>
                                <span className="text-xs text-muted-foreground flex items-center gap-1.5 px-1">
                                  <ImageIcon className="w-3.5 h-3.5" /> Image
                                  Attachment
                                </span>
                              </div>
                            )}

                            {project.statusDetails?.video && (
                              <div className="space-y-2">
                                <div className="h-48 w-full sm:w-72 rounded-xl overflow-hidden border bg-black relative shadow-sm">
                                  <video
                                    src={project.statusDetails.video}
                                    controls
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground flex items-center gap-1.5 px-1">
                                  <Video className="w-3.5 h-3.5" /> Video
                                  Attachment
                                </span>
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

            {/* Approved/Active Status Section */}
            {(project.status === "ACCEPTED" ||
              project.status === "AVAILABLE" ||
              project.status === "IN_TESTING" ||
              project.status === "COMPLETED") && (
              <section className="shadow-xl shadow-gray-200 dark:shadow-gray-900 bg-card">
                <Card className="border-0 bg-transparent overflow-hidden relative">
                  <div
                    className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${project.status === "COMPLETED" ? "from-blue-500 to-indigo-600" : "from-green-500 to-emerald-600"}`}
                  />
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-start gap-5">
                      <div
                        className={`p-4 rounded-full absolute sm:static scale-[2] sm:scale-100 top-0 right-0 ${project.status === "COMPLETED" ? "bg-blue-500/10 opacity-50 sm:opacity-100 text-blue-600 dark:text-blue-400" : "bg-green-500/10 opacity-50 sm:opacity-100 text-green-600 dark:text-green-400"}`}
                      >
                        {project.status === "COMPLETED" ? (
                          <Check className="w-6 h-6" />
                        ) : (
                          <ShieldAlert className="w-6 h-6" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <h2
                          className={`text-2xl font-bold ${project.status === "COMPLETED" ? "text-blue-700 dark:text-blue-400" : "text-green-700 dark:text-green-400"}`}
                        >
                          {project.status === "COMPLETED"
                            ? "Testing Completed"
                            : "App Approved & Active"}
                        </h2>
                        <p className="text-muted-foreground text-base leading-relaxed max-w-2xl">
                          {project.status === "ACCEPTED" &&
                            "This application has been approved by the administration. It is currently in the queue waiting for the required initial setup before becoming available to testers."}
                          {project.status === "AVAILABLE" &&
                            "This application is fully approved and is currently listed on the Community Dashboard. Testers can now view and join this testing project."}
                          {project.status === "IN_TESTING" &&
                            "This application is currently in the active testing phase. Testers are actively engaged, and feedback is being collected."}
                          {project.status === "COMPLETED" &&
                            "The testing phase for this application has been successfully completed. All required testers have participated, and the duration has been fulfilled."}
                        </p>

                        {project.status !== "COMPLETED" && (
                          <div className="pt-2">
                            <Badge
                              variant="outline"
                              className="px-3 py-1 text-sm border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
                            >
                              Current Status: {project.status.replace("_", " ")}
                            </Badge>
                          </div>
                        )}
                      </div>
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
              onSuccess={handleSuccess}
            />

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
