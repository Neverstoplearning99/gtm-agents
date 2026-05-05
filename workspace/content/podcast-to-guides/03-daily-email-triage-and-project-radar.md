# 03 — Daily Email Triage & Project Radar

## Goal
Every morning, deliver a single report that:
- Summarizes what's in the inbox
- Auto-detects which **active projects** the user has going (e.g. "you're on this podcast", "your Airtable is about to expire", "your brother's birthday is coming up", "you're bidding on a building")
- Lists clear **next steps** with one-tap actions ("don't worry about it" / "send email to admin asking her to remind X")

> "It just figures out all of those things and every day I get this report."

## Data sources / inputs
- Email (Gmail API or IMAP) — last 24-72 hours plus unread backlog
- Calendar
- Persona pages from guide 01 (so it knows who people are)
- Day-recording transcripts from guide 02 (so it knows what's already happened)
- Optional: subscription tracker (for "Airtable about to expire" type alerts)

## Components
- **Triager agent** (Sonnet) — reads new email, classifies (junk / fyi / action / urgent), groups by project
- **Project detector agent** — clusters threads + calendar events + persona signals into named "active projects"
- **Briefer agent** (Sonnet) — turns the project list into a concise daily digest with next-step suggestions
- **Delivery channel** — Telegram bot (matches Andrew's setup) or email-to-self
- **Action handler** — receives short-codes back from user and executes (see guide 04)

## Workflow
1. **02:00 nightly cron** — pull all new mail since last run, classify, dedupe.
2. **Project clustering** — group by entity (people, threads, calendar invites), name each cluster.
3. **Next-step generation** — for each project: 1 sentence status + 1-3 suggested actions.
4. **06:30** — deliver daily brief via Telegram. Each item has an inline shortcode like `1A` / `1B` for quick reply.
5. User replies with shortcodes; action handler executes (send email to admin, snooze, etc.).

## Prompts / logic (project detector, sketch)
```
Given a list of email threads and calendar events from the last 7 days,
identify the user's currently-active projects. A project is anything that:
- has 2+ touchpoints in the last 14 days, OR
- has an explicit deadline in the next 30 days, OR
- the user has personally replied to in the last 7 days.

Output JSON:
[{
  "name": "Bid on warehouse building",
  "status": "Awaiting counter-offer from seller's broker",
  "deadline": "2026-05-12",
  "next_steps": [
    {"id": "1A", "action": "Send follow-up to broker"},
    {"id": "1B", "action": "Loop in lawyer"},
    {"id": "1C", "action": "Snooze for 3 days"}
  ]
}, ...]
```

## Deliverables
- Daily Telegram brief (or email)
- `workspace/reports/daily-brief/{YYYY-MM-DD}.md` archive
- Live "active projects" list the user can see anytime

## Open questions
- Confidence threshold for auto-classifying junk vs fyi
- How aggressive to be about archiving — Andrew's report archives a lot
- Where to store project state between runs (SQLite recommended)
- Privacy: does this run locally or on the VPS?
