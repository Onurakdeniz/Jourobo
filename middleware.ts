import { privy } from "@/lib/privy";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Define the middleware function
export async function middleware(request: NextRequest) {

  if (request.nextUrl.pathname === '/api/register') {
    return NextResponse.next();
  }


  if (request.method === 'POST') {
    const requestBody = await request.json();
 

  }
  const accessToken = request.cookies.get("privy-token");
  if (!accessToken) {
    // Unauthorized: Access token not found
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }



  try {
    const verifiedClaims = await privy.verifyAuthToken(accessToken.value);
    const userId = verifiedClaims.userId;
    const privyUser = await privy.getUser(userId);
    const privyUserId = privyUser.id;

 

    const response = NextResponse.next();

    response.cookies.set('x-user-id', privyUserId);
    response.cookies.set({
      name: 'x-user-id',
      value: privyUserId,
      path: '/',
    });


    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export const config = {
  matcher: ['/api/:path*'],
};