import { privy } from "@/lib/privy";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Paths that should not redirect authenticated users to /feed
  const noAuthRedirectPaths = [
    '/login',
    '/api/register',
    '/api/trigger',
    '/_next/static',
    '/_next/image',
    '/favicon.ico',
  ];

  // Check if the current path is one of the noAuthRedirectPaths
  const shouldSkipAuthRedirect = noAuthRedirectPaths.some(path => pathname.startsWith(path));

  // Attempt to get the access token
  const accessToken = request.cookies.get("privy-token");

  // If the user is authenticated and on the root path, redirect to /feed
  if (accessToken && pathname === "/") {
    try {
      // Verify the access token
      const result = await privy.verifyAuthToken(accessToken.value);
      // If the token is valid, redirect to /feed
      return NextResponse.redirect(new URL("/feed", request.url));
    } catch (error) {
      // If the token is invalid, redirect to the login page
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If the user is not authenticated and not on a noAuthRedirectPath, redirect to the login page
  if (!accessToken && !shouldSkipAuthRedirect) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If the user is authenticated and on the login page, redirect to /feed
  if (accessToken && pathname === "/login") {
    try {
      // Verify the access token
      const result = await privy.verifyAuthToken(accessToken.value);
      // If the token is valid, redirect to /feed
      return NextResponse.redirect(new URL("/feed", request.url));
    } catch (error) {
      // If the token is invalid, do nothing and allow access to the login page
      console.error(error);
    }
  }

  // Specific logic for /api/register path
  if (pathname === "/api/register") {
    return NextResponse.next();
  }

  // Specific logic for /feed path
  if (pathname === "/feed" && !accessToken) {
    // Redirect to the login page if not authenticated
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Default behavior for other paths
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/register|api/trigger|_next/static|_next/image|favicon.ico).*)",
  ],
};