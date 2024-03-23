import { privy } from "@/lib/privy";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Paths that should not redirect authenticated users to /feed
  const noAuthRedirectPaths = [
    '/api/register',
    '/api/trigger',
    '/_next/static',
    '/_next/image',
    '/favicon.ico',
  ];

  // Check if the current path is one of the noAuthRedirectPaths
  const shouldSkipAuthRedirect = noAuthRedirectPaths.some(path => pathname.startsWith(path));

  const allCookies = request.cookies.getAll();
console.log("All Cookies", allCookies);

  // Attempt to get the access token
  const accessToken = request.cookies.get("privy-token");
  console.log("Access Token", accessToken);

  // If the user is on the login page or the home page and has a valid access token, redirect them to /feed
  if ((pathname === "/login" || pathname === "/") && accessToken) {
    try {
      // Verify the access token
      const result = await privy.verifyAuthToken(accessToken.value);
      console.log(result);
      
      // If the token is valid, redirect to /feed
      return NextResponse.redirect(new URL("/feed", request.url));
    } catch (error) {
      // If the token is invalid, do nothing and allow access to the login or home page
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