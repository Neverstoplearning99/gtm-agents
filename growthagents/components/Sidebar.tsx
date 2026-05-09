"use client";

import { agentList } from "@/lib/agents";
import { useSession } from "@/lib/store";
import type { AgentId } from "@/lib/types";

interface SidebarProps {
  onSelect?: () => void;
}

export function Sidebar({ onSelect }: SidebarProps) {
  const selectedAgent = useSession((s) => s.selectedAgent);
  const selectAgent = useSession((s) => s.selectAgent);
  const runs = useSession((s) => s.runs);

  const handleSelect = (id: AgentId) => {
    selectAgent(id);
    onSelect?.();
  };

  return (
    <nav
      aria-label="Agents"
      className="flex h-full w-full flex-col gap-1 bg-ink-900/80 p-3 backdrop-blur"
    >
      <div className="flex items-center gap-2 px-2 pb-3 pt-1">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-sm font-bold text-white">
          G
        </div>
        <div>
          <p className="text-sm font-semibold text-ink-100">GrowthAgents</p>
          <p className="text-[11px] uppercase tracking-wider text-ink-400">
            agentic workers for founders
          </p>
        </div>
      </div>

      <div className="px-2 pb-1 pt-3 text-[11px] font-medium uppercase tracking-wider text-ink-400">
        Agents
      </div>

      {agentList.map((agent) => {
        const isActive = agent.id === selectedAgent;
        const runCount = runs.filter((r) => r.agentId === agent.id).length;
        return (
          <button
            key={agent.id}
            type="button"
            onClick={() => handleSelect(agent.id)}
            className={[
              "group flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition",
              isActive
                ? "bg-accent-soft text-ink-100 ring-1 ring-accent/60"
                : "text-ink-200 hover:bg-ink-800/80",
            ].join(" ")}
          >
            <span className="mt-0.5 text-lg leading-none">{agent.emoji}</span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium">{agent.name}</span>
                {runCount > 0 && (
                  <span className="rounded-full bg-ink-700 px-1.5 py-0.5 text-[10px] text-ink-200">
                    {runCount}
                  </span>
                )}
              </span>
              <span className="mt-0.5 block truncate text-[11px] text-ink-400">
                {agent.tagline}
              </span>
            </span>
          </button>
        );
      })}

      <div className="mt-auto px-2 pt-4 text-[11px] leading-relaxed text-ink-400">
        <p>
          Session-only memory. Runs disappear on refresh — paste outputs you
          want to keep.
        </p>
        <p className="mt-2">
          Powered by Claude Sonnet 4.6 via the Anthropic SDK.
        </p>
      </div>
    </nav>
  );
}
