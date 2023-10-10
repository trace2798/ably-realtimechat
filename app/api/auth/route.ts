import * as Ably from "ably/promises";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const clientId = process.env.DEFAULT_CLIENT_ID || "NO_CLIENT_ID";
    const client = new Ably.Rest({
      key: process.env.ABLY_API_KEY!,
      queryTime: true,
    });
    const tokenRequestData = await client.auth.createTokenRequest({
      clientId: clientId,
    });
    console.log(tokenRequestData);
    return NextResponse.json(tokenRequestData);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
