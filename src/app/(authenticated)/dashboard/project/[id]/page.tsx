"use client";

import { notFound } from "next/navigation";
import ProjectDetailsView from "@/components/dashboard/project-details-view";
import { use } from "react";
import { useSingleHubAppDetails } from "@/hooks/useHub";
import type { Project, HubSubmittedAppResponse } from "@/lib/types";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: appData, isPending } = useSingleHubAppDetails({
    id,
    view: "owner",
  });

  if (isPending) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!appData) {
    notFound();
  }

  const mapToProject = (app: HubSubmittedAppResponse): Project => {
    let status: Project["status"] = "In Review";
    if (app.status === "DRAFT") status = "Draft";
    else if (app.status === "REJECTED") status = "Rejected";
    else if (app.status === "IN_TESTING") status = "In Testing";
    else if (app.status === "COMPLETED") status = "Completed";
    else if (app.status === "IN_REVIEW") status = "In Review";
    else if (
      app.status === ("AVAILABLE" as any) ||
      app.status === ("ACCEPTED" as any)
    )
      status = "Approved";

    const mappedTesters =
      app.testerRelations?.map((tr) => ({
        id: tr.testerId,
        name: tr.tester?.name || "Tester",
        avatar: tr.tester?.image || "",
        country: tr.tester?.userDetail?.country || "Unknown",
        device: tr.tester?.userDetail?.device_model || "Unknown",
        ram: tr.tester?.userDetail?.ram || "Unknown",
        os: tr.tester?.userDetail?.os || "Unknown",
        screenSize: tr.tester?.userDetail?.screen_resolution || "Unknown",
        language: tr.tester?.userDetail?.language || "Unknown",
        network: tr.tester?.userDetail?.network || "Unknown",
        rating: 5,
      })) || [];

    const deviceMap = new Map<string, number>();
    const osMap = new Map<string, number>();

    mappedTesters.forEach((t) => {
      deviceMap.set(t.device, (deviceMap.get(t.device) || 0) + 1);
      osMap.set(t.os, (osMap.get(t.os) || 0) + 1);
    });

    return {
      id: app.id,
      name: app.androidApp?.appName || "Unknown App",
      packageName: app.androidApp?.packageName || "",
      icon: app.androidApp?.appLogoUrl || "",
      category: "App",
      status: status,
      testersStarted: app.currentTester || 0,
      testersCompleted: 0,
      totalDays: app.totalDay || 14,
      avgTestersPerDay:
        app.currentDay > 0 ? (app.currentTester || 0) / app.currentDay : 0,
      startedFrom: app.createdAt
        ? format(new Date(app.createdAt), "MMM d, yyyy")
        : "N/A",
      description: app.androidApp?.description || "",
      testingInstructions: app.instructionsForTester || "",
      androidVersion: `Android ${app.minimumAndroidVersion || 0}+`,
      pointsCost: app.costPoints || 0,
      crashFreeRate: 100,
      overallRating: 0,
      feedbackBreakdown: { bugs: 0, suggestions: 0, praise: 0 },
      performanceMetrics: { cpuUsage: 0, memoryUsage: 0, startupTime: 0 },
      deviceCoverage: Array.from(deviceMap.entries()).map(
        ([device, testers]) => ({
          device,
          testers,
        }),
      ),
      osCoverage: Array.from(osMap.entries()).map(([version, testers]) => ({
        version,
        testers,
      })),
      topGeographies: [],
      feedback:
        app.feedback?.map((fb) => ({
          id: fb.id.toString(),
          type:
            fb.type === "BUG"
              ? "Bug"
              : fb.type === "SUGGESTION"
                ? "Suggestion"
                : "Praise",
          content: fb.message,
          date: format(new Date(fb.createdAt), "MMM d, yyyy"),
          testerId: fb.testerId || "",
          testerName: fb.tester?.name || "Tester",
          testerAvatar: "",
          priority: fb.priority
            ? ((fb.priority.charAt(0).toUpperCase() +
                fb.priority.slice(1).toLowerCase()) as any)
            : "Low",
          screenshot: fb.media?.type === "IMAGE" ? fb.media.src : undefined,
          videoUrl: fb.media?.type === "VIDEO" ? fb.media.src : undefined,
        })) || [],
      dataAiHint: app.androidApp?.appName,
      chartData: [],
      testers: mappedTesters,
      rejectionReason: app.statusDetails
        ? {
            title: app.statusDetails.title,
            description: app.statusDetails.description,
            imageUrl: app.statusDetails.image,
            videoUrl: app.statusDetails.video,
          }
        : undefined,
    } as unknown as Project;
  };

  const project = mapToProject(appData);

  return <ProjectDetailsView project={project} />;
}
