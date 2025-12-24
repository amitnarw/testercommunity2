import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const secret = process.env.BETTER_AUTH_SECRET!;
  let roleName: string | null = null;

  const cookieStore = await cookies();
  const better_auth_cookie = cookieStore.get("better-auth.role_cache");

  if (better_auth_cookie) {
    try {
      const { payload } = await jwtVerify(
        better_auth_cookie.value,
        new TextEncoder().encode(secret)
      );
      roleName = (payload as any)?.role?.name;
    } catch (err) {
      roleName = null;
    }
  }

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

  // If user is authenticated, redirect them away from login/register pages
  if (isAuthenticated) {
    if (roleName === 'admin' && isAdminAuthPage) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (roleName === 'tester' && isTesterAuthPage) {
      return NextResponse.redirect(new URL("/tester/dashboard", request.url));
    }
    if (roleName === 'user' && isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
