# 09 — Personal Assistant Agent on a VPS

## Goal
Have always-running Claude agents on a VPS that act as the user's personal
assistant ("Ava") and any other persistent agents (e.g. "Mara" the doctor
agent from guide 08). They run on cron, listen for inbound triggers, and
chat with the user via Telegram.

> "I have two open client agents running on a VPS, and Ava is kind of my
> personal assistant."

## Data sources / inputs
- All the inbound channels: email, calendar, Telegram, iMessage bridge, Apple Health, Readwise, etc.
- The personal knowledge graph from guide 01
- Per-agent persona file (name, tone, scope)

## Components
- **VPS** — small Linux box (Hetzner, Fly.io machine, or similar), Tailscale to user's network for private resources
- **Agent runtime** — Claude Agent SDK; one process per agent persona
- **Scheduler** — `cron` or `systemd` timers for recurring jobs
- **Trigger bus** — lightweight pub/sub (Redis or a SQLite-backed queue) so a single inbound event can wake the right agent
- **Secrets** — `pass` / SOPS / Doppler; never plain `.env` on the VPS
- **Per-agent state directory** — `/srv/{agent}/state` for memory, logs, scratchpad

## Workflow
1. **Boot** — systemd starts each agent process; agent loads its persona + tool set + state.
2. **Idle** — agent waits on the trigger bus.
3. **Trigger** — could be a cron tick, a webhook (new email, new HealthKit upload, Telegram message), or an explicit user task.
4. **Run** — agent picks up context (its state dir + persona + relevant guide-1 retrieval), executes, writes results, posts user-facing message to Telegram.
5. **Sleep** — back to idle.

## Folder layout (suggested)
```
/srv/
  ava/                     # personal assistant
    persona.md
    tools.json
    state/
    logs/
  mara/                    # doctor agent (guide 08)
    persona.md
    state/
  shared/
    knowledge-graph/       # guide 01 store
    voice-profile.md       # for guide 04
```

## Hardening
- One Claude API key per agent so quota / abuse can be isolated
- Restricted Stripe / Gmail credentials per agent — never share root creds across agents
- All outbound actions are logged with diff so the user can audit
- "Read-only Mondays" mode — disables write tools for a day while debugging

## Deliverables
- Provisioning script (Ansible or shell) for the VPS
- One `systemd` unit per agent
- Telegram bot per agent (each has its own handle)
- Audit log shipped to the user's S3

## Open questions
- VPS vs always-on Mac mini at home — Mac is better for iMessage send (guide 04); VPS is better for uptime. Likely both.
- Cost ceiling per month — recommend a hard $/month cap per agent via API key
- How agents share memory without trampling each other — recommend single shared `knowledge-graph/` (write-locked) plus per-agent scratch
- Do agents need to be able to invoke each other? Yes — define a tiny RPC contract (Ava can ask Mara "is the user well today?" before scheduling a workout)
