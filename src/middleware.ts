import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCookieCache } from "better-auth/cookies";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const cached = await getCookieCache(request);

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

  if (better_auth) {
    try {
      const { payload } = await jwtVerify(
        better_auth?.value,
        new TextEncoder().encode(secret)
      );
      role = (payload as any).role;
    } catch (err) {
      role = null;
    }
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
  ];
  const adminRoutes = ["/admin"];
  const professionalTesterAuthRoutes = ["/tester/login", "/tester/register"];
  const professionalRoutes = ["/tester/dashboard"];

  // If user is authenticated and tries to access login/register, redirect to dashboard
  if (
    cached?.session?.id &&
    role?.name &&
    authRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAdmin && pathname.startsWith("/admin/login")) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (
    isProfessional &&
    professionalTesterAuthRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/tester/dashboard", request.url));
  }

  // If user is not authenticated and tries to access a protected route, redirect to login
  if (
    !cached?.session?.id &&
    role?.name &&
    authenticatedRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (
    !isAdmin &&
    adminRoutes.some((route) => pathname.startsWith(route)) &&
    pathname !== "/admin/login"
  ) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (
    !isProfessional &&
    professionalRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/tester/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs", // Required for auth.api calls
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
