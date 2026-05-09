export type AgentId =
  | "lead-researcher"
  | "outbound-writer"
  | "content-strategist"
  | "competitor-watcher"
  | "experiment-designer";

export type FieldType = "text" | "textarea" | "select";

export interface AgentField {
  name: string;
  label: string;
  placeholder: string;
  type: FieldType;
  required: boolean;
  options?: ReadonlyArray<{ value: string; label: string }>;
  helper?: string;
  rows?: number;
}

export interface AgentDefinition {
  id: AgentId;
  name: string;
  tagline: string;
  description: string;
  emoji: string;
  accent: string;
  fields: ReadonlyArray<AgentField>;
  systemPrompt: string;
  buildUserMessage: (input: Record<string, string>) => string;
  example: Record<string, string>;
}

export interface RunUsage {
  inputTokens: number;
  outputTokens: number;
}

export type RunStatus = "running" | "done" | "error";

export interface AgentRun {
  id: string;
  agentId: AgentId;
  startedAt: number;
  finishedAt?: number;
  input: Record<string, string>;
  output: string;
  status: RunStatus;
  error?: string;
  usage?: RunUsage;
}

export type StreamEvent =
  | { type: "text"; text: string }
  | { type: "done"; usage: RunUsage }
  | { type: "error"; error: string };
