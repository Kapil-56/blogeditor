import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // If the user is not authenticated and trying to access a protected route
  if (!request.cookies.has('next-auth.session-token') && 
      (path.startsWith('/dashboard') || path.startsWith('/api/blogs'))) {
    // Redirect to the sign-in page with a callbackUrl
    const url = new URL('/api/auth/signin', request.url);
    url.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/blogs/:path*'],
}; 