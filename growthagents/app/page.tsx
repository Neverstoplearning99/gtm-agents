"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { AgentForm } from "@/components/AgentForm";
import { ChatPanel } from "@/components/ChatPanel";
import { agents } from "@/lib/agents";
import { useSession } from "@/lib/store";

export default function Page() {
  const selectedAgentId = useSession((s) => s.selectedAgent);
  const agent = agents[selectedAgentId];
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-ink-950">
      <aside className="hidden w-64 shrink-0 border-r border-ink-800 lg:block">
        <Sidebar />
      </aside>

      {navOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setNavOpen(false)}
          role="presentation"
        >
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="absolute left-0 top-0 h-full w-72 border-r border-ink-800 bg-ink-900"
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            <Sidebar onSelect={() => setNavOpen(false)} />
          </div>
        </div>
      )}

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-ink-800 px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              className="rounded-md border border-ink-700 px-2 py-1 text-xs text-ink-200 lg:hidden"
              aria-label="Open agents"
            >
              Agents
            </button>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-ink-400">
                {agent.tagline}
              </p>
              <h1 className="text-base font-semibold text-ink-100">
                <span className="mr-1.5">{agent.emoji}</span>
                {agent.name}
              </h1>
            </div>
          </div>
          <a
            href="https://www.anthropic.com/claude"
            target="_blank"
            rel="noreferrer noopener"
            className="hidden text-[11px] text-ink-400 hover:text-ink-200 sm:block"
          >
            built on claude-sonnet-4-6
          </a>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden p-4 lg:grid-cols-[380px_1fr] lg:gap-6 lg:p-6">
          <div className="min-h-0 overflow-y-auto lg:pr-1">
            <AgentForm agent={agent} />
          </div>
          <div className="min-h-0">
            <ChatPanel agent={agent} />
          </div>
        </div>
      </main>
    </div>
  );
}
