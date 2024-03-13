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

    const userData = sdkResponse.data.users[0];

    const user = await upsertUser(userData, privyUser);

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
async function upsertUser(userData: any , privyUser: any) {
 
        const user = await prisma.user.upsert({
            where: {
              privyUserId: privyUser.id,
            },
            update: {
              fid: String(userData.fid),
              custodyAddress: userData.custody_address,
              username: userData.username,
              displayName: userData.display_name,
              avatarUrl: userData.pfp_url,
              farcasterFollowerCount: userData.follower_count,
              farcasterFollowingCount: userData.following_count,
              verifications: userData.verifications,
              activeStatus: userData.active_status.toUpperCase(),
        profile: {
          upsert: {
            where: { id: userData.profileId }, // Use the correct unique identifier
            update: {
              text: userData.profile.bio.text,
              mentioned_profiles: userData.profile.bio.mentioned_profiles,
            },
            create: {
              text: userData.profile.bio.text,
              mentioned_profiles: userData.profile.bio.mentioned_profiles,
            },
          },
        },
      },
      create: {
        privyUserId: privyUser.id,
        fid: String(userData.fid),
        custodyAddress: userData.custody_address,
        username: userData.username,
        displayName: userData.display_name,
        avatarUrl: userData.pfp_url,
        farcasterFollowerCount: userData.follower_count,
        farcasterFollowingCount: userData.following_count,
        verifications: userData.verifications,
        verifiedAddresses: {
          create: {
            ethAddresses: userData.verified_addresses.eth_addresses,
            solAddresses: userData.verified_addresses.sol_addresses,
          },
        },
        activeStatus: userData.active_status.toUpperCase(),
        profile: {
          create: {
            text: userData.profile.bio.text,
            mentioned_profiles: userData.profile.bio.mentioned_profiles,
          },
        },
      },
    });
  
    return user;
  }