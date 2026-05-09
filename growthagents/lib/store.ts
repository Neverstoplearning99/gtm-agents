import { create } from "zustand";
import type { AgentId, AgentRun, RunUsage } from "./types";

interface SessionState {
  selectedAgent: AgentId;
  runs: AgentRun[];
  activeRunId: string | null;
  selectAgent: (id: AgentId) => void;
  startRun: (agentId: AgentId, input: Record<string, string>) => string;
  appendOutput: (runId: string, text: string) => void;
  finishRun: (runId: string, usage: RunUsage) => void;
  failRun: (runId: string, error: string) => void;
  clearRuns: (agentId?: AgentId) => void;
}

function createId(): string {
  return `run_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export const useSession = create<SessionState>((set) => ({
  selectedAgent: "lead-researcher",
  runs: [],
  activeRunId: null,
  selectAgent: (id) => set({ selectedAgent: id }),
  startRun: (agentId, input) => {
    const id = createId();
    const run: AgentRun = {
      id,
      agentId,
      input,
      output: "",
      status: "running",
      startedAt: Date.now(),
    };
    set((state) => ({
      runs: [...state.runs, run],
      activeRunId: id,
    }));
    return id;
  },
  appendOutput: (runId, text) =>
    set((state) => ({
      runs: state.runs.map((r) =>
        r.id === runId ? { ...r, output: r.output + text } : r,
      ),
    })),
  finishRun: (runId, usage) =>
    set((state) => ({
      runs: state.runs.map((r) =>
        r.id === runId
          ? { ...r, status: "done", finishedAt: Date.now(), usage }
          : r,
      ),
      activeRunId: state.activeRunId === runId ? null : state.activeRunId,
    })),
  failRun: (runId, error) =>
    set((state) => ({
      runs: state.runs.map((r) =>
        r.id === runId
          ? { ...r, status: "error", finishedAt: Date.now(), error }
          : r,
      ),
      activeRunId: state.activeRunId === runId ? null : state.activeRunId,
    })),
  clearRuns: (agentId) =>
    set((state) => ({
      runs: agentId ? state.runs.filter((r) => r.agentId !== agentId) : [],
      activeRunId: null,
    })),
}));
