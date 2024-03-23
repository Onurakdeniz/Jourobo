import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

// Improved error handling and logging
export async function authMiddleware(req: NextRequest) {
  try {
    
    const allCookies = cookies().getAll();
console.log("All Cookies", allCookies);
    const privyUserId = cookies().get("x-user-id")?.value;
    console.log("User ID", privyUserId);
    if (!privyUserId) {
      console.error("Unauthorized: User ID not found");
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: { privyUserId },
      select: { id: true },
    });

    if (!currentUser) {
      console.error("User not found");
      return new NextResponse(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
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