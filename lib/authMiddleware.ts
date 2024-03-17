import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function authMiddleware(req: NextRequest) {
  const privyUserId = req.cookies.get("x-user-id")?.value;
  if (!privyUserId) {
    console.error("Unauthorized: User ID not found");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentUser = await prisma.user.findUnique({
    where: { privyUserId },
    select: { id: true },  });

  if (!currentUser) {
    console.error("User not found");
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return currentUser;
}