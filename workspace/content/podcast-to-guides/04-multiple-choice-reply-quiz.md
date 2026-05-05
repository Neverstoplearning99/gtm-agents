# 04 — Multiple-Choice Reply Quiz

## Goal
For high-priority inbound (email + iMessage), draft 2-4 candidate replies in
the user's voice, send them as a multiple-choice quiz, and let the user reply
with a short code (`1A`, `2B`, `3C`) to send the chosen draft.

> "It turns your entire business into a multiple-choice quiz basically. Every
> day I just get like 20 different messages."

## Data sources / inputs
- High-priority email (flagged by guide 03)
- iMessage (via Mac Messages.app database or BlueBubbles bridge)
- Persona pages from guide 01 (for context on the sender)
- User's writing style profile (sample of past sent emails)

## Components
- **Voice profile** — fine-tuned style prompt built from a corpus of the user's past sent messages (tone, sign-off, common phrases, length distribution)
- **Drafter agent** (Sonnet) — for each priority message, drafts 2-4 distinct replies covering different stances (yes/no/ask-for-more-info/delegate)
- **Quiz delivery** — Telegram message: original snippet + drafts labeled `A`, `B`, `C` per message; messages numbered `1`, `2`, `3` …
- **Reply parser** — listens for shortcodes, sends the chosen draft via the original channel
- **iMessage bridge** — required for sending replies into iMessage threads

## Workflow
1. New high-priority message arrives.
2. Drafter generates 2-4 reply options across distinct stances.
3. Telegram message format:
   ```
   📩 1) Bonus question from Sarah (HR)
   "Hey, I think I'm owed the Q1 bonus, right?"

   1A — Confirm bonus, ask payroll to process
   1B — Push back; bonus tied to retention through April
   1C — Forward to CFO for decision
   ```
4. User replies `1B`. Bot sends draft 1B as a real reply, marks original as handled.
5. If none fit, user can reply `1F` for "freeform" and dictate their own.

## Prompts / logic (drafter, sketch)
```
You are drafting candidate replies in the user's voice. Constraints:
- Length must match user's typical reply length for this contact (read recent thread).
- Always produce 2-4 distinct STANCES, not 4 phrasings of the same answer.
- Label each draft with a 4-7 word "stance summary" so the user can choose without reading the body.
- If the message is sensitive (HR, legal, money over $X), prepend a ⚠️ flag.

Voice profile is in voice-profile.md. Recent thread context is in {thread.txt}.
```

## Deliverables
- Telegram bot with quiz UX
- iMessage send bridge (Mac-resident helper)
- `workspace/email-campaigns/voice-profile.md` — auto-built style guide

## Open questions
- iMessage sending is fragile — BlueBubbles vs AppleScript on a Mac mini vs nothing
- Confidence threshold to even bother the user (avoid quiz fatigue)
- Audit log of what got sent on the user's behalf
- How to handle multi-recipient threads (Reply vs Reply-All)
