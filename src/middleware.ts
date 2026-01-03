import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const secret = process.env.BETTER_AUTH_SECRET!;
  let role: {
    name: string;
    permissions: [
      {
        id: number;
        roleId: number;
        moduleId: number;
        canReadList: boolean;
        canReadSingle: boolean;
        canCreate: boolean;
        canUpdate: boolean;
        canDelete: boolean;
        createdAt: string;
        updatedAt: string;
      }
    ];
  } | null = null;

  const cookieStore = await cookies();
  const better_auth = cookieStore.get("better-auth.role_cache");
  const session_token = cookieStore.get("better-auth.session_token");

  // Track if user has a valid session (either from role_cache or session_token)
  let hasValidSession = false;

  if (better_auth) {
    try {
      const { payload } = await jwtVerify(
        better_auth?.value,
        new TextEncoder().encode(secret)
      );
      role = (payload as any).role;
      hasValidSession = !!role;
    } catch (err) {
      // Role cache JWT expired or invalid - but session token might still be valid
      role = null;
    }
  }

  // If role_cache failed but session_token exists, the user might still be authenticated
  // The session token itself is valid for 7 days, so we should trust it
  if (!hasValidSession && session_token?.value) {
    // Session token exists - user is likely still authenticated
    // The role_cache just expired. Allow access but role will be unknown.
    // The actual session validation will happen when they make API calls,
    // and the role_cache will be refreshed.
    hasValidSession = true;
  }

  const isAdmin = role?.name === "admin";
  const isProfessional = role?.name === "tester";

  const { pathname } = request.nextUrl;

  const authRoutes = ["/auth/login", "/auth/register"];
  const authenticatedRoutes = [
    "/dashboard",
    "/community-dashboard",
    "/notifications",
    "/profile",
    "/wallet",
    "/billing",
  ];
  const adminRoutes = ["/admin"];
  const professionalTesterAuthRoutes = ["/tester/login", "/tester/register"];
  const professionalRoutes = ["/tester/dashboard"];

  // If user has a valid session and tries to access login/register, redirect to dashboard
  if (
    hasValidSession &&
    authRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAdmin && hasValidSession && pathname.startsWith("/admin/login")) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (
    isProfessional &&
    hasValidSession &&
    professionalTesterAuthRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/tester/dashboard", request.url));
  }

  // If user is not authenticated and tries to access a protected route, redirect to login
  if (
    !hasValidSession &&
    authenticatedRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (
    (!isAdmin || !hasValidSession) &&
    adminRoutes.some((route) => pathname.startsWith(route)) &&
    pathname !== "/admin/login"
  ) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (
    (!isProfessional || !hasValidSession) &&
    professionalRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/tester/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
