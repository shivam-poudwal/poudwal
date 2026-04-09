import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractToken } from '@/lib/jwt';

/**
 * JWT auth middleware – protects /api/* routes (except /api/auth/*).
 */
export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const token = extractToken(request);

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const decoded = verifyToken(token) as { id: string; role: string };
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id',   decoded.id);
    requestHeaders.set('x-user-role', decoded.role);

    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ['/api/:path*'],
};
