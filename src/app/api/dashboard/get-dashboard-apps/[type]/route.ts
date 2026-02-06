import { NextResponse } from "next/server";
import { projects } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ type: string }> },
) {
  const { type } = await params;

  let filterStatus = "";
  switch (type) {
    case "DRAFT":
      filterStatus = "Draft";
      break;
    case "IN_REVIEW":
      filterStatus = "In Review";
      break;
    case "REJECTED":
      filterStatus = "Rejected";
      break;
    case "IN_TESTING":
      filterStatus = "In Testing";
      break;
    case "COMPLETED":
      filterStatus = "Completed";
      break;
    default:
      return NextResponse.json({ data: [] });
  }

  const filteredProjects = projects.filter((p) => p.status === filterStatus);

  // Map to HubSubmittedAppResponse format
  const mappedApps = filteredProjects.map((p) => ({
    id: p.id,
    appId: p.id,
    appOwnerId: "user-1", // Mock
    status: type, // Return the requested type (enum string)
    androidApp: {
      appName: p.name,
      packageName: p.packageName,
      appLogoUrl: p.icon,
      description: p.description,
    },
    currentTester: p.testersStarted,
    totalTester: 20, // Mock
    currentDay: p.totalDays,
    totalDay: 14,
    createdAt: new Date(
      p.startedFrom !== "N/A" ? p.startedFrom : Date.now(),
    ).toISOString(),
    updatedAt: new Date().toISOString(),
    instructionsForTester: p.testingInstructions,
    rewardPoints: p.pointsCost,
    costPoints: p.pointsCost,
    averageTimeTesting: null,
    minimumAndroidVersion: parseInt(p.androidVersion) || 10,
    statusDetails: null,
    feedback: [],
    appType: "PAID",
    appOwner: {
      id: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      name: "Demo User",
      email: "demo@example.com",
      emailVerified: true,
      image: null,
    },
  }));

  return NextResponse.json({
    data: mappedApps,
  });
}
