import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

// Improved error handling and logging
export async function authMiddleware(req: NextRequest) {
  try {
    const privyUserId = cookies().get("x-user-id")?.value;
 
    if (!privyUserId) {
      console.error("Unauthorized: User ID not found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { privyUserId },
      select: { id: true },
    });

    if (!currentUser) {
      console.error("User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return currentUser;
  } catch (error) {
    console.error("Error in authMiddleware", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
 