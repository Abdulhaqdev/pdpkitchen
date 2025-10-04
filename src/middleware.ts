import { NextResponse } from 'next/server';

// Middleware function to handle authentication redirection
export default function middleware(request:any) {
  // Check if the current path is the sign-in page
  const isSignInPage = request.nextUrl.pathname === '/auth/sign-in';

  // Get the user token from localStorage (simulated here; adjust based on your setup)
  const accessToken = request.cookies.get('access_token')?.value;

  // If no token and not on sign-in page, redirect to sign-in
  if (!accessToken && !isSignInPage) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  // If token exists and on sign-in page, redirect to dashboard
  if (accessToken && isSignInPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow the request to proceed if no redirection is needed
  return NextResponse.next();
}

// Configure matcher for middleware
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ],
};