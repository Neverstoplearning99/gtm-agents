# 07 — Group Dinner Billing Automation

## Goal
For recurring group events (Andrew's example: a men's group that meets in
rented boardrooms over dinner), automate everything around billing
attendees — Stripe payment links, subscription setup, reminder emails — from
a single natural-language task.

> "I had that as a single task to my OpenClaw agent and it went out, went in
> the Stripe API, sent the emails, did everything."

## Data sources / inputs
- Attendee list (names + emails, ideally already a Google Group or Airtable/Notion table)
- Event details (date, location, expected cost, who paid)
- Stripe account (live key, restricted to specific endpoints)

## Components
- **Event runner agent** — parses a one-line task ("collect $80 from each attendee for May dinner; put new members on monthly $80 subscription")
- **Stripe client** — creates products, prices, payment links, customers, subscriptions
- **Email sender** — Gmail API or Postmark/Resend; templated per attendee
- **State store** — `workspace/clients/mens-group/billing.csv` — who paid, who's on subscription, who's outstanding

## Workflow
1. **User issues task** in natural language ("send Stripe links to everyone for tomorrow's dinner, $80 each").
2. Agent reads the attendee list and the prior billing state.
3. For each attendee:
   - If on subscription → skip (mark as covered).
   - Else → create a Stripe Payment Link tied to a one-off price for this event.
   - If first-time attendee → also offer subscription option in the email.
4. Send personalized email with link.
5. Webhook listener updates billing.csv as payments come in.
6. **Reminder loop** — 24h and 1h before event, nudge anyone unpaid.
7. Post-event summary back to the user: who paid, who didn't, total collected.

## Prompts / logic (event runner, sketch)
```
You are running billing for a recurring group event. Tools available:
- stripe.create_payment_link(amount, attendee_id, metadata)
- stripe.create_subscription(customer_id, price_id)
- email.send(to, subject, body)
- state.read() / state.write()

Hard rules:
- Never charge the same attendee twice for the same event_id.
- Never email an attendee more than 3 times for one event.
- If you are unsure (ambiguous attendee match, unusual amount), STOP and ask the user.
```

## Deliverables
- Event runner agent (callable as a one-line task)
- Stripe webhook → state updater
- `workspace/clients/mens-group/` folder with attendees, billing log, email templates

## Open questions
- Stripe account restricted-key scope — recommend a dedicated key with only `payment_links:write`, `subscriptions:write`, `customers:write`
- Can this generalize beyond men's group? Yes — same pattern works for any small recurring event
- Do we want a "dry-run" mode that shows the plan before executing?
- What happens for partial payments / refunds?
