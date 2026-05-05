# Podcast-to-Guides: Andrew Wilkinson AI Workflow Index

Source: podcast interview transcript with Andrew Wilkinson (~minute 47:23 onward).
Purpose: convert each system Andrew described into a standalone how-to build spec
we can use to actually implement it.

Each guide follows the same shape:

- **Goal** — what the system does for the user
- **Data sources / inputs** — what it reads
- **Components** — agents, APIs, storage, schedulers
- **Workflow** — step-by-step flow
- **Prompts / logic** — the core agent instructions
- **Deliverables** — what gets produced and where
- **Open questions** — decisions we still need to make before building

## Guides

| # | File | System |
|---|------|--------|
| 01 | `01-personal-knowledge-graph.md` | Personal vector knowledge base (G-Brain pattern) — page per person, draws connections from email |
| 02 | `02-always-on-day-recorder.md` | Always-on iPhone day recorder (Hearsay pattern) — full-day transcripts to iCloud |
| 03 | `03-daily-email-triage-and-project-radar.md` | Daily email triage that auto-detects active projects and outputs next steps |
| 04 | `04-multiple-choice-reply-quiz.md` | Inline 1A/2B reply quiz — turns inbox + iMessage into multiple choice |
| 05 | `05-personal-daily-brief-podcast.md` | Custom personalized daily podcast (Readwise + newsletters → Gemini voice) |
| 06 | `06-tweet-to-instagram-story.md` | Auto-publish tweets as scheduled Instagram Stories |
| 07 | `07-group-dinner-billing-automation.md` | Stripe link + email blast for recurring group events |
| 08 | `08-personal-doctor-agent.md` | Apple Health → daily health brief + symptom correlation + expert panel |
| 09 | `09-personal-assistant-on-vps.md` | Always-running personal assistant agent on a VPS |
| 10 | `10-self-interviewing-prompt-pattern.md` | Prompting pattern: have Claude interview *you* before answering |
| 11 | `11-agent-team-of-eight.md` | Default-to-eight sub-agent pattern for high-stakes answers |

## Cross-cutting building blocks

Most of these guides share the same primitives. When we go to build, we should
implement these once and reuse:

- **Personal context store** (`01`) — single source of truth for "who/what/when" about the user
- **Always-running agent runtime** (`09`) — VPS or always-on Mac with Claude agents that can run on cron and respond to triggers
- **Inbound channels** — email (IMAP / Gmail API), iMessage bridge, Telegram bot, Readwise API, Apple Health export
- **Outbound channels** — Telegram bot, Gmail send, Instagram Graph API, Stripe API
- **Persona layer** — voice/tone profile so drafts sound like the user

## Status

Spec-only. Nothing built yet. Use these as the input for implementation
planning conversations.
