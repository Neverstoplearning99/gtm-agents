# 10 — Self-Interviewing Prompt Pattern

## Goal
Stop forcing the user to write good prompts. Instead, the agent **interviews
the user** with multiple-choice questions to extract the requirements, then
writes its own perfect prompt and answers.

> "Ask me a shitload of questions to determine your prompt and use the
> question tool. It'll pull up multiple-choice questions, and it'll
> interview me for sometimes five or ten minutes… nobody needs to build the
> prompts. The AI should just interview you."

## When to use it
- High-stakes one-shot tasks (real estate decision, medical question, big email)
- Anything where the cost of a wrong answer >> the cost of 5 minutes of questions
- Whenever the user opens with a vague goal

## When NOT to use it
- Quick chores, conversational replies — the questioning ceremony is annoying for low-stakes tasks
- Ongoing tasks where requirements are already known from prior context

## Pattern
1. User states a goal: *"I'm thinking about buying this building."*
2. Agent enters **interview mode**:
   - Asks 1-3 multiple-choice questions per turn (use `AskUserQuestion`-style tool)
   - Mixes broad ("What's your primary goal — cashflow, appreciation, owner-occupy?") with narrow ("Cap rate cutoff?")
   - Stops only when it has enough information to write a prompt that would not produce a wrong answer
3. Agent **writes its own prompt** in plain text and shows it to the user for sign-off.
4. Agent executes that prompt — ideally with the agent-team-of-eight pattern (guide 11) for hard cases.

## Reusable system prompt (drop-in)
```
You are operating in INTERVIEW-FIRST mode.

Step 1 — INTERVIEW
- Before doing the work, interview the user with multiple-choice questions
  using the question tool.
- Each question must offer 2-5 concrete options PLUS an "other / freeform" option.
- Cover at least: goal, constraints, success criteria, time horizon, risk
  tolerance, who else is affected, and any non-negotiables.
- Keep going until you can write a prompt for yourself that you are >90%
  confident will not produce a wrong answer.
- Hard cap: 15 questions. If still unclear, ask the user to confirm proceeding
  with assumptions.

Step 2 — DRAFT PROMPT
- Write the prompt you would give yourself, in plain text.
- Show it to the user. Ask: "Run this, edit it, or keep interviewing?"

Step 3 — EXECUTE
- Run the agreed prompt.
- For high-stakes tasks (money > $X, health, legal), execute it with a team
  of 8 sub-agents (see guide 11).
```

## Deliverables
- A reusable system prompt snippet, stored at `templates/interview-first-prompt.md`
- A small wrapper command/skill — e.g. `/interview <goal>` — that auto-loads the snippet

## Open questions
- Where to integrate this — global Claude Code system prompt? Per-task slash command? Both?
- Default cap on number of questions (currently 15)
- Should the agent also save interview Q&A as a "decision log" for future reference?
