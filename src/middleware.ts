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

async function validateSession(
  request: NextRequest,
): Promise<SessionValidationResult> {
  const secret = process.env.BETTER_AUTH_SECRET;

  // Try to get role from the role_cache cookie (JWT)
  const roleCache = request.cookies
    .getAll()
    .find(
      (c) =>
        c.name === "better-auth.role_cache" || c.name.endsWith(".role_cache"),
    )?.value;

  // More flexible session token check (handles Secure/Host prefixes)
  const sessionToken = request.cookies
    .getAll()
    .find(
      (c) =>
        c.name === "better-auth.session_token" ||
        c.name.endsWith(".session_token"),
    )?.value;

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
        new TextEncoder().encode(secret),
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

  // Redirect /admin to /admin/dashboard
  if (pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Redirect /tester to /tester/dashboard
  if (pathname === "/tester") {
    return NextResponse.redirect(new URL("/tester/dashboard", request.url));
  }

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
  const testerAuthRoutes = ["/tester/login", "/tester/register"];
  const testerRoutes = ["/tester/dashboard"];

  // Check if the current path requires authentication check
  const needsAuthCheck =
    authRoutes.some((route) => pathname.startsWith(route)) ||
    authenticatedRoutes.some((route) => pathname.startsWith(route)) ||
    adminRoutes.some((route) => pathname.startsWith(route)) ||
    testerAuthRoutes.some((route) => pathname.startsWith(route)) ||
    testerRoutes.some((route) => pathname.startsWith(route));

  // Skip validation for routes that don't need it
  if (!needsAuthCheck) {
    return NextResponse.next();
  }

  // Validate session
  const { isAuthenticated, role } = await validateSession(request);

  // Robust role detection (handles string or object)
  const roleName = typeof role === "string" ? role : role?.name;
  const lowerRole = roleName?.toLowerCase() || "";
  const isSuperAdmin = lowerRole === "super_admin";
  const isAdmin = ["admin", "moderator", "support"].includes(lowerRole);
  const isTester = lowerRole === "tester";
  const isUser = lowerRole === "user";

  // Super admin has full access to all routes - skip all restrictions
  if (isSuperAdmin) {
    return NextResponse.next();
  }

  // If user is authenticated and tries to access login/register, redirect to dashboard
  if (
    isAuthenticated &&
    authRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Handle admin login page redirection for authenticated users
  if (isAuthenticated && pathname.startsWith("/admin/auth/login")) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (
    isTester &&
    isAuthenticated &&
    testerAuthRoutes.some((route) => pathname.startsWith(route))
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

  // Admin route protection
  if (
    !isAuthenticated &&
    adminRoutes.some((route) => pathname.startsWith(route)) &&
    !pathname.startsWith("/admin/auth/login")
  ) {
    return NextResponse.redirect(new URL("/admin/auth/login", request.url));
  }

  // Tester route protection
  if (
    !isAuthenticated &&
    testerRoutes.some((route) => pathname.startsWith(route)) &&
    !testerAuthRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/tester/login", request.url));
  }

  // Role-based access restrictions (only for non-super-admin roles)
  
  // 1. User role restrictions
  if (isUser) {
    // User can only access authenticated routes
    if (adminRoutes.some((route) => pathname.startsWith(route)) && !pathname.startsWith("/admin/auth/login")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (testerRoutes.some((route) => pathname.startsWith(route)) && !testerAuthRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 2. Admin role restrictions (admin, moderator, support)
  if (isAdmin) {
    // Admin can only access admin routes and authenticated routes
    if (testerRoutes.some((route) => pathname.startsWith(route)) && !testerAuthRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  // 3. Tester role restrictions
  if (isTester) {
    // Tester can only access tester routes and tester auth routes
    if (authenticatedRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/tester/dashboard", request.url));
    }
    if (adminRoutes.some((route) => pathname.startsWith(route)) && !pathname.startsWith("/admin/auth/login")) {
      return NextResponse.redirect(new URL("/tester/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
