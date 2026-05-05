# 08 — Personal Doctor Agent ("Mara")

## Goal
A personal health agent that:
1. Ingests Apple Watch + Apple Health data daily
2. Sends a morning health summary (HRV, RHR, respiratory rate, sleep quality)
3. Correlates symptoms with biomarkers ("every flare is preceded by a 3-day wrist-temperature shift")
4. Tracks medication adherence
5. For high-stakes questions, **spins up a panel of specialist agents** (rheumatologist, internist, etc.) running with extended thinking and access to the full personal medical history

> "It looked through my data over the last five years and said 'Oh I've
> correlated it and I see that every time you get that flare your wrist
> temperature changes for three days before.'"

## Data sources / inputs
- Apple Health export (JSON via auto-export app to Google Drive or iCloud)
- User-logged symptoms / medications (lightweight: Telegram quick-log)
- User medical history doc (free-text, manually authored)
- Knowledge graph from guide 01 (for context)

## Components
- **Health data normalizer** — parses Apple Health JSON into a daily metrics SQLite table
- **Daily summarizer agent** (Sonnet) — produces the morning brief
- **Anomaly + correlation worker** — runs nightly; flags multi-day deviations and runs simple correlation between symptom logs and biomarker timeseries
- **Symptom logger** — Telegram bot that accepts free-text or quick-buttons ("flare started", "took meds")
- **Adherence tracker** — compares logged dose-times against prescription schedule
- **Expert panel orchestrator (Max Intelligence mode)** — spawns 8 specialist sub-agents with extended thinking; each gets the relevant slice of the medical history; a synthesizer agent merges their answers

## Workflow

### Daily summary (every morning)
1. New Apple Health JSON dropped to Drive → normalizer ingests.
2. Summarizer compares last-night metrics to 30-day baseline.
3. Sends Telegram message: HRV, RHR, respiratory rate, sleep stages, deviations flagged, adherence status.

### Symptom correlation (nightly)
1. For each ongoing symptom, run a windowed correlation against every metric over the past 90 days.
2. Promote correlations passing a significance threshold to the user's medical history doc.
3. If a leading-indicator pattern is detected (e.g. wrist temp shifts 3 days before flare), enable a **forecast watcher** that pings the user when the leading indicator triggers.

### Expert panel (on demand)
1. User asks a high-stakes question ("should I take this medication?").
2. Orchestrator spins up 8 specialist sub-agents with extended thinking enabled:
   - rheumatologist, internist, pharmacologist, sleep medicine, cardiologist, neurologist, lifestyle medicine, second-opinion generalist
3. Each gets: the question + the user's medical history + relevant biomarker slice + drug interactions.
4. Each writes a memo. Synthesizer merges them into a single recommendation with explicit areas of agreement / disagreement.
5. Output flagged with: **"Not medical advice. Discuss with a licensed physician."**

## Prompts / logic (panel orchestrator, sketch)
```
You are coordinating a panel of 8 medical specialist agents to give the user
a thorough, well-reasoned answer to a health question.

For each specialist:
- Use extended thinking (max budget).
- Provide ONLY the medical history sections relevant to their specialty (don't dump everything).
- Ask them to: (1) state their answer, (2) list what they would want to know more about,
  (3) flag any drug interactions or red flags they see.

Then synthesize. Highlight any disagreement explicitly. Do NOT smooth it over.
End with: explicit disclaimer + recommended next action with a real physician.
```

## Deliverables
- Daily Telegram health summary
- `workspace/research/health/correlations.md` — discovered patterns, with data
- Expert-panel report on demand → `workspace/research/health/panels/{date}-{topic}.md`

## Open questions
- **Ethics & legal** — must include a non-negotiable disclaimer; never substitute for a doctor
- Privacy — strongly prefer this runs locally or on a private VPS, not via shared infra
- How to log medications in <10 seconds — Telegram quick-buttons recommended
- How to handle "expert panel" cost — extended thinking × 8 is expensive; gate by user confirmation
- Does the persona ("attractive woman doctor agent") matter? Andrew said yes for engagement — leave to user preference
