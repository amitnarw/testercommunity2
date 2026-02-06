import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  // Simulate processing
  return NextResponse.json({
    message: "App submitted successfully",
    data: "app-id-123",
  });
}
