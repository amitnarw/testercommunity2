import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ROUTES } from "@/lib/routes";

interface RoleInfo {
  name: string;
  permissions: Array<{
    moduleId: number;
    canReadList: boolean;
    canReadSingle: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    module: { name: string };
  }>;
}

interface SessionValidationResult {
  isAuthenticated: boolean;
  role: RoleInfo | null;
  banned: boolean;
  ban_reason: string | null;
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
    return { isAuthenticated: false, role: null, banned: false, ban_reason: null };
  }

  let role: RoleInfo | null = null;
  let banned = false;
  let ban_reason: string | null = null;
  if (roleCache && secret) {
    try {
      const { payload } = await jwtVerify(
        roleCache,
        new TextEncoder().encode(secret),
      );
      const roleData = (payload as any).role;
      role = typeof roleData === "string"
        ? { name: roleData, permissions: [] }
        : roleData || null;
      banned = (payload as any).banned === true;
      ban_reason = (payload as any).ban_reason || null;
    } catch (err) {
      role = null;
    }
  }

  return {
    isAuthenticated: true,
    role,
    banned,
    ban_reason,
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
    ROUTES.AUTHENTICATED.PRO_TESTING,
    ROUTES.AUTHENTICATED.FREE_TESTING,
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

  const { isAuthenticated, role, banned, ban_reason } = await validateSession(request);

  // If the user is banned, redirect to /banned (unless already there)
  if (banned && pathname !== "/banned") {
    const bannedUrl = request.nextUrl.clone();
    bannedUrl.pathname = "/banned";
    bannedUrl.searchParams.set(
      "error_description",
      ban_reason || "Your account has been suspended. Please contact support.",
    );
    return NextResponse.redirect(bannedUrl);
  }

  const roleName = typeof role === "string" ? role : role?.name;
  const lowerRole = roleName?.toLowerCase() || "";
  const isSuperAdmin = lowerRole === "super_admin";
  const isAdmin = ["admin", "moderator", "support"].includes(lowerRole);
  const isTester = lowerRole === "tester";
  const isUser = lowerRole === "user";

  if (isSuperAdmin) {
    return NextResponse.next();
  }

  // If role is null despite being authenticated, role_cache JWT is corrupt/expired
  // Allow auth pages to render to avoid redirect loops.
  // For non-auth pages, redirect to the role-appropriate login.
  // Don't clear cookies from middleware — can't match the cookie domain attribute.
  // The login page's useSession() will fetch fresh role_cache from the backend.
  if (isAuthenticated && !role) {
    if (
      authRoutes.some((route) => pathname.startsWith(route)) ||
      adminAuthRoutes.some((route) => pathname.startsWith(route)) ||
      testerAuthRoutes.some((route) => pathname.startsWith(route))
    ) {
      return NextResponse.next();
    }
    let loginRoute: string = ROUTES.AUTH.LOGIN;
    if (adminRoutes.some((route) => pathname.startsWith(route))) {
      loginRoute = ROUTES.ADMIN.AUTH.LOGIN;
    } else if (testerRoutes.some((route) => pathname.startsWith(route))) {
      loginRoute = ROUTES.TESTER.AUTH.LOGIN;
    }
    return NextResponse.redirect(new URL(loginRoute, request.url));
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
    role &&
    adminAuthRoutes.some((route) => pathname.startsWith(route))
  ) {
    if (lowerRole === "moderator") {
      return NextResponse.redirect(new URL(ROUTES.ADMIN.BLOG_MANAGEMENT, request.url));
    }
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

  // Role-based access control: prevent admins from accessing tester areas (unless acting-as)
  if (isAdmin) {
    const actingAsRole = request.cookies.get("acting_as_role")?.value;
    const isActingAsTester = actingAsRole === "tester";
    const isActingAsUser = actingAsRole === "user";

    // If acting as tester, allow tester routes
    if (isActingAsTester && testerRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.next();
    }

    // If acting as user, allow user routes
    if (isActingAsUser && authenticatedRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.next();
    }

    // Normal admin block for tester routes
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
