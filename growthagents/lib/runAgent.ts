import type { AgentId, StreamEvent } from "./types";

interface RunAgentOptions {
  agentId: AgentId;
  input: Record<string, string>;
  onText: (text: string) => void;
  onDone: (usage: { inputTokens: number; outputTokens: number }) => void;
  onError: (error: string) => void;
  signal?: AbortSignal;
}

function isStreamEvent(value: unknown): value is StreamEvent {
  if (!value || typeof value !== "object") return false;
  const t = (value as { type?: unknown }).type;
  return t === "text" || t === "done" || t === "error";
}

export async function runAgent(opts: RunAgentOptions): Promise<void> {
  const { agentId, input, onText, onDone, onError, signal } = opts;

  let response: Response;
  try {
    response = await fetch(`/api/agents/${agentId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
      signal,
    });
  } catch (err) {
    if (signal?.aborted) {
      onError("Run cancelled.");
    } else {
      onError(err instanceof Error ? err.message : "Network error");
    }
    return;
  }

  if (!response.ok || !response.body) {
    let message = `Request failed (${response.status})`;
    try {
      const data = (await response.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      /* swallow — fall through to default message */
    }
    onError(message);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let newlineIdx = buffer.indexOf("\n");
      while (newlineIdx !== -1) {
        const line = buffer.slice(0, newlineIdx).trim();
        buffer = buffer.slice(newlineIdx + 1);
        newlineIdx = buffer.indexOf("\n");
        if (!line) continue;

        let parsed: unknown;
        try {
          parsed = JSON.parse(line);
        } catch {
          continue;
        }
        if (!isStreamEvent(parsed)) continue;

        if (parsed.type === "text") onText(parsed.text);
        else if (parsed.type === "done") onDone(parsed.usage);
        else onError(parsed.error);
      }
    }
  } catch (err) {
    if (signal?.aborted) {
      onError("Run cancelled.");
    } else {
      onError(err instanceof Error ? err.message : "Stream interrupted");
    }
  } finally {
    reader.releaseLock();
  }
}
