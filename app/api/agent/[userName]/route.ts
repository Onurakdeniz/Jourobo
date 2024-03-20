import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { CreateAgentSchema } from "@/schemas";
import * as z from "zod";
import { authMiddleware } from "@/lib/authMiddleware";
import { getAgentByAgentUserName } from "@/data/agent";

export async function GET(
  req: NextRequest,
  { params }: { params: { userName: string } }
) {
  try {
    const currentUser = await authMiddleware(req);
    if (currentUser instanceof NextResponse) {
      return currentUser;
    }

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

 
    const { userName } = params;
 
    const agent = await getAgentByAgentUserName(userName);
    return NextResponse.json({ agent }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`GET request failed with error: ${error.message}`);
    } else {
      console.error("GET request failed with an unknown error");
    }
  }
}
