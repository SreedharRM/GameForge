import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs"; // important for streaming

export async function POST(req: Request) {
  const { userMessage } = await req.json();

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const clientStream = await anthropic.messages.stream({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          temperature: 0.7,
          system: "You are a helpful game ideation assistant.",
          messages: [
            { role: "user", content: [{ type: "text", text: userMessage }] },
          ],
        });

        for await (const event of clientStream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        console.error(err);
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
