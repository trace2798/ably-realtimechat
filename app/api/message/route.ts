import { NextResponse } from "next/server";

import * as Ably from "ably/promises";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body);
    const message: { text: string } = body;
    const client = new Ably.Rest(process.env.ABLY_API_KEY!);
    const channel = client.channels.get("status-updates");

    // By publishing via the serverless function you can perform
    // checks in a trusted environment on the data being published
    const disallowedWords = ["foo", "bar", "fizz", "buzz"];

    const containsDisallowedWord = disallowedWords.some((word) => {
      return message.text.match(new RegExp(`\\b${word}\\b`));
    });

    if (containsDisallowedWord) {
      return new NextResponse("Bad word", { status: 403 });
    }

    const response = await channel.publish("update-from-server", message);
    console.log(response);
    return NextResponse.json(response);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
