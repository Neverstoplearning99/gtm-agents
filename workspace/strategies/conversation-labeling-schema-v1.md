# Conversation Labeling Schema, v1
# Applied to every Miles + Claude session across all surfaces

# LAYER 1: Hard metadata (auto-captured)
session_id: "{surface}-{YYYYMMDD}-{slug}"
date: ISO-8601
surface: [claude-code, cowork, dispatch, web, chrome, api]
machine: [macbook-pro-m5, mac-mini, iphone, web]
input_mode: [voice-wispr-flow, typed, mixed]
duration_min: number
message_count: number

# LAYER 2: Intent, primary + optional secondary
intent: [build, decide, draft, audit, learn, research, plan, brainstorm,
         vent, capture, debug, unblock, message, ship, troubleshoot]

# LAYER 3: Domain, multi-tag
domain: [gtm, sales-ops, sales-leadership, ai-agents, mcp, fundraising,
         vc-pitch, recruiting, interview-prep, resume, branding, storybrand,
         dtc, financial, philosophy, family, household, personal-growth,
         tooling, claude-ecosystem, infrastructure, vault-architecture]

# LAYER 4: Project + entity, multi-tag
project: [brainstock, burnrate, kova, jobsearch, toss, vetclaw,
          x2ai, apttus-conga, good-technology, badgeville, luma-health,
          simplelegal, orderful, asound-ai, aisle-pilot-pivoted,
          openclaw, hyperagent, paperclip, harbour]
people: [jen-lo-chan, aspen, milo, gokul-ramanathan, scott-bennett,
         nima-badiey, jason-calacanis, ...]
external_companies: [altruist-hazel, nvidia, improvado, airgarage, box, ...]

# LAYER 5: Output type, multi-tag
output_type: [skill-file, resume-bullet, resume-version, framework, deck,
              prompt, template, code, email, slack-message, text-message,
              transcript, plan, audit-log, memo, calculator, brand-script,
              mock-prompt, battle-card, taxonomy, doc-spec, vault-spec,
              decision, rant, none]

# LAYER 6: Lifecycle status
lifecycle: [exploratory, drafted, refined, shipped, productized,
            abandoned, archived, recurrent, graduated-to-skill]

# LAYER 7: Priority at time
priority: [P0, P1, P2, P3]
path: [path-a-job-by-june-1, path-b-vc, path-c-brainstock-build,
       path-d-personal, path-e-learning]

# LAYER 8: Persona Miles operated as
persona: [founder, operator, ea-user, parent, learner, builder,
          partner, evp, advisor, husband, father]

# LAYER 9: Tone signal
tone: [focused, urgent, frustrated, venting, curious, playful,
       exhausted, celebratory, course-correcting, exploratory]

# LAYER 10: Friction labels, only when present
friction: [hallucination, attribution-error, em-dash-violation,
           voice-rule-violation, sycophancy, missed-inconsistency,
           scope-bloat, file-format-error, instruction-ignored,
           repetition, over-explaining, none]

# LAYER 11: Knowledge value
knowledge_value: [net-new-framework, net-new-skill, net-new-template,
                  refinement, application, replay, fork, none]

# LAYER 12: Disposition, where the artifact landed
disposition: [saved-to-obsidian, saved-to-notion, saved-to-drive,
              sent, posted, abandoned, lost-to-history, in-context-only]

# LAYER 13: Memory-update signal
memory_update: bool
new_fact: text or null
updated_fact: text or null
contradicted_fact: text or null

# LAYER 14: Cross-conversation links
continuation_of: session_id or null
forked_from: session_id or null
referenced_by: [session_id, ...]
supersedes: session_id or null

# LAYER 15: Hard rule compliance, auto-scan
aa_isp_language_correct: bool
em_dash_clean: bool
brainstock_framework_leak: bool   # used in wrong context (recruiter outreach, etc.)
linkedin_title_correct: bool
resume_truth_clean: bool
