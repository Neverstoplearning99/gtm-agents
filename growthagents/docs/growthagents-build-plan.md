---
title: GrowthAgents MVP Build Plan
project: GrowthAgents
status: approved
created: 2026-09-23
branch: claude/growthagents-mvp-DY0Wf
tags: [growthagents, build-plan, gtm-agents, ai-agents, gtm-play-studio]
related: "[[growthagents-build-log]]"
---

# GrowthAgents MVP Build Plan

> [!note] Recovery note
> The original plan file (`/root/.claude/plans/build-a-fully-working-declarative-blanket.md`) was lost when the cloud container restarted. It was recovered word for word from the Claude Code session transcript. The user approved it and then added the requirement in the **Addendum** at the bottom. The as-built record, including where the build departed from this plan, is in [[growthagents-build-log]].

## Context

The user is shipping **GrowthAgents**, a standalone Next.js 14 web app inside the `gtm-agents` repo. It's an independent commercial-grade MVP — a dashboard with five specialized AI growth agents that founders dispatch to handle research, outbound, content, competitive intel, and experimentation. Each agent is a real streaming Claude call with an opinionated system prompt. No mocks, no placeholders, no clarifying questions — the user wants the full thing in one pass and it must run with `npm install && npm run dev` after pasting an API key.

The repo today has no JS/TS toolchain — it's a plugin/markdown ecosystem. Node 22.22 and npm 10.9 are available. Current branch is `claude/growthagents-mvp-DY0Wf` (clean). We're building a brand-new isolated subdirectory at `/home/user/gtm-agents/growthagents/`.

## Approach

Standalone Next.js 14 (App Router) + TypeScript strict + Tailwind + Anthropic SDK streaming. Server route handlers do the LLM calls (API key never hits the client). Client uses Zustand for session state and consumes a streaming `ReadableStream` from the route. Dark UI, mobile responsive.

## Directory layout

```
growthagents/
├── package.json
├── tsconfig.json
├── next.config.mjs
├── next-env.d.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── .gitignore
├── .env.local.example
├── README.md
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/agents/[agentId]/route.ts
├── lib/
│   ├── agents.ts        # 5 agent configs: id, name, blurb, fields, system prompt, user-prompt builder
│   ├── anthropic.ts     # SDK singleton + model constant
│   └── types.ts         # AgentId, AgentConfig, AgentField, RunRequest
├── components/
│   ├── Sidebar.tsx      # Agent list, mobile drawer
│   ├── AgentForm.tsx    # Dynamic form per agent
│   ├── ChatPanel.tsx    # Streaming output, history, run metadata
│   ├── RunMeta.tsx      # Elapsed time + token estimate
│   ├── EmptyState.tsx
│   └── ErrorBanner.tsx
└── store/useStore.ts    # Zustand: selectedAgentId, runsByAgent[], activeRun
```

## Files to create — key details

### `package.json`
- `next@14.2.x`, `react@18.3.x`, `react-dom@18.3.x`
- `@anthropic-ai/sdk@^0.30` (supports `messages.stream`)
- `zustand@^4.5`
- `tailwindcss@^3.4`, `postcss`, `autoprefixer`
- `typescript@^5.4`, `@types/react`, `@types/react-dom`, `@types/node`
- Scripts: `dev`, `build`, `start`, `lint`
- `engines.node >= 18.18`

### `tsconfig.json`
- `"strict": true`, `noUncheckedIndexedAccess: true`, `target: ES2022`, `moduleResolution: bundler`, paths alias `@/*` → `./*`

### `lib/agents.ts` — the heart of the product
Five entries. Each has:
- `id`: `"lead-researcher" | "outbound-writer" | "content-strategist" | "competitor-watcher" | "growth-experiment-designer"`
- `name`, `tagline`, `icon` (emoji or simple SVG path)
- `fields[]`: `{ key, label, placeholder, type: "text"|"textarea"|"select", required, options? }`
- `systemPrompt`: opinionated, role-defining, output-shape-specifying. ~150-300 words each.
- `buildUserPrompt(input)`: returns the user message string with structured input.

System prompt design (concrete, founder-useful — no fluff):

1. **Lead Researcher** — "You are a senior B2B sales researcher…" Output sections: Company Snapshot (industry, est. employees, HQ), Recent Signals (funding/news/leadership/product within last 12 months — say "no public signal found" if unknown), ICP Fit Score 1-10 with rubric reasoning, Recommended Angle (one sentence), Opening Line (15 words max). Forbid hedging filler. Use bullet points.

2. **Outbound Writer** — "You are a cold-email specialist who has sent 500k+ emails…" Three variants labeled GENTLE / DIRECT / CONTRARIAN. Each with subject line (≤8 words), 3-paragraph body (≤90 words total), single CTA. Hard rules: no "I hope this finds you well", no "quick question", no "circling back", no em-dashes, no AI tells. Personal, specific, founder-voice.

3. **Content Strategist** — "You are a B2B content strategist who runs accounts that drive 10M+ impressions/year…" 7-day plan: Day 1-7. Each day: Theme, LinkedIn post (full draft, ≤220 words, scroll-stopping hook line 1), X post (≤280 chars, punchy), Hook variant (one-line for Reels/Shorts/TikTok). Vary post types: contrarian take, data point, story, framework, case study, question, prediction.

4. **Competitor Watcher** — "You are a competitive intelligence analyst…" Sections: Positioning Summary (3 sentences), Claimed Differentiators (top 3, what they say publicly), Three Attack Vectors (each: weakness, evidence/reasoning, how an upstart wins). Note when working from limited public info.

5. **Growth Experiment Designer** — "You are a growth PM who's run 200+ experiments at top SaaS companies…" Three experiments. Each: Hypothesis (if/then format), Setup (concrete steps, channels, audience), Success Criteria (metric + magnitude + timeframe), Effort (S/M/L with hours), Risk (one line). Bias toward cheap, fast, learnable bets first.

### `app/api/agents/[agentId]/route.ts`
- `POST` handler.
- Validates `agentId` against agents map. 400 if unknown.
- Reads `ANTHROPIC_API_KEY`. If missing → 500 with clean JSON error message.
- Body: `{ input: Record<string, string> }`. Validates required fields → 400 if missing.
- Calls `anthropic.messages.stream({ model: "claude-sonnet-4-6", max_tokens: 2048, system, messages })`.
- Returns a `Response` with a `ReadableStream` that pipes `text` deltas as plain UTF-8 text. `Cache-Control: no-store`. Final chunk includes a sentinel `\n\n[[META]]{json}\n` with input_tokens/output_tokens parsed from `final_message.usage` so the client can show real token count.
- Wraps stream in try/catch — on Anthropic error, emits a `\n\n[[ERROR]]{json}\n` sentinel and closes.

### `app/page.tsx`
- Two-column layout: Sidebar (left, fixed 260px on lg, drawer on mobile) + main panel (form on top, streaming chat below).
- Reads selected agent from Zustand. Renders matching form fields.
- On submit: opens fetch to `/api/agents/{id}`, reads stream via `response.body.getReader()`, decodes, appends tokens to active run text in store, parses `[[META]]` / `[[ERROR]]` sentinels.
- Mobile: hamburger button, sidebar slides in.

### `components/ChatPanel.tsx`
- Shows `runsByAgent[selectedAgentId]` as a chat-style list (input echo as user bubble, streamed output as agent bubble with agent name + elapsed timer + token count).
- Auto-scrolls to bottom while streaming.
- Empty state when no runs yet for that agent (uses `EmptyState`).

### `components/EmptyState.tsx`
- Per-agent: icon, one-line description, two example prompts as suggestion chips that prefill the form.

### `components/ErrorBanner.tsx`
- Dismissible, red-tinted, top of chat panel.

### `store/useStore.ts` (Zustand)
```ts
type Run = { id: string; agentId: AgentId; input: Record<string,string>;
  output: string; status: "streaming"|"done"|"error";
  startedAt: number; finishedAt?: number;
  inputTokens?: number; outputTokens?: number; error?: string };
```
Actions: `selectAgent`, `startRun`, `appendOutput(runId, chunk)`, `finishRun(runId, meta)`, `failRun(runId, err)`.

### `app/globals.css`
- Tailwind directives + dark color tokens. Background `#0a0a0b`, panel `#111114`, border `#1f1f24`, accent `#7c5cff` (violet) and `#22c55e` (green) for streaming pulse.

### `tailwind.config.ts`
- Content scan for `app/**/*.{ts,tsx}` + `components/**/*.{ts,tsx}`. Custom dark palette. No daisyUI / extras — keep it clean.

### `.env.local.example`
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### `.gitignore`
Standard Next.js gitignore: `node_modules/`, `.next/`, `.env.local`, `.env*.local`, `out/`, `*.log`, `.DS_Store`.

### `README.md`
- 30-second pitch (≤3 sentences).
- Setup (3 steps): copy `.env.local.example` → `.env.local`, paste key, `npm install && npm run dev`, open `http://localhost:3000`.
- "Run from repo root" note: `cd growthagents` first.
- One-line description per agent.
- "How to add a new agent" — 4 steps: append to `lib/agents.ts`, define system prompt + buildUserPrompt + fields, no other changes needed.
- Working curl example hitting `POST /api/agents/lead-researcher` with sample body.

## What I will reuse vs. build new

There is **nothing to reuse** in the existing repo — it's all Markdown plugin definitions. The 5 agent system prompts are written fresh (not copied from `plugins/`) because the existing plugin agents are CLI-style markdown files for a different runtime, not Next.js streaming prompts. Building net-new is the right call.

## Verification

After scaffolding:
1. `cd /home/user/gtm-agents/growthagents && npm install` — must complete with no errors.
2. `npx tsc --noEmit` — clean (strict mode).
3. `npm run build` — Next.js production build succeeds.
4. Manual smoke (when user runs it): set key, `npm run dev`, open `http://localhost:3000`:
   - All 5 agents appear in sidebar.
   - Select Lead Researcher, fill `companyName=Linear` + `offer=Sales analytics for B2B SaaS`, click Run.
   - Output streams token-by-token into chat panel.
   - Token count + elapsed time appear after stream finishes.
   - Switch to Outbound Writer — history persists for Lead Researcher when switching back.
   - Mobile viewport: sidebar collapses to drawer, layout reflows cleanly.
5. curl smoke from README works: returns streamed text response.
6. Missing API key path: temporarily unset, click Run, ErrorBanner shows clean message, app does not crash.

## Critical files to land

- `growthagents/package.json`
- `growthagents/tsconfig.json`
- `growthagents/next.config.mjs`
- `growthagents/tailwind.config.ts`
- `growthagents/postcss.config.mjs`
- `growthagents/app/layout.tsx`
- `growthagents/app/page.tsx`
- `growthagents/app/globals.css`
- `growthagents/app/api/agents/[agentId]/route.ts`
- `growthagents/lib/agents.ts`  ← the substance
- `growthagents/lib/anthropic.ts`
- `growthagents/lib/types.ts`
- `growthagents/components/Sidebar.tsx`
- `growthagents/components/AgentForm.tsx`
- `growthagents/components/ChatPanel.tsx`
- `growthagents/components/RunMeta.tsx`
- `growthagents/components/EmptyState.tsx`
- `growthagents/components/ErrorBanner.tsx`
- `growthagents/store/useStore.ts`
- `growthagents/.env.local.example`
- `growthagents/.gitignore`
- `growthagents/README.md`

## Final actions

1. Build all files in one pass.
2. Run `npm install` + `npx tsc --noEmit` + `npm run build` to confirm green.
3. Commit to `claude/growthagents-mvp-DY0Wf` and push with `-u origin`.
4. Print exactly the user's required final message.

---

## Addendum: standalone + embeddable (approved by the user)

> "This should be built as a project or a full tool that can stand alone by itself, but can also be incorporated or implemented into other tools, such as Miles's GTM Play Studio." (https://gtm-play-studio.vercel.app/plays)

This sandbox's network policy blocks the Play Studio URL, so the integration surface is generic. It works with any web app and fits naturally with a Next.js app on Vercel:

1. **Framework-agnostic core** (`core/`), with no Next.js or React imports. `runAgent()` is an async generator of typed events. A host app can copy the folder or import from it.
2. **Public HTTP API with CORS.**
   - `GET /api/agents` returns the agent manifest: ids, names, form fields and examples.
   - `POST /api/agents/{agentId}` streams events.
   - The allowed origins come from `GROWTHAGENTS_ALLOWED_ORIGINS`, which defaults to `https://gtm-play-studio.vercel.app`.
3. **Embed route** `/embed/{agentId}`. It's a single-agent UI for an `<iframe>`, with prefill via query params.
   - It sends `postMessage` events to the parent window: `growthagents:ready`, `growthagents:run-start`, `growthagents:run-complete` and `growthagents:run-error`.
   - It accepts `growthagents:prefill` and `growthagents:run` from the parent.
   - `frame-ancestors` is driven by the same env var.
4. **Drop-in client** `core/client.ts`. `streamAgent()` is a typed fetch/stream helper for host apps.
