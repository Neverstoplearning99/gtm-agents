import { AGENT_IDS, type AgentId, type AgentManifest } from "./types";

export const AGENTS: readonly AgentManifest[] = [
  {
    id: "lead-researcher",
    name: "Lead Researcher",
    tagline: "Account brief + ICP fit before you reach out",
    description:
      "Researches a target company against your offer: what they do, size, recent signals, an ICP fit score, who to contact, and the angle most likely to land.",
    deliverable: "One-screen account brief with fit score and opening line",
    usesWebSearch: true,
    fields: [
      {
        key: "company",
        label: "Target company",
        type: "text",
        placeholder: "e.g. Ramp",
        required: true,
        maxLength: 120,
      },
      {
        key: "website",
        label: "Company website",
        type: "text",
        placeholder: "e.g. ramp.com (helps disambiguate)",
        required: false,
        maxLength: 200,
      },
      {
        key: "offer",
        label: "Your offer",
        type: "textarea",
        placeholder:
          "What you sell, who it's for, and the outcome. e.g. AI SDR that books meetings for Series A-C fintechs selling to finance teams",
        required: true,
        maxLength: 1200,
      },
    ],
    examples: [
      {
        label: "Fintech target for an AI SDR",
        input: {
          company: "Ramp",
          website: "ramp.com",
          offer:
            "AI SDR platform that researches accounts and books qualified meetings for B2B sales teams of 10-200 reps.",
        },
      },
      {
        label: "Dev-tools target for observability",
        input: {
          company: "Vercel",
          website: "vercel.com",
          offer:
            "Cost-aware observability for serverless workloads: cuts log and tracing spend 40% without losing coverage.",
        },
      },
    ],
  },
  {
    id: "outbound-writer",
    name: "Outbound Writer",
    tagline: "Three cold emails that don't read like cold emails",
    description:
      "Drafts gentle, direct, and contrarian cold email variants with subject lines, a value-adding follow-up, and a plan for testing them.",
    deliverable: "3 send-ready variants + follow-up + testing plan",
    usesWebSearch: false,
    fields: [
      {
        key: "persona",
        label: "Target persona",
        type: "text",
        placeholder: "e.g. VP of Sales at a 50-300 person B2B SaaS company",
        required: true,
        maxLength: 200,
      },
      {
        key: "valueProp",
        label: "Value proposition",
        type: "textarea",
        placeholder:
          "The problem you solve and the outcome. e.g. We cut new-rep ramp time from 6 months to 10 weeks with AI call coaching.",
        required: true,
        maxLength: 1200,
      },
      {
        key: "proof",
        label: "Proof point",
        type: "text",
        placeholder: "Optional: customer, metric, or credential you can cite",
        required: false,
        maxLength: 300,
      },
    ],
    examples: [
      {
        label: "Sales coaching to VP Sales",
        input: {
          persona: "VP of Sales at a 50-300 person B2B SaaS company",
          valueProp:
            "AI call coaching that cuts new-rep ramp time from 6 months to 10 weeks by scoring every call against your top performers.",
          proof: "Used by 40 sales teams; Deel's mid-market team ramped 38% faster",
        },
      },
      {
        label: "Security tool to Heads of Eng",
        input: {
          persona: "Head of Engineering at a Series B startup preparing for SOC 2",
          valueProp:
            "Automates SOC 2 evidence collection from GitHub, AWS, and Okta so engineers stop losing two sprints a year to audits.",
          proof: "",
        },
      },
    ],
  },
  {
    id: "content-strategist",
    name: "Content Strategist",
    tagline: "A week of LinkedIn + X posts, written and ready",
    description:
      "Builds a 7-day posting plan with a full LinkedIn post, an X post, and a short-form video hook for each day, sequenced toward your goal.",
    deliverable: "7 days × (LinkedIn post, X post, video hook)",
    usesWebSearch: false,
    fields: [
      {
        key: "topic",
        label: "Topic",
        type: "text",
        placeholder: "e.g. Why most B2B startups should kill their free trial",
        required: true,
        maxLength: 200,
      },
      {
        key: "audience",
        label: "Audience",
        type: "text",
        placeholder: "e.g. Seed to Series A SaaS founders",
        required: true,
        maxLength: 200,
      },
      {
        key: "goal",
        label: "Goal",
        type: "select",
        placeholder: "Pick a goal",
        required: false,
        maxLength: 60,
        options: ["Inbound leads", "Category awareness", "Hiring", "Fundraising", "Community"],
      },
      {
        key: "voice",
        label: "Voice",
        type: "select",
        placeholder: "Pick a voice",
        required: false,
        maxLength: 60,
        options: ["Operator", "Contrarian", "Educator", "Storyteller", "Analyst"],
      },
    ],
    examples: [
      {
        label: "PLG pricing for founders",
        input: {
          topic: "Why most B2B startups should kill their free trial",
          audience: "Seed to Series A SaaS founders",
          goal: "Inbound leads",
          voice: "Contrarian",
        },
      },
      {
        label: "AI agents for RevOps",
        input: {
          topic: "What AI agents actually change in a RevOps team's week",
          audience: "RevOps and Sales Ops leaders at mid-market SaaS",
          goal: "Category awareness",
          voice: "Operator",
        },
      },
    ],
  },
  {
    id: "competitor-watcher",
    name: "Competitor Watcher",
    tagline: "Positioning, claims, and where they're beatable",
    description:
      "Breaks down a competitor's positioning and claimed differentiators, reality-checks them, and finds three weak points an upstart can attack.",
    deliverable: "Attack brief: positioning, claims, 3 weak points, attack lines",
    usesWebSearch: true,
    fields: [
      {
        key: "competitor",
        label: "Competitor name or URL",
        type: "text",
        placeholder: "e.g. gong.io",
        required: true,
        maxLength: 200,
      },
      {
        key: "yourProduct",
        label: "Your product",
        type: "textarea",
        placeholder: "Optional: what you sell and to whom. Sharpens the attack angles.",
        required: false,
        maxLength: 1000,
      },
    ],
    examples: [
      {
        label: "Upstart vs Gong",
        input: {
          competitor: "gong.io",
          yourProduct: "Lightweight AI call coaching for sales teams under 30 reps, priced per team not per seat.",
        },
      },
      {
        label: "Upstart vs HubSpot",
        input: {
          competitor: "HubSpot",
          yourProduct: "",
        },
      },
    ],
  },
  {
    id: "growth-experiment-designer",
    name: "Growth Experiment Designer",
    tagline: "Three experiments to move one metric",
    description:
      "Diagnoses the likely constraint on your metric and designs three experiments with hypothesis, setup, success criteria, guardrails, and effort.",
    deliverable: "Diagnosis + 3 experiments + ICE prioritization",
    usesWebSearch: false,
    fields: [
      {
        key: "metric",
        label: "Metric to improve",
        type: "select",
        placeholder: "Pick a metric",
        required: true,
        maxLength: 40,
        options: ["Activation", "Conversion", "Retention", "Referral", "Expansion"],
      },
      {
        key: "product",
        label: "Product and users",
        type: "textarea",
        placeholder:
          "What it is, who uses it, how they sign up and pay. e.g. Self-serve invoicing app for freelancers, free plan + $15/mo Pro",
        required: true,
        maxLength: 1200,
      },
      {
        key: "baseline",
        label: "Current baseline",
        type: "text",
        placeholder: "Optional: e.g. 22% of signups send an invoice in week 1; ~1,200 signups/mo",
        required: false,
        maxLength: 300,
      },
      {
        key: "constraints",
        label: "Constraints",
        type: "text",
        placeholder: "Optional: e.g. 2 engineers, no designer, can't change pricing this quarter",
        required: false,
        maxLength: 300,
      },
    ],
    examples: [
      {
        label: "Freelancer app activation",
        input: {
          metric: "Activation",
          product: "Self-serve invoicing app for freelancers. Free plan, $15/mo Pro. Signup via Google.",
          baseline: "22% of signups send an invoice in week 1; ~1,200 signups/mo",
          constraints: "2 engineers, no designer",
        },
      },
      {
        label: "B2B SaaS expansion",
        input: {
          metric: "Expansion",
          product: "Team analytics dashboard for engineering managers, seat-based pricing at $20/seat/mo, sold self-serve and via sales above 50 seats.",
          baseline: "Net revenue retention 104%",
          constraints: "",
        },
      },
    ],
  },
];

const AGENTS_BY_ID = new Map<AgentId, AgentManifest>(AGENTS.map((agent) => [agent.id, agent]));

export function isAgentId(value: string): value is AgentId {
  return (AGENT_IDS as readonly string[]).includes(value);
}

export function getAgentManifest(id: AgentId): AgentManifest {
  const agent = AGENTS_BY_ID.get(id);
  if (!agent) {
    throw new Error(`Agent "${id}" is listed in AGENT_IDS but missing from AGENTS in core/manifest.ts`);
  }
  return agent;
}
