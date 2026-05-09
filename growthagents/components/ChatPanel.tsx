"use client";

import { useEffect, useRef, useState } from "react";
import type { AgentDefinition, AgentRun } from "@/lib/types";
import { useSession } from "@/lib/store";
import { Markdown } from "./Markdown";

interface ChatPanelProps {
  agent: AgentDefinition;
}

function formatElapsed(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(1)}s`;
  const m = Math.floor(s / 60);
  const rem = Math.round(s % 60);
  return `${m}m ${rem}s`;
}

function useElapsed(run: AgentRun): number {
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    if (run.status !== "running") return;
    const id = window.setInterval(() => setNow(Date.now()), 100);
    return () => window.clearInterval(id);
  }, [run.status]);
  const end = run.finishedAt ?? now;
  return end - run.startedAt;
}

function approxTokensFromOutput(output: string): number {
  if (!output) return 0;
  return Math.max(1, Math.round(output.length / 4));
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1400);
        } catch {
          /* clipboard unavailable; ignore */
        }
      }}
      className="rounded-md border border-ink-600 px-2 py-1 text-[11px] text-ink-200 transition hover:border-ink-500 hover:text-ink-100"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function RunCard({ run, agent }: { run: AgentRun; agent: AgentDefinition }) {
  const elapsed = useElapsed(run);
  const liveTokens =
    run.usage?.outputTokens ?? approxTokensFromOutput(run.output);
  const totalTokens =
    run.usage !== undefined
      ? run.usage.inputTokens + run.usage.outputTokens
      : liveTokens;

  const inputSummary = agent.fields
    .map((f) => {
      const val = run.input[f.name];
      if (!val) return null;
      return { label: f.label, value: val };
    })
    .filter((v): v is { label: string; value: string } => v !== null);

  return (
    <article className="animate-fade-in rounded-xl border border-ink-700/70 bg-ink-800/40 p-4">
      <header className="flex flex-wrap items-center gap-2 border-b border-ink-700/70 pb-3">
        <span
          className="grid h-7 w-7 place-items-center rounded-md text-base"
          style={{ backgroundColor: `${agent.accent}22` }}
        >
          {agent.emoji}
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-sm font-semibold text-ink-100">
            {agent.name}
          </span>
          <span className="text-[11px] text-ink-400">
            {new Date(run.startedAt).toLocaleTimeString()} · {formatElapsed(elapsed)}
            {" · "}
            {totalTokens} tok{run.usage ? "" : " (est.)"}
          </span>
        </div>
        <span
          className={[
            "rounded-full px-2 py-0.5 text-[11px] font-medium",
            run.status === "running"
              ? "bg-accent-soft text-accent"
              : run.status === "done"
                ? "bg-success/15 text-success"
                : "bg-danger/15 text-danger",
          ].join(" ")}
        >
          {run.status === "running"
            ? "streaming"
            : run.status === "done"
              ? "done"
              : "error"}
        </span>
        {run.status === "done" && run.output && (
          <CopyButton text={run.output} />
        )}
      </header>

      {inputSummary.length > 0 && (
        <details className="mt-3 text-xs text-ink-300">
          <summary className="cursor-pointer text-ink-400 hover:text-ink-200">
            Input
          </summary>
          <dl className="mt-2 space-y-1.5">
            {inputSummary.map((row) => (
              <div key={row.label} className="grid grid-cols-[110px_1fr] gap-3">
                <dt className="text-ink-400">{row.label}</dt>
                <dd className="whitespace-pre-wrap text-ink-200">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </details>
      )}

      <div className="mt-2">
        {run.status === "error" ? (
          <div className="rounded-md border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
            <p className="font-medium">Run failed</p>
            <p className="mt-1 text-danger/90">{run.error}</p>
          </div>
        ) : run.output ? (
          <>
            <Markdown text={run.output} />
            {run.status === "running" && (
              <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 animate-pulse-soft bg-accent" />
            )}
          </>
        ) : (
          <div className="flex items-center gap-2 py-3 text-xs text-ink-400">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-accent" />
            Spinning up the agent…
          </div>
        )}
      </div>
    </article>
  );
}

function EmptyState({ agent }: { agent: AgentDefinition }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-12 text-center">
      <span
        className="mb-4 grid h-14 w-14 place-items-center rounded-2xl text-3xl"
        style={{ backgroundColor: `${agent.accent}22` }}
      >
        {agent.emoji}
      </span>
      <h3 className="text-lg font-semibold text-ink-100">{agent.name}</h3>
      <p className="mt-1 max-w-md text-sm text-ink-300">{agent.description}</p>
      <p className="mt-6 text-[12px] text-ink-400">
        Fill the form, hit Run. Output streams in here.
      </p>
    </div>
  );
}

export function ChatPanel({ agent }: ChatPanelProps) {
  const runs = useSession((s) =>
    s.runs.filter((r) => r.agentId === agent.id),
  );
  const clearRuns = useSession((s) => s.clearRuns);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [runs]);

  return (
    <section className="flex h-full min-h-0 flex-col rounded-xl border border-ink-700/70 bg-ink-800/30">
      <header className="flex items-center justify-between border-b border-ink-700/70 px-4 py-3">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-ink-400">
            Output
          </p>
          <p className="text-sm font-medium text-ink-100">
            {agent.name} · {runs.length} run{runs.length === 1 ? "" : "s"} this
            session
          </p>
        </div>
        {runs.length > 0 && (
          <button
            type="button"
            onClick={() => clearRuns(agent.id)}
            className="rounded-md border border-ink-600 px-2.5 py-1 text-[11px] text-ink-200 transition hover:border-ink-500 hover:text-ink-100"
          >
            Clear
          </button>
        )}
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto p-4">
        {runs.length === 0 ? (
          <EmptyState agent={agent} />
        ) : (
          <div className="flex flex-col gap-4">
            {runs.map((run) => (
              <RunCard key={run.id} run={run} agent={agent} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
