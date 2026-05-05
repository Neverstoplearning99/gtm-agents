# 11 — Default-to-Eight Agent Team Pattern

## Goal
For any non-trivial answer, default to running a team of eight specialist
sub-agents in parallel and synthesizing their output, rather than relying on
a single pass from one model.

> "Always use a team of agents of eight sub-agents — and I find the answers
> are just incredible."

This pattern shows up in the doctor agent's "Max Intelligence" mode (guide 08)
but Andrew applies it as a default for any high-stakes question.

## When to use it
- Strategic decisions
- Diagnostic questions (medical, financial, legal)
- Research summaries where coverage matters more than speed
- Anything the user explicitly tags `--max`

## When NOT to use it
- Quick edits, simple chores, conversational replies
- Cost-sensitive contexts (8x extended-thinking calls is expensive)

## Pattern
1. **Frame the question** clearly (often via guide 10's interview).
2. **Pick eight roles** appropriate to the domain. Examples:
   - Strategy: founder, investor, CFO, COO, customer advocate, competitor, regulator, contrarian
   - Medical: see guide 08
   - Real estate: appraiser, broker, contractor, lender, lawyer, neighbor, tax accountant, contrarian
3. **Run them in parallel**, each with extended thinking, each given:
   - The question
   - Just the slice of context relevant to their role
   - Explicit instructions: state your view, list unknowns, flag risks
4. **Synthesize** with a 9th agent that:
   - Highlights agreement and disagreement explicitly
   - Does NOT smooth over conflicts
   - Returns a recommendation + confidence + the disagreements that should make the user pause

## Why it works
- Diverse personas surface considerations a single pass misses
- Parallel execution keeps wall-clock time roughly equal to one call
- Forcing the synthesizer to preserve disagreement prevents "consensus laundering"

## Reusable orchestrator prompt (sketch)
```
You are running an 8-agent panel on this question: {question}

For each role in {roles}:
- Spawn one sub-agent with extended thinking enabled.
- Give it ONLY the context slice relevant to its role.
- Require it to output:
    {
      "view": "...",
      "key_assumptions": [...],
      "biggest_risk": "...",
      "what_id_want_to_know": [...]
    }

Run all 8 in parallel. Then synthesize:
- One paragraph of where they AGREE.
- One paragraph of where they DISAGREE — name the panelists by role.
- A final recommendation with a confidence label (low / medium / high).
- A short list of 2-3 things the user should verify before acting.
```

## Deliverables
- Reusable skill / command: `/panel <question>` that picks roles by domain and runs the orchestrator
- Domain → role-set library (one file per domain in `templates/panels/`)

## Open questions
- Cost cap — recommend a hard ceiling per panel run, surfaced before launch ("This will cost approximately $X. Run?")
- How to pick the 8 roles automatically — small classifier or pre-defined sets per domain
- Default thinking budget per panelist
- Do we want a "panel of two" budget mode for medium-stakes questions?
