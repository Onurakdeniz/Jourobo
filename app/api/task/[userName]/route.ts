import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authMiddleware } from "@/lib/authMiddleware";

export async function GET(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const currentUser = await authMiddleware(req);
    if (currentUser instanceof NextResponse) {
      return currentUser;
    }

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { taskId } = params;
    const runs = await getRunsByTaskId(taskId);
    return NextResponse.json({ runs }, { status: 200 });
  } catch (error) {
    console.error(`GET request failed with error: ${error}.`);
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}

async function getRunsByTaskId(taskId: string) {
  const runs = await prisma.run.findMany({
    where: {
      taskId: taskId,
    },
    include: {
      Task: true, // Include related Task record
      story: true, // Include related Story record
      sources: true, // Include related Source records
      results: true, // Include related RunResult records
    },
  });
  return runs;
}
