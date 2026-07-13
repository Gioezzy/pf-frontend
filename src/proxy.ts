// src/proxy.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeAccessToken, isTokenExpired } from './lib/jwt';

const dashboardByRole: Record<string, string> = {
  ADMIN: '/admin/dashboard',
  COMMITTEE: '/committee/dashboard',
  TREASURER: '/treasurer/payments',
  PARTICIPANT: '/dashboard',
};

export function proxy(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const path = request.nextUrl.pathname;

  const isAuthRoute =
    path.startsWith('/login') ||
    path.startsWith('/register') ||
    path.startsWith('/verify') ||
    path.startsWith('/forgot-password') ||
    path.startsWith('/reset-password');

  const isPublicRoute =
    path === '/' ||
    path.startsWith('/api') ||
    path.startsWith('/_next') ||
    path.startsWith('/public');

  if (!token) {
    if (!isAuthRoute && !isPublicRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
  }

  const decodedToken = decodeAccessToken(token);

  if (!decodedToken || isTokenExpired(token)) {
    // Jika rute publik, hapus token dan redirect ke halaman yang sama (refresh) agar tidak dipaksa ke login
    const targetUrl = isPublicRoute ? request.url : new URL('/login', request.url);
    const response = NextResponse.redirect(targetUrl);
    response.cookies.delete('accessToken');
    return response;
  }

  const role = decodedToken.role;
  const targetDashboard = dashboardByRole[role] ?? '/dashboard';

  if (isAuthRoute) {
    return NextResponse.redirect(new URL(targetDashboard, request.url));
  }

  if (path.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL(targetDashboard, request.url));
  }

  if (path.startsWith('/committee') && role !== 'COMMITTEE') {
    return NextResponse.redirect(new URL(targetDashboard, request.url));
  }

  if (path.startsWith('/treasurer') && role !== 'TREASURER') {
    return NextResponse.redirect(new URL(targetDashboard, request.url));
  }

  const isParticipantRoute =
    path.startsWith('/dashboard') ||
    path.startsWith('/teams') ||
    path.startsWith('/submissions') ||
    path.startsWith('/registrations');

  if (isParticipantRoute && role !== 'PARTICIPANT') {
    return NextResponse.redirect(new URL(targetDashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

export { proxy as middleware };