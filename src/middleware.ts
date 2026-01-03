import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

interface RoleInfo {
  name: string;
  permissions: Array<{
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
  }>;
}

interface SessionValidationResult {
  isAuthenticated: boolean;
  role: RoleInfo | null;
}

async function validateSession(request: NextRequest): Promise<SessionValidationResult> {
  const secret = process.env.BETTER_AUTH_SECRET;
  
  // Try to get role from the role_cache cookie (JWT)
  const roleCache = request.cookies.get("better-auth.role_cache")?.value;
  const sessionToken = request.cookies.get("better-auth.session_token")?.value;
  
  // If no session token exists, user is definitely not authenticated
  if (!sessionToken) {
    return { isAuthenticated: false, role: null };
  }

  // Try to decode the role cache JWT
  let role: RoleInfo | null = null;
  if (roleCache && secret) {
    try {
      const { payload } = await jwtVerify(
        roleCache,
        new TextEncoder().encode(secret)
      );
      role = (payload as any).role || null;
    } catch (err) {
      // JWT expired or invalid - role is unknown but user might still be authenticated
      role = null;
    }
  }

  // If we have a session token and either:
  // 1. Role is known (from valid JWT)
  // 2. Role is unknown (JWT expired) but session token exists
  // Consider user as authenticated. The actual session validation happens server-side.
  return {
    isAuthenticated: true,
    role,
  };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define route categories
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

  // Check if the current path requires authentication check
  const needsAuthCheck = 
    authRoutes.some((route) => pathname.startsWith(route)) ||
    authenticatedRoutes.some((route) => pathname.startsWith(route)) ||
    adminRoutes.some((route) => pathname.startsWith(route)) ||
    professionalTesterAuthRoutes.some((route) => pathname.startsWith(route)) ||
    professionalRoutes.some((route) => pathname.startsWith(route));

  // Skip validation for routes that don't need it
  if (!needsAuthCheck) {
    return NextResponse.next();
  }

  // Validate session
  const { isAuthenticated, role } = await validateSession(request);

  const isAdmin = role?.name === "admin";
  const isProfessional = role?.name === "tester";

  // If user is authenticated and tries to access login/register, redirect to dashboard
  if (
    isAuthenticated &&
    authRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAdmin && isAuthenticated && pathname.startsWith("/admin/login")) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (
    isProfessional &&
    isAuthenticated &&
    professionalTesterAuthRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/tester/dashboard", request.url));
  }

  // If user is not authenticated and tries to access a protected route, redirect to login
  if (
    !isAuthenticated &&
    authenticatedRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (
    (!isAdmin || !isAuthenticated) &&
    adminRoutes.some((route) => pathname.startsWith(route)) &&
    pathname !== "/admin/login"
  ) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (
    (!isProfessional || !isAuthenticated) &&
    professionalRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/tester/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

