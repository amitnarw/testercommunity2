import { NextResponse } from "next/server";
import { projects } from "@/lib/data";

export async function GET() {
  const counts = {
    DRAFT: 0,
    IN_REVIEW: 0,
    REJECTED: 0,
    IN_TESTING: 0,
    COMPLETED: 0,
  };

  projects.forEach((p) => {
    switch (p.status) {
      case "Draft":
        counts.DRAFT++;
        break;
      case "In Review":
        counts.IN_REVIEW++;
        break;
      case "Rejected":
        counts.REJECTED++;
        break;
      case "In Testing":
        counts.IN_TESTING++;
        break;
      case "Completed":
        counts.COMPLETED++;
        break;
    }
  });

  return NextResponse.json({
    data: counts,
  });
}
