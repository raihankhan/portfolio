#!/bin/bash
# Seed initial discussions across categories

ANNOUNCEMENTS_ID="DIC_kwDOQg3gZ84DEXP8"
GENERAL_ID="DIC_kwDOQg3gZ84DEXP9"
IDEAS_ID="DIC_kwDOQg3gZ84DEXP_"
POLLS_ID="DIC_kwDOQg3gZ84DEXQB"
QA_ID="DIC_kwDOQg3gZ84DEXP-"
SHOW_ID="DIC_kwDOQg3gZ84DEXQA"

REPO_ID=$(gh api repos/raihankhan/portfolio --jq .node_id)

# Helper: create a discussion
create_discussion() {
  local category_id="$1"
  local title="$2"
  local body="$3"
  gh api graphql -f query='
  mutation($repo: ID!, $cat: ID!, $title: String!, $body: String!) {
    createDiscussion(input: {repositoryId: $repo, categoryId: $cat, title: $title, body: $body}) {
      discussion { id number title url }
    }
  }' -f repo="$REPO_ID" -f cat="$category_id" -f title="$title" -f body="$body" --jq '.data.createDiscussion.discussion | "\(.number) \(.title)"' 2>/dev/null
}

# 1. Welcome announcement
create_discussion "$ANNOUNCEMENTS_ID" "👋 Welcome to the portfolio repo" "## Welcome

This is the GitHub home for **Raihan Khan's portfolio** — a working example of senior platform engineering and the trajectory toward a Forward Deployed Engineer role.

### What you'll find here
- 📂 Source for the portfolio site (Next.js 16, TypeScript, Tailwind v4)
- 🛠️ Real platform engineering work (CI/CD, observability, security, IaC) shipped in public
- 🤖 AI/agent engineering work (MCP server, RAG, eval harness)
- 🗺️ A **public roadmap** via the [Platform & FDE Roadmap project](https://github.com/users/raihankhan/projects/1) — every issue tagged, scoped, and tracked across milestones
- 💡 Architectural decisions documented as ADRs

### How to engage
- 🐛 Found a bug? Open an [issue](../../issues/new/choose)
- 💭 Want to discuss an idea? Use the **RFCs & Ideas** discussion
- � Need help understanding something? Use **Q&A**
- 🙌 Built something cool on top of this? Use **Show and tell**

Looking forward to your contributions and questions!"

# 2. Roadmap announcement
create_discussion "$ANNOUNCEMENTS_ID" "🗺️ Public roadmap is live (Platform & FDE Roadmap project)" "## Roadmap is public

I just published the full platform + FDE-readiness roadmap as a GitHub Project:

👉 **[Platform & FDE Roadmap](https://github.com/users/raihankhan/projects/1)**

### 8 milestones, mapped to the next 12 months
- **v1.0** — Foundation: Senior Platform Engineer brand
- **v1.1** — Operational Excellence: CI/CD, testing, quality gates
- **v1.2** — Observability & SRE
- **v1.3** — Design system & DX
- **v2.0** — AI portfolio: MCP, RAG, agents
- **v2.1** — Knowledge engine (blog 2.0, notes, OG)
- **v2.2** — Interactive demos (visualizer, cost calc, k8s lab)
- **v3.0** — FDE launch (case studies, talks, system design bank)

### 8 curated views
Status Board (Kanban) · Roadmap by Milestone · By Track · AI/FDE Workstream · Quick Wins · Priority Board · All Epics · Showcase/Highlights

### Why public?
A roadmap is a platform engineering artifact. Sharing it signals focus, intent, and rigor. Plus — I want to be held accountable.

Suggest scope, ask questions, or vote on direction in **Polls**."

# 3. How I run this portfolio (Q&A)
create_discussion "$QA_ID" "❓ How I run this portfolio (architecture, infra, costs)" "**Pinned Q&A** — start here

## Stack
- **Site:** Next.js 16, App Router, TypeScript, Tailwind v4
- **Hosting:** Vercel (preview deploys on every PR, production on master)
- **Domain:** (TBD — see issue #44)
- **Edge functions:** Cloudflare Workers (MCP server, OG image gen, search)
- **Observability:** (planned) OpenTelemetry → self-hostable backend
- **CI:** GitHub Actions (lint, typecheck, test, build, lighthouse, security)
- **Content:** MDX in \`/content\`, validated frontmatter, RSS, sitemap

## Why these choices?
- **Next.js 16 App Router** for SSR + RSC + native streaming
- **Vercel** for zero-config preview deploys — the most senior-engineer-y choice
- **Cloudflare Workers** for AI-adjacent stuff (MCP, RAG) — they're the cheapest, fastest edge for stateless AI plumbing
- **MDX** so content can embed React components (architecture diagrams, demos)

## Cost
Free tier for now. Once MCP/RAG are live, expected cost: <\$10/mo total.

## Open questions?
Ask below."

# 4. RFC: MCP server tools (Ideas)
create_discussion "$IDEAS_ID" "🧩 RFC: Which tools should the portfolio MCP server expose?" "## Context
I'm building a **portfolio MCP server** ([issue #8](../../issues/8)) so any AI assistant can query my work. I want community input on the tool surface.

## Proposed tools (so far)
- \`search_portfolio(query, type?)\` — hybrid search across projects/blog/notes
- \`get_project_metrics(id)\` — quantifiable outcomes
- \`get_relevant_content_for_topic(topic)\` — RAG over all artifacts
- \`compare_projects(ids[])\` — side-by-side comparison

## Open questions
1. Should it expose **resources** (read-only state) or focus on **tools** (action)?
2. Should it support **prompts** (templated interactions like \"prep me for an FDE interview using Raihan's work\")?
3. Auth: API key only, or OAuth for personal context?
4. Should it support **sampling** (have the LLM generate answers in stages)?

## My current thinking
- Expose both resources AND tools
- Include prompts — they're underrated and very FDE-flavored
- API key only initially; OAuth later
- Skip sampling initially — keeps the scope manageable

**What would you add? What would you cut? Reply below.**"

# 5. Poll: next blog topic
create_discussion "$POLLS_ID" "🗳️ Which topic should I write the next deep blog post on?" "Help me pick the next long-form technical post. The list is from [issue #24](../../issues/24) and similar.

(Will add poll options in a follow-up comment — voting via 👍 reactions on each option)"

# 6. Show and tell
create_discussion "$SHOW_ID" "🌟 What cool platform/agent projects have you built?" "## Let's see your work!

This is the place to share platform engineering, MCP server, AI agent, or Kubernetes operator projects you've built. I'll check them out and respond.

To kick things off — drop a link to:
- The repo
- A short description (1-2 sentences)
- What you learned / what surprised you

I'll pin the most interesting ones."

echo ""
echo "Discussions seeded. Run gh discussion list --repo raihankhan/portfolio to verify."
