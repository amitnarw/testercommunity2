import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ROUTES } from "@/lib/routes";

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

  const roleCache = request.cookies
    .getAll()
    .find(
      (c) =>
        c.name === "better-auth.role_cache" || c.name.endsWith(".role_cache"),
    )?.value;

  const sessionToken = request.cookies
    .getAll()
    .find(
      (c) =>
        c.name === "better-auth.session_token" ||
        c.name.endsWith(".session_token"),
    )?.value;

  if (!sessionToken) {
    return { isAuthenticated: false, role: null };
  }

  let role: RoleInfo | null = null;
  if (roleCache && secret) {
    try {
      const { payload } = await jwtVerify(
        roleCache,
        new TextEncoder().encode(secret),
      );
      role = (payload as any).role || null;
    } catch (err) {
      role = null;
    }
  }

  return {
    isAuthenticated: true,
    role,
  };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === ROUTES.ADMIN.ROOT) {
    return NextResponse.redirect(new URL(ROUTES.ADMIN.DASHBOARD, request.url));
  }

  if (pathname === ROUTES.TESTER.ROOT) {
    return NextResponse.redirect(new URL(ROUTES.TESTER.DASHBOARD, request.url));
  }

  const authRoutes = [ROUTES.AUTH.LOGIN, ROUTES.AUTH.REGISTER];
  const authenticatedRoutes = [
    ROUTES.AUTHENTICATED.DASHBOARD,
    ROUTES.AUTHENTICATED.COMMUNITY_DASHBOARD,
    ROUTES.AUTHENTICATED.NOTIFICATIONS,
    ROUTES.AUTHENTICATED.PROFILE,
    ROUTES.AUTHENTICATED.WALLET,
    ROUTES.AUTHENTICATED.BILLING,
  ];
  const adminRoutes = [ROUTES.ADMIN.ROOT];
  const adminAuthRoutes = [ROUTES.ADMIN.AUTH.LOGIN];
  const testerAuthRoutes = [
    ROUTES.TESTER.AUTH.LOGIN,
    ROUTES.TESTER.AUTH.REGISTER,
  ];
  const testerRoutes = [ROUTES.TESTER.ROOT];

  const needsAuthCheck =
    authRoutes.some((route) => pathname.startsWith(route)) ||
    authenticatedRoutes.some((route) => pathname.startsWith(route)) ||
    adminRoutes.some((route) => pathname.startsWith(route)) ||
    testerAuthRoutes.some((route) => pathname.startsWith(route)) ||
    testerRoutes.some((route) => pathname.startsWith(route));

  if (!needsAuthCheck) {
    return NextResponse.next();
  }

  const { isAuthenticated, role } = await validateSession(request);

  const roleName = typeof role === "string" ? role : role?.name;
  const lowerRole = roleName?.toLowerCase() || "";
  const isSuperAdmin = lowerRole === "super_admin";
  const isAdmin = ["admin", "moderator", "support"].includes(lowerRole);
  const isTester = lowerRole === "tester";
  const isUser = lowerRole === "user";

  if (isSuperAdmin) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from public auth pages
  if (
    isAuthenticated &&
    authRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(
      new URL(ROUTES.AUTHENTICATED.DASHBOARD, request.url),
    );
  }

  // Redirect authenticated admins away from admin login page
  if (
    isAuthenticated &&
    adminAuthRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL(ROUTES.ADMIN.DASHBOARD, request.url));
  }

  // Redirect authenticated testers away from tester auth pages
  if (
    isTester &&
    isAuthenticated &&
    testerAuthRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL(ROUTES.TESTER.DASHBOARD, request.url));
  }

  // Redirect unauthenticated users to public login
  if (
    !isAuthenticated &&
    authenticatedRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL(ROUTES.AUTH.LOGIN, request.url));
  }

  // Redirect unauthenticated users to admin login
  if (
    !isAuthenticated &&
    adminRoutes.some((route) => pathname.startsWith(route)) &&
    !adminAuthRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL(ROUTES.ADMIN.AUTH.LOGIN, request.url));
  }

  // Redirect unauthenticated users to tester login
  if (
    !isAuthenticated &&
    testerRoutes.some((route) => pathname.startsWith(route)) &&
    !testerAuthRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(
      new URL(ROUTES.TESTER.AUTH.LOGIN, request.url),
    );
  }

  // Role-based access control: prevent users from accessing admin/tester areas
  if (isUser) {
    if (
      adminRoutes.some((route) => pathname.startsWith(route)) &&
      !adminAuthRoutes.some((route) => pathname.startsWith(route))
    ) {
      return NextResponse.redirect(
        new URL(ROUTES.AUTHENTICATED.DASHBOARD, request.url),
      );
    }
    if (
      testerRoutes.some((route) => pathname.startsWith(route)) &&
      !testerAuthRoutes.some((route) => pathname.startsWith(route))
    ) {
      return NextResponse.redirect(
        new URL(ROUTES.AUTHENTICATED.DASHBOARD, request.url),
      );
    }
  }

  // Role-based access control: prevent admins from accessing tester areas
  if (isAdmin) {
    if (
      testerRoutes.some((route) => pathname.startsWith(route)) &&
      !testerAuthRoutes.some((route) => pathname.startsWith(route))
    ) {
      return NextResponse.redirect(
        new URL(ROUTES.ADMIN.DASHBOARD, request.url),
      );
    }
  }

  // Role-based access control: prevent testers from accessing user/admin areas
  if (isTester) {
    if (authenticatedRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(
        new URL(ROUTES.TESTER.DASHBOARD, request.url),
      );
    }
    if (
      adminRoutes.some((route) => pathname.startsWith(route)) &&
      !adminAuthRoutes.some((route) => pathname.startsWith(route))
    ) {
      return NextResponse.redirect(
        new URL(ROUTES.TESTER.DASHBOARD, request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
