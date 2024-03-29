import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { privy } from "@/lib/privy";

export const dynamic = "force-dynamic";
// Improved error handling and logging
export async function authMiddleware(req: NextRequest) {
  try {
    const accessToken = cookies().get("privy-token");

    if (!accessToken) {
      // Handle the case where accessToken is undefined
      console.log("Access token is undefined");
      return;
    }

    // Continue with your code using accessToken

    const result = await privy.verifyAuthToken(accessToken.value);
    const { userId: privyUserId } = result;

    if (!privyUserId) {
      console.error("Unauthorized: User ID not found");
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const currentUser = await prisma.user.findUnique({
      where: { privyUserId },
      select: { id: true },
    });

    if (!currentUser) {
      console.error("User not found");
      return new NextResponse(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return currentUser;
  } catch (error) {
    console.error("Error in authMiddleware", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
