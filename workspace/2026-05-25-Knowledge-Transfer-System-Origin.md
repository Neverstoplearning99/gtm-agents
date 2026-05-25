# Knowledge Transfer System - Origin Record

Tags: #knowledge-transfer #claude-code #obsidian #setup #origin
Date: 2026-05-25
Source: Claude Code session
Back to this conversation: https://claude.ai/code/session_019wTrPhHD3DTeK1EnNcPyNx

Related: [[START HERE - How Obsidian Works]]

---

## The Visual

![[kt_diagram.png]]

If the image does not show, drop `kt_diagram.png` anywhere in the vault. Obsidian finds it.

---

## Objective

Sync context across Claude Chat, Claude Code, and Cowork so no thread of work gets lost when moving between them. Later expanded to include OpenAI Codex as the other half of one shared brain.

The fix: a standard handoff template plus an Obsidian vault ("Brain") that every tool reads from and writes to.

---

## Origin and Evolution

How it started:
Miles asked for help setting up a "Knowledge Transfer" project across three Claudes (Chat, Code, Cowork), each holding the same handoff template plus active context.

How it evolved:
1. Reviewed the handoff template. Suggested splitting static identity from dynamic context, adding a LAST UPDATED line.
2. Built per-system setup: project names, descriptions, custom instructions for each.
3. Expanded the template to include Origin/Evolution, Risks, and an agent-executable Plan of Action. Assume an agent runs the plan, not Miles.
4. Clarified that the three Claudes do NOT share one instruction layer. Each has its own. The vault is the bridge.
5. Designed a #obsidian hashtag trigger and a real Claude Code slash command (/obsidian).
6. Created the Obsidian "Brain" vault structure (vault did not exist yet, brand new Mac).
7. Reframed Codex: not a separate brain. One vault, both vendors read/write. Do not split by vendor.
8. Wrote a plain-English Obsidian guide because the vault looked empty and confusing.
9. This note: capturing the whole arc as the first real vault entry.

---

## Key Decisions

- Vault name: Brain. Short, voice friendly.
- Vault location: ~/Obsidian/Brain/
- Static identity (WHO I AM, HOW I WORK) lives at account/global level. Project-specific bits live per project.
- One shared vault for both Claude and Codex. No vendor split.
- Trigger phrase: "Pack handoff for [chat | code | cowork]". Hashtag: #obsidian.
- Capture first, organize later. Dump into 00-Inbox, sort weekly.

---

## Risks and Watch-Outs

- The three AI systems do not auto-sync. The vault only works if you actually run the trigger. Discipline required.
- "index" files showed up in the vault from a default/theme. They are noise. Safe to delete.
- Chat and Cowork cannot write to disk. Only Claude Code (and Codex with file access) can write the vault directly. In Chat/Cowork you copy/paste.
- Secrets and client-confidential material: keep out of the shared vault if you do not want a given vendor logging it.
- This Linux session is a sandbox, not Miles's Mac. All vault creation happens on the Mac via the commands below.

---

## Plan of Action

Assume an agent or Claude Code executes this.

1. Install Obsidian on the Mac: `brew install --cask obsidian`
2. Create vault folders:
   `mkdir -p ~/Obsidian/Brain/{00-Inbox,01-Knowledge-Transfer/Active,01-Knowledge-Transfer/Archive,02-Clients,03-BurnRate,04-Projects,05-People,06-Reference,07-Daily,_Templates,_Attachments}`
3. Open Obsidian, "Open folder as vault", select ~/Obsidian/Brain.
4. Create the slash command dir: `mkdir -p ~/.claude/commands`
5. Save the /obsidian command file (content below) to ~/.claude/commands/obsidian.md
6. Save the START HERE guide and this note into the vault.
7. Drop kt_diagram.png into the vault so the embed renders.
8. Paste the custom instructions block (below) into Claude Chat project, Cowork project, and ~/Obsidian/Brain CLAUDE.md (or Code global).

Done when: vault opens, /obsidian writes a note, and the trigger phrase works in any tool.

---

## Open Questions

- Confirm the exact Obsidian vault path on the Mac if not ~/Obsidian/Brain.
- Decide whether daily notes (07-Daily) get used or dropped.
- Decide which folders, if any, stay out of Codex's reach for confidentiality.

---

## Artifact 1: The Handoff Template

```
CONTEXT HANDOFF
LAST UPDATED: [date] [from system]
TARGET SYSTEM: [chat | code | cowork]

ORIGIN AND EVOLUTION
How this started. The first ask or trigger.
How the idea shifted. Key turns in the thinking.
Where it landed before this handoff.

WORKING ON
[1-2 sentences. Current scope.]

CONTEXT YOU'RE MISSING
Decisions made. Files created or touched. Current state.
Anything discussed in another system that matters here.

RISKS AND WATCH-OUTS
What could break. What is fragile. What is assumed but unverified.
Dependencies. Stale data. Anything I flagged as a concern.

PLAN OF ACTION
Assume an agent executes this, not me.
1. [Concrete step. Tool or file named.]
2. [Concrete step.]
3. [Concrete step.]
Stop conditions. What "done" looks like.

OPEN QUESTIONS
[Anything blocking autonomous execution.]
```

---

## Artifact 2: Custom Instructions Block (paste into all three)

```
IDENTITY
Miles Prowse. Partner at BrainStock (AI-native GTM consulting). EVP Sales/Revenue at BurnRate. 15+ years B2B SaaS revenue leadership. Five acquisition exits. Two-time AA-ISP Top 25.
Dyslexic with ADD. Voice-to-text input. Prefer short sentences, scannable output, audio-friendly responses.

HOW I WORK
No em dashes. Use commas, periods, colons, semicolons.
Execute and deliver. Output first. No frameworks or scaffolding unless I ask.
Reusable assets in one single code box. Never split a deliverable.
Time-budgeted requests get minimum viable output. One optional upgrade line at the end.
On voice input, reflect back what I am asking before building. Emoji feedback: smiley yes, thinking close, middle finger no.
Personas not real names in reusable assets. Format: "[Title] at [Company Type]."
Confirm contacts are still active before naming them.

PROJECT PURPOSE
This project is the Knowledge Transfer layer between Claude chat, Claude Code, and Cowork. It carries rolling context so any system can pick up where another left off.

HANDOFF TEMPLATE
[use the template above]

TRIGGER BEHAVIOR
When I say "Pack handoff for [chat | code | cowork]":
1. Fill every section from our current session.
2. Write ORIGIN AND EVOLUTION from the full arc, not just the last message.
3. Be explicit in PLAN OF ACTION. Name files, tools, commands. An agent should execute without asking me.
4. Surface RISKS even if I did not raise them.
5. Output the entire handoff in one code box. Do not split.
6. No preamble. No closing remarks. Just the filled template.
```

---

## Artifact 3: The /obsidian Slash Command

Save to ~/.claude/commands/obsidian.md

```markdown
---
description: Save current conversation to Obsidian Brain vault as a knowledge note
---

Take everything we have discussed in this session and write it as an Obsidian note.

Vault path: ~/Obsidian/Brain/01-Knowledge-Transfer/Active/

Filename format: YYYY-MM-DD-[short-topic-slug].md

Note structure:

# [Topic Title]

Tags: #knowledge-transfer #claude-code #[auto-detected-topic]
Date: YYYY-MM-DD
Source: Claude Code session

## Origin and Evolution
## Key Decisions
## Risks and Watch-Outs
## Plan of Action
## Open Questions
## Raw Context

After writing the file:
1. Print the full file path
2. Move any handoff older than 30 days from Active/ to Archive/
3. Confirm done in one line
```

---

## Artifact 4: Vault Structure

```
~/Obsidian/Brain/
├── 00-Inbox/                  dump zone, sort later
├── 01-Knowledge-Transfer/     cross-system handoffs
│   ├── Active/
│   └── Archive/
├── 02-Clients/                BrainStock client work
├── 03-BurnRate/               EVP role notes
├── 04-Projects/               active initiatives
├── 05-People/                 contacts, personas
├── 06-Reference/              frameworks, playbooks
├── 07-Daily/                  daily notes
├── _Templates/                note shells
└── _Attachments/              images, PDFs, voice memos
```

---

## How Claude and Codex Share This

The vault is one brain. Not an Anthropic half and an OpenAI half.

```
        ONE BRAIN = the vault
          /              \
   Anthropic side     OpenAI side
   (Code, Chat,       (Codex,
    Cowork)            ChatGPT)
```

Both read from it. Both write to it. The handoff template and #obsidian trigger work the same for Codex. Only wall off secrets or client-confidential material.
