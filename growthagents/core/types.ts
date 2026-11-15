export const AGENT_IDS = [
  "lead-researcher",
  "outbound-writer",
  "content-strategist",
  "competitor-watcher",
  "growth-experiment-designer",
] as const;

export type AgentId = (typeof AGENT_IDS)[number];

export type AgentInput = Record<string, string>;

export type AgentFieldType = "text" | "textarea" | "select";

export interface AgentField {
  key: string;
  label: string;
  type: AgentFieldType;
  placeholder: string;
  required: boolean;
  maxLength: number;
  options?: readonly string[];
  hint?: string;
}

export interface AgentExample {
  label: string;
  input: AgentInput;
}

export interface AgentManifest {
  id: AgentId;
  name: string;
  tagline: string;
  description: string;
  deliverable: string;
  usesWebSearch: boolean;
  fields: readonly AgentField[];
  examples: readonly AgentExample[];
}

export interface AgentPrompt {
  system: string;
  maxTokens: number;
  buildUserMessage: (input: AgentInput) => string;
}

export interface RunUsage {
  inputTokens: number;
  outputTokens: number;
}

export type RunErrorCode =
  | "missing_api_key"
  | "invalid_request"
  | "unknown_agent"
  | "auth_failed"
  | "rate_limited"
  | "overloaded"
  | "upstream_error"
  | "network_error"
  | "aborted";

export type RunEvent =
  | { type: "status"; message: string }
  | { type: "notice"; message: string }
  | { type: "text"; text: string }
  | { type: "done"; usage: RunUsage; model: string; stopReason: string | null }
  | { type: "error"; code: RunErrorCode; message: string };

export interface ApiErrorBody {
  error: { code: RunErrorCode; message: string };
}
