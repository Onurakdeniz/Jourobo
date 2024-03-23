import { privy } from "@/lib/privy";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const sdk = require("api")("@neynar/v2.0#ap4tds31ltnhip18");

export async function POST(req: NextRequest): Promise<NextResponse> {
  const accessToken = req.cookies.get("privy-token");
  if (!accessToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const verifiedClaims = await privy.verifyAuthToken(accessToken.value);
    const { userId } = verifiedClaims;
    const privyUser = await privy.getUser(userId);

    if (!privyUser.farcaster) {
      return new NextResponse(
        JSON.stringify({ error: "Farcaster data is missing" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const sdkResponse = await sdk.userBulk({
      fids: privyUser.farcaster.fid,
      api_key: process.env.NEYNAR_API_KEY,
    });

    const userData = sdkResponse.data;

    const user = await upsertUserWithRelations(userData, privyUser.id);

    return new NextResponse(JSON.stringify({ user }), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(`Operation failed with error: ${error}.`);
    return new NextResponse(JSON.stringify({ error: "Operation failed" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

type UserProfile = {
  object: string;
  fid: number;
  custody_address: string;
  username: string;
  display_name: string;
  pfp_url: string;
  profile: {
    bio: {
      text: string;
      mentioned_profiles: any[];
    };
  };
  follower_count: number;
  following_count: number;
  verifications: string[];
  verified_addresses: {
    eth_addresses: string[];
    sol_addresses: string[];
  };
  active_status: string;
};

type UserContainer = {
  users: UserProfile[];
};

async function upsertUserWithRelations(
  userData: UserContainer,
  privyUser: string
) {
  const user = userData.users[0];

  // Upsert User
  const upsertedUser = await prisma.user.upsert({
    where: {
      privyUserId: privyUser,
    },
    create: {
      privyUserId: privyUser,
      custodyAddress: user.custody_address,

      verifications: user.verifications,
    },
    update: {
      custodyAddress: user.custody_address,
      verifications: user.verifications,
    },
  });

  // Upsert Profile associated with the User
  const upsertedProfile = await prisma.profile.upsert({
    where: {
      fid: user.fid,
    },
    create: {
      fid: user.fid,
      bioText: user.profile.bio.text,
      mentioned_profiles: user.profile.bio.mentioned_profiles,
      userName: user.username,
      activeStatus: user.active_status,
      displayName: user.display_name,
      avatarUrl: user.pfp_url,
      farcasterFollowerCount: user.follower_count,
      farcasterFollowingCount: user.following_count,
      user: {
        connect: { id: upsertedUser.id },
      },
    },
    update: {
      bioText: user.profile.bio.text,
      mentioned_profiles: user.profile.bio.mentioned_profiles,
      userName: user.username,
      activeStatus: user.active_status,
      displayName: user.display_name,
      avatarUrl: user.pfp_url,
      farcasterFollowerCount: user.follower_count,
      farcasterFollowingCount: user.following_count,
    },
  });

  return { upsertedUser, upsertedProfile };
}
