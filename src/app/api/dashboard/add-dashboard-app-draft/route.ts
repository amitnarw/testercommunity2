import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  // Simulate processing
  return NextResponse.json({
    message: "Draft saved successfully",
    data: "draft-id-123",
  });
}
