# GrowthAgents

**Dispatch agentic AI workers to handle the growth tasks founders hate doing themselves.** GrowthAgents is a focused web app with five specialist agents — lead research, cold outbound, content planning, competitor teardowns, growth experiments — each with an opinionated system prompt and streaming output. Pick an agent, fill 2–4 fields, watch real work appear in seconds.

---

## 30-second pitch

Founders waste 15+ hours a week on growth busywork. GrowthAgents replaces that work with five specialist agents, each one wired with the prompts and structure of an experienced operator — no generic chat, no fluff, just outputs you can paste into a CRM, an email client, or a sprint plan.

---

## 3-step setup

1. `cp .env.local.example .env.local` and paste your `ANTHROPIC_API_KEY` (get one at <https://console.anthropic.com/settings/keys>).
2. `npm install`
3. `npm run dev` and open <http://localhost:3000>.

That's it.

---

## The five agents

| Agent | One-liner |
|---|---|
| **Lead Researcher** | Vet a target account in 30 seconds — industry, headcount, recent signals, ICP fit score, and the angle to lead with. |
| **Outbound Writer** | Three cold email variants (gentle, direct, contrarian) with subject lines built to actually get opened. |
| **Content Strategist** | A 7-day social plan with one LinkedIn post, one X post, and one short-form hook per day, in your audience's voice. |
| **Competitor Watcher** | A teardown of any competitor: positioning, claimed differentiators, and three weak points an upstart can attack. |
| **Growth Experiment Designer** | Three shippable experiments to move a metric (activation, conversion, retention, referral, or expansion) — hypothesis, setup, success criteria, effort. |

---

## How to add a new agent

Every agent is one object in [`lib/agents.ts`](lib/agents.ts). Adding one is mechanical:

1. Add the agent's id to the `AgentId` union in [`lib/types.ts`](lib/types.ts).
2. In `lib/agents.ts`, define a new `AgentDefinition`:
   - `id`, `name`, `tagline`, `description`, `emoji`, `accent`
   - `fields` — 2 to 4 form fields (`text`, `textarea`, or `select`)
   - `systemPrompt` — opinionated, structured, with explicit output format and hard rules
   - `buildUserMessage(input)` — turns form values into the user message
   - `example` — the values "Use example" populates
3. Append it to the `agentList` array and the `agents` map.

That's the entire surface area. The route handler, sidebar, form, streaming, and chat panel all pick it up automatically.

---

## Tech

- **Next.js 14** App Router, React 18, TypeScript strict mode (no `any`)
- **Tailwind CSS** dark UI, mobile-responsive
- **Anthropic SDK** with `claude-sonnet-4-6`, streaming via `messages.stream`
- **Zustand** for session-only state (no database)
- API key lives in `.env.local`, only ever read on the server

---

## Hit the API directly

Each agent is a POST endpoint that streams newline-delimited JSON events (`{"type":"text","text":"..."}`, then `{"type":"done","usage":{...}}`).

```bash
curl -N -X POST http://localhost:3000/api/agents/lead-researcher \
  -H 'Content-Type: application/json' \
  -d '{
    "input": {
      "company": "Ramp",
      "offer": "We help finance teams at Series B+ companies automate their month-end close from 10 days to 2 days using agentic AI."
    }
  }'
```

Other agent ids: `outbound-writer`, `content-strategist`, `competitor-watcher`, `experiment-designer`. Each expects the fields defined for that agent in `lib/agents.ts`.

---

## Scripts

- `npm run dev` — local dev server on <http://localhost:3000>
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run typecheck` — strict TypeScript check
- `npm run lint` — Next.js lint

---

## License

MIT-style — fork it, ship it, charge for it.
