import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { getAgent } from "@/lib/agents";
import type { StreamEvent } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 4096;

interface RequestBody {
  input?: Record<string, string>;
}

function jsonError(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function encodeEvent(encoder: TextEncoder, event: StreamEvent): Uint8Array {
  return encoder.encode(`${JSON.stringify(event)}\n`);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { agent: string } },
): Promise<Response> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return jsonError(
      500,
      "ANTHROPIC_API_KEY is not set. Copy .env.local.example to .env.local and paste your key.",
    );
  }

  const agent = getAgent(params.agent);
  if (!agent) {
    return jsonError(404, `Unknown agent: ${params.agent}`);
  }

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return jsonError(400, "Invalid JSON body");
  }

  const input: Record<string, string> = {};
  for (const field of agent.fields) {
    const raw = body.input?.[field.name];
    const value = typeof raw === "string" ? raw.trim() : "";
    if (field.required && !value) {
      return jsonError(400, `Missing required field: ${field.label}`);
    }
    input[field.name] = value;
  }

  const userMessage = agent.buildUserMessage(input);
  const client = new Anthropic({ apiKey });
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const messageStream = client.messages.stream({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: agent.systemPrompt,
          messages: [{ role: "user", content: userMessage }],
        });

        messageStream.on("text", (text: string) => {
          controller.enqueue(encodeEvent(encoder, { type: "text", text }));
        });

        const finalMessage = await messageStream.finalMessage();
        controller.enqueue(
          encodeEvent(encoder, {
            type: "done",
            usage: {
              inputTokens: finalMessage.usage.input_tokens,
              outputTokens: finalMessage.usage.output_tokens,
            },
          }),
        );
        controller.close();
      } catch (err: unknown) {
        const message =
          err instanceof Anthropic.APIError
            ? `${err.status ?? ""} ${err.message}`.trim()
            : err instanceof Error
              ? err.message
              : "Unknown error calling Anthropic API";
        controller.enqueue(encodeEvent(encoder, { type: "error", error: message }));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
