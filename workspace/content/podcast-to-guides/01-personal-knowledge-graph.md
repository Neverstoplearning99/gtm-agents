# 01 — Personal Knowledge Graph (G-Brain pattern)

## Goal
Build a personal vector knowledge base over the user's emails (and other
markdown sources) so the user can ask things like:

> "I'm raising money for our yerba mate business — who do I know that would be
> good for that round? Now draft a powerful email to them and make a deck."

The system should auto-generate **a page per person** the user knows, with
connections drawn between people, companies, deals, and topics.

## Data sources / inputs
- Full email archive (Gmail / IMAP), ingested in batches of ~1,000 messages
- Markdown notes folder on local disk
- Optional: calendar history, iMessage history, day-recording transcripts (see guide 02)

## Components
- **Vector store** — local-first (e.g. SQLite + sqlite-vss, Chroma, LanceDB) so personal data stays on the user's machine
- **Ingestion worker** — batched email pull → normalize → chunk → embed
- **Graph builder agent** — Sonnet-class model that reads chunks and emits:
  - person nodes (`name`, `aliases`, `companies`, `tags`, `relationship_strength`)
  - relationship edges (`co-investor`, `worked-at`, `introduced-by`, etc.)
  - per-person markdown page in `workspace/personas/{slug}.md`
- **Query agent** — accepts natural-language queries, retrieves relevant person pages + email snippets, composes the answer
- **Action layer** — once a list of people is selected, can hand off to draft-email and deck-generator subagents

## Workflow
1. **Backfill** — paginate through email 1,000 at a time. For each batch, the graph builder agent updates the existing person pages or creates new ones.
2. **Incremental sync** — cron every N minutes pulls new mail and updates pages.
3. **Query** — user asks a question; retriever pulls top-k person pages + supporting emails; answerer ranks them and explains why each match fits.
4. **Action** — selected people get passed to a writer agent that drafts emails in the user's voice and a deck generator (Gamma or slides).

## Prompts / logic (graph builder, sketch)
```
You are maintaining a personal CRM-style markdown page for every person the
user knows, derived from their email. For each batch of emails:

1. Extract every distinct person (sender, recipient, mentioned).
2. For each person, update or create workspace/personas/{slug}.md with:
   - aliases / email addresses
   - current company + role
   - relationship strength (1-5) based on volume and recency
   - tags (investor, founder, friend, vendor, ...)
   - notable threads (date + 1-line summary, max 20 most recent)
   - inferred interests / expertise
3. Maintain a separate edges.jsonl with relationships between people.
Never invent facts. If unsure, leave the field empty.
```

## Deliverables
- `workspace/personas/*.md` — one file per known person
- `workspace/personas/edges.jsonl` — relationships
- A query CLI/agent the user can talk to

## Open questions
- Local-only vs cloud? Andrew's example was local. Recommend local-first.
- Which embedding model? (cost vs quality vs on-device)
- How to handle PII / shared mailboxes?
- Do we also ingest sent items separately to weight reciprocity?
