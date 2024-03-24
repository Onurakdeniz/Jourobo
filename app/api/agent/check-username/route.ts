import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
export async function POST(req: NextRequest): Promise<NextResponse> {
  const { username } = await req.json();

  try {
    const agent = await prisma.agent.findFirst({
      where: {
        userName: {
          equals: username,
          mode: "insensitive", // Correct assuming your Prisma version supports it
        },
      },
    });
 

    if (agent) {
      return new NextResponse(JSON.stringify({ available: false }), {
        status: 200, // OK - Username is not available
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return new NextResponse(JSON.stringify({ available: true }), {
        status: 200, // OK - Username is available
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    console.error("Error checking agent username availability:", error);
    let errorMessage = 'An error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return new NextResponse(
      JSON.stringify({
        message: "Error checking agent username availability",
        error: errorMessage,
      }),
      {
        status: 500, // Internal Server Error
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}