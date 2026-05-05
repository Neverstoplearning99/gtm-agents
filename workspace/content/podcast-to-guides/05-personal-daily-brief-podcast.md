# 05 — Personal Daily Brief Podcast

## Goal
Generate a short (~7 minute) custom audio podcast every morning, drawn from
the user's own newsletters and saved articles, narrated in a Daily-style
format by Gemini Voice (or equivalent TTS). Includes a "memento mori"
countdown segment and a Stoic quote.

> "It's so cool because one of the reasons I stopped listening to podcasts
> like that was because they would be depressing or I just don't care about
> the stuff."

> "It says 'You have this many more summers with your kids. You have this
> many more days to live. Here's a quote from Seneca to give you a sense of
> purpose today.'"

## Data sources / inputs
- Readwise Reader API — saved articles, highlights
- Inbox newsletter folder — newsletters delivered overnight
- User profile (interests, city, businesses, family details — kids' ages for "summers with your kids" math)
- Stoic quote library (Seneca, Marcus Aurelius, Epictetus)

## Components
- **Story selector agent** — ranks last 24h items against the user profile; picks ~5 stories that are positive, relevant, or actionable
- **Script writer agent** — writes a Daily-style script: cold open → countdown segment → 3-5 stories → Stoic quote close
- **TTS pipeline** — Gemini TTS, ElevenLabs, or OpenAI TTS, single-voice host
- **Mixer** — adds simple bumper music, normalizes loudness
- **Distribution** — uploads MP3 to a private podcast feed (S3 + RSS) so it auto-shows in Apple Podcasts / Overcast

## Workflow
1. **05:00 cron** — pull new Readwise items + newsletter folder.
2. Selector picks ~5 stories filtered by `tone != depressing` and `relevance > threshold`.
3. Writer drafts script with sections:
   - 30-sec cold open with countdown ("4,182 days left if you live to 80; 14 more summers with the kids")
   - 5 stories @ 60-90s each
   - Stoic close
4. TTS renders to MP3 (~7 min target).
5. Push to private podcast feed.
6. Telegram message: "Today's brief is ready 🎧" with link.

## Prompts / logic (script writer, sketch)
```
Write a 7-minute personal daily brief in the voice of a single calm, thoughtful host.
Hard rules:
- No politics unless directly relevant to the user's businesses or city ({city}).
- No "doom" framing. Anything that would make the listener anxious must be reframed
  as agency: what they could do, or simply skipped.
- Always open with the countdown: days left to live (assume age {age}, life expectancy 85),
  summers left with each kid until they turn 18.
- Always close with a 1-2 sentence Stoic reflection tied to today's stories.
- Total target: 1000-1200 words.
```

## Deliverables
- Daily MP3 in private podcast feed
- `workspace/content/daily-brief/{YYYY-MM-DD}.md` — the script
- Subscription-ready RSS feed URL

## Open questions
- Voice choice — single host vs two-host banter (Daily uses two)
- Music licensing for bumper
- Do we want video version (vertical, for stationary bike) too?
- Andrew floated this as a $10/mo product — out of scope for the personal version, but worth noting
