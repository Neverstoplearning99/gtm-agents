# 02 — Always-On Day Recorder (Hearsay pattern)

## Goal
Replace the discontinued Limitless pendant with an iPhone app that records
audio during user-defined windows of the day, transcribes it, and ships the
transcripts to iCloud so other agents (especially the knowledge graph in
guide 01) can use them as life-context.

> "I record my entire day and then G-BRAIN ingests it and it just knows context."

## Data sources / inputs
- iPhone microphone
- User-defined recording schedule (e.g. "afternoons only" or "all day")

## Components
- **iOS app** (Swift / SwiftUI) — handles permissions, schedule, background audio
- **On-device or cloud transcription** — Whisper.cpp on-device for privacy, or API for speed
- **iCloud Drive sync** — transcripts written as `YYYY-MM-DD-HHMM.txt` plus optional `.m4a` audio
- **Downstream ingestor** — the knowledge graph (guide 01) and personal assistant (guide 09) watch the iCloud folder and ingest new transcripts

## Workflow
1. User configures recording windows in app settings.
2. App starts/stops recording on schedule; chunked into ~5-min segments to limit data loss.
3. Each segment is transcribed (with speaker diarization if possible).
4. Transcript + metadata (timestamp, location, calendar event if any) lands in iCloud.
5. Knowledge graph agent picks it up and updates relevant person pages and a daily journal.

## Prompts / logic (ingestor, sketch)
```
For each new transcript:
1. Identify which calendar event (if any) it overlaps with — use that as title.
2. Extract: people mentioned, decisions made, commitments made by the user,
   commitments made TO the user, follow-ups owed.
3. Append a dated entry to workspace/clients/{client}/notes/ if it maps to a client,
   otherwise to workspace/research/daily-journal/{YYYY-MM-DD}.md
4. Update relevant persona pages from guide 01.
```

## Deliverables
- iOS app (Hearsay-style) — TestFlight or self-signed
- iCloud folder of timestamped transcripts
- Daily journal entries auto-generated for the user

## Open questions
- Legal: one-party vs two-party consent recording laws — **must prompt user about jurisdiction**
- Battery and storage budget — segment length and codec choice
- On-device transcription quality bar — Whisper-large vs Whisper-small
- Do we want diarization? Worth the complexity?
- How to mark "do not record" windows (e.g. medical, legal, personal)?
