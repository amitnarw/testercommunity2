import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path, "GET");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path, "POST");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path, "PUT");
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path, "DELETE");
}

/**
 * Modify Set-Cookie header to work on the frontend domain
 * - Removes Domain attribute (cookie will default to current domain)
 * - Adjusts Secure and SameSite based on environment
 */
function modifySetCookieHeader(cookie: string, isSecure: boolean): string {
  // Parse cookie parts
  const parts = cookie.split(";").map(p => p.trim());
  
  // Filter out Domain attribute and potentially modify Secure/SameSite
  const modifiedParts = parts.filter(part => {
    const lower = part.toLowerCase();
    // Remove domain attribute
    if (lower.startsWith("domain=")) return false;
    return true;
  });
  
  // Ensure proper Secure flag based on protocol
  const hasSecure = modifiedParts.some(p => p.toLowerCase() === "secure");
  if (isSecure && !hasSecure) {
    modifiedParts.push("Secure");
  } else if (!isSecure && hasSecure) {
    // Remove Secure flag for non-HTTPS (development)
    const secureIndex = modifiedParts.findIndex(p => p.toLowerCase() === "secure");
    if (secureIndex !== -1) {
      modifiedParts.splice(secureIndex, 1);
    }
  }
  
  return modifiedParts.join("; ");
}

async function proxyRequest(
  request: NextRequest,
  path: string[],
  method: string
) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { error: "Backend URL not configured" },
      { status: 500 }
    );
  }

  const targetPath = `/api/auth/${path.join("/")}`;
  const targetUrl = `${BACKEND_URL}${targetPath}`;

  try {
    // Get request body for POST/PUT requests
    let body: string | undefined;
    if (method !== "GET" && method !== "HEAD") {
      try {
        body = await request.text();
      } catch {
        body = undefined;
      }
    }

    // Forward cookies from the incoming request
    const cookieHeader = request.headers.get("cookie") || "";

    // Build headers to forward
    const headers: HeadersInit = {
      "Content-Type": request.headers.get("content-type") || "application/json",
      Cookie: cookieHeader,
    };

    // Make request to backend
    const backendResponse = await fetch(targetUrl, {
      method,
      headers,
      body: body || undefined,
      credentials: "include",
    });

    // Get response body
    const responseData = await backendResponse.text();

    // Create response with same status
    const response = new NextResponse(responseData, {
      status: backendResponse.status,
      headers: {
        "Content-Type": backendResponse.headers.get("content-type") || "application/json",
      },
    });

    // Determine if we're on HTTPS (production) or HTTP (development)
    const isSecure = request.url.startsWith("https://") || 
                     request.headers.get("x-forwarded-proto") === "https";

    // Forward Set-Cookie headers from backend to client
    // Modify them to work on the frontend domain
    const setCookieHeaders = backendResponse.headers.getSetCookie();
    for (const cookie of setCookieHeaders) {
      const modifiedCookie = modifySetCookieHeader(cookie, isSecure);
      response.headers.append("Set-Cookie", modifiedCookie);
    }

    return response;
  } catch (error) {
    console.error("Auth proxy error:", error);
    return NextResponse.json(
      { error: "Failed to proxy request to backend" },
      { status: 500 }
    );
  }
}

