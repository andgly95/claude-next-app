import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Message, ChatResponse } from "../../../types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  const { messages }: { messages: Message[] } = await request.json();

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1024,
      messages: messages,
    });

    return NextResponse.json(response as ChatResponse);
  } catch (error) {
    return NextResponse.json(
      { error: "Error processing your request" },
      { status: 500 }
    );
  }
}
