"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { AgentDefinition } from "@/lib/types";
import { useSession } from "@/lib/store";
import { runAgent } from "@/lib/runAgent";

interface AgentFormProps {
  agent: AgentDefinition;
}

export function AgentForm({ agent }: AgentFormProps) {
  const startRun = useSession((s) => s.startRun);
  const appendOutput = useSession((s) => s.appendOutput);
  const finishRun = useSession((s) => s.finishRun);
  const failRun = useSession((s) => s.failRun);
  const activeRunId = useSession((s) => s.activeRunId);
  const isBusy = activeRunId !== null;

  const initialValues = useMemo(() => {
    const values: Record<string, string> = {};
    for (const field of agent.fields) {
      if (field.type === "select" && field.options && field.options.length > 0) {
        values[field.name] = field.options[0]?.value ?? "";
      } else {
        values[field.name] = "";
      }
    }
    return values;
  }, [agent]);

  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const setField = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isBusy) return;

    const sanitized: Record<string, string> = {};
    for (const field of agent.fields) {
      const v = (values[field.name] ?? "").trim();
      if (field.required && !v) return;
      sanitized[field.name] = v;
    }

    const runId = startRun(agent.id, sanitized);
    const controller = new AbortController();
    abortRef.current = controller;

    await runAgent({
      agentId: agent.id,
      input: sanitized,
      signal: controller.signal,
      onText: (text) => appendOutput(runId, text),
      onDone: (usage) => finishRun(runId, usage),
      onError: (error) => failRun(runId, error),
    });
  };

  const loadExample = () => {
    setValues(() => ({ ...initialValues, ...agent.example }));
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 rounded-xl border border-ink-700/70 bg-ink-800/60 p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-ink-400">
            Run agent
          </p>
          <h2 className="mt-0.5 text-base font-semibold text-ink-100">
            {agent.name}
          </h2>
          <p className="mt-1 text-sm text-ink-300">{agent.description}</p>
        </div>
        <button
          type="button"
          onClick={loadExample}
          className="shrink-0 rounded-md border border-ink-600 px-2.5 py-1 text-[11px] font-medium text-ink-200 transition hover:border-ink-500 hover:text-ink-100"
        >
          Use example
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {agent.fields.map((field) => {
          const value = values[field.name] ?? "";
          const id = `field-${agent.id}-${field.name}`;
          return (
            <div key={field.name} className="flex flex-col gap-1">
              <label
                htmlFor={id}
                className="text-xs font-medium text-ink-200"
              >
                {field.label}
                {!field.required && (
                  <span className="ml-1 text-ink-400">(optional)</span>
                )}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  id={id}
                  rows={field.rows ?? 3}
                  placeholder={field.placeholder}
                  value={value}
                  onChange={(e) => setField(field.name, e.target.value)}
                  className="resize-y rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-ink-100 placeholder:text-ink-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              ) : field.type === "select" ? (
                <select
                  id={id}
                  value={value}
                  onChange={(e) => setField(field.name, e.target.value)}
                  className="rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-ink-100 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={id}
                  type="text"
                  placeholder={field.placeholder}
                  value={value}
                  onChange={(e) => setField(field.name, e.target.value)}
                  className="rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-ink-100 placeholder:text-ink-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              )}
              {field.helper && (
                <p className="text-[11px] text-ink-400">{field.helper}</p>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="submit"
        disabled={isBusy}
        className="flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-12px_rgba(124,92,255,0.8)] transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-ink-600 disabled:shadow-none"
      >
        {isBusy ? (
          <>
            <span className="h-2 w-2 animate-pulse-soft rounded-full bg-white" />
            Running…
          </>
        ) : (
          <>Run {agent.name}</>
        )}
      </button>
    </form>
  );
}
