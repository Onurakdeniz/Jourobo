import { privy } from "@/lib/privy";
import { NextRequest, NextResponse } from "next/server";

// Define the middleware function
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/api/register") {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === "/feed") {
    // Check if the user is authenticated
    const accessToken = request.cookies.get("privy-token");
    if (!accessToken) {
      // Redirect to the login page if not authenticated
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    // If authenticated, allow access to the "/feed" path
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  if (request.method === "POST") {
    const requestBody = await request.json();
  }

  const accessToken = request.cookies.get("privy-token");
   

  try {
    const verifiedClaims = await privy.verifyAuthToken(accessToken.value);
    const userId = verifiedClaims.userId;
    const privyUser = await privy.getUser(userId);
    const privyUserId = privyUser.id;
    const response = NextResponse.next();
    response.cookies.set("x-user-id", privyUserId);
    response.cookies.set({
      name: "x-user-id",
      value: privyUserId,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error(error);
    // Unauthorized: Invalid or expired access token
    // Redirect to the login page
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/register
     * - api/triggers
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     */
    "/((?!api/register|api/trigger|_next/static|_next/image|favicon.ico|login).*)",
  ],
};