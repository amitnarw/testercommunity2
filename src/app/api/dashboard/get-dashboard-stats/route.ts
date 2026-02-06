import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    data: {
      wallet: 3,
      inReviewApps: [],
      statusCounts: [],
    },
  });
}
