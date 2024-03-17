import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { username } = await req.json();

  try {
    const user = await prisma.agency.findFirst({
      where: {
        userName: {
          equals: username,
          mode: 'insensitive', // Assuming your Prisma version supports this
        },
      },
    });

    console.log("User exists:", user);

    if (user) {
      return new NextResponse(JSON.stringify({ available: false }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return new NextResponse(JSON.stringify({ available: true }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error: unknown) {
    console.error("Error checking username availability:", error);
    let errorMessage = 'An error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return new NextResponse(
      JSON.stringify({
        message: "Error checking username availability",
        error: errorMessage,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
