
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true';
  const isAdmin = request.cookies.get('isAdminAuthenticated')?.value === 'true';
  const isProfessional = request.cookies.get('isProfessionalAuthenticated')?.value === 'true';

  const { pathname } = request.nextUrl;

  const authRoutes = ['/login', '/signup'];
  const authenticatedRoutes = ['/dashboard', '/community-dashboard', '/notifications', '/profile'];
  const adminRoutes = ['/admin'];
  const professionalTesterAuthRoutes = ['/tester/login', '/tester/register'];
  const professionalRoutes = ['/professional/tester/dashboard'];

  // If user is authenticated and tries to access login/signup, redirect to dashboard
  if (isAuthenticated && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  if (isAdmin && pathname.startsWith('/admin/login')) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  if (isProfessional && professionalTesterAuthRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/professional/tester/dashboard', request.url));
  }

  // If user is not authenticated and tries to access a protected route, redirect to login
  if (!isAuthenticated && authenticatedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (!isAdmin && adminRoutes.some(route => pathname.startsWith(route)) && pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  
  if (!isProfessional && professionalRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/tester/login', request.url));
  }


  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
