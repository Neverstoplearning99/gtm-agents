# 06 — Tweet → Instagram Story

## Goal
Whenever the user posts a tweet, automatically generate a perfectly-scaled
Instagram Story image of that tweet and schedule it to post.

> "Whenever I tweet, I want you to create an Instagram story. So it creates
> an image that's perfectly scaled, free, and… put it into the Instagram
> creator thing and schedule it."

## Data sources / inputs
- User's X/Twitter account — new tweets only (skip retweets, replies, threads' non-first tweets unless configured)
- Brand profile (color, font, profile pic) for the rendered image

## Components
- **Tweet listener** — polls X API or webhook (or RSS bridge) for new tweets from the user
- **Renderer** — headless Chromium / Satori / Puppeteer pipeline that renders a tweet card on a 1080×1920 canvas with brand styling
- **Scheduler** — Instagram Graph API (Business account) `media_publish` with `scheduled_publish_time`, OR a service like Buffer/Later if the user prefers a UI
- **Filter rules** — skip replies, skip threads after first tweet, skip below engagement threshold (optional)

## Workflow
1. New tweet detected.
2. Apply filter rules. Skip if it doesn't qualify.
3. Render image:
   - 1080×1920 canvas with brand background
   - centered tweet card: avatar, handle, text, link preview if any
   - subtle "follow on X" footer
4. Upload to IG container with caption (auto-generated from tweet + hashtags).
5. Schedule for ~30 min after the tweet (so the X post has time to gather initial engagement) OR immediately if user prefers.
6. Log to `workspace/social-media/cross-post-log.csv`.

## Renderer notes
- Use Satori + Resvg (or `og:image`-style) for fast deterministic rendering — avoids brittle browser screenshots
- Auto-resize text to fit (binary search font-size between 32-72pt)
- For tweets with media, lay tweet over a darkened, blurred version of the media

## Deliverables
- Background worker (one always-on process)
- `workspace/social-media/cross-post-log.csv` — audit trail
- Brand template file (editable)

## Open questions
- X API tier required — basic tier rate limits may be tight; alternative is a hidden RSS bridge
- IG requires a Business / Creator account linked to a Facebook Page for the API
- Do we cross-post threads as carousels?
- Do we ever want manual approval gate, or always auto?
