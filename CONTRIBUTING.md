# Contributing

> **TL;DR** — Read this once. Then read [\`/docs\`](./docs) (under construction) for the deeper guide.

Welcome to **Raihan Khan's portfolio repo** — an open, working example of senior platform engineering on the path to a Forward Deployed Engineer (FDE) role.

This document covers **everything you need to contribute**: setup, workflows, conventions, content, releases, and how to get help.

---

## Table of Contents

1. [Code of conduct](#code-of-conduct)
2. [What is this project?](#what-is-this-project)
3. [Architecture at a glance](#architecture-at-a-glance)
4. [Getting started](#getting-started)
5. [Project layout](#project-layout)
6. [How we work](#how-we-work)
   - [Issues & labels](#issues--labels)
   - [Branching & commits](#branching--commits)
   - [Pull requests](#pull-requests)
   - [Reviews & merge](#reviews--merge)
7. [Adding content](#adding-content)
   - [Projects](#projects)
   - [Blog posts](#blog-posts)
   - [Notes](#notes)
   - [Experience](#experience)
8. [Styling](#styling)
9. [Testing & quality](#testing--quality)
10. [Releases](#releases)
11. [Security](#security)
12. [Getting help](#getting-help)

---

## Code of conduct

Be respectful. Be curious. Disagree on substance, not on people. Assume good faith.

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/) (lightly adapted).

---

## What is this project?

This repo contains the **source of the portfolio site at <https://raihankhan.dev>** plus all the working infrastructure I treat it as:

- Production-grade **CI/CD pipeline** (lint, typecheck, tests, build, security, Lighthouse)
- **Observability** (OpenTelemetry, error tracking, synthetic uptime, SLOs)
- A planned **MCP server** exposing the portfolio to any AI assistant
- A **content engine** that publishes blog/notes/ADRs with OG images and RSS

The portfolio is also a **public reference implementation** of how I'd build an Internal Developer Platform: paved road, golden paths, telemetry everywhere.

---

## Architecture at a glance

```
                ┌─────────────────────────────────────────────────┐
                │              Next.js 16 App Router              │
                │         (Vercel — preview + production)         │
                └────────┬──────────────────────────────┬─────────┘
                         │                              │
                RSC + streaming              Edge functions (Vercel)
                         │                              │
                         │              ┌───────────────┴──────────────┐
                         │              │    /api/og  /api/search     │
                         │              │    Cloudflare Workers       │
                         │              │    (MCP server, RAG, ...   │
                         │              └────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │  Content: MDX in /content        │
        │  Schema-validated frontmatter    │
        │  Git-as-CMS                      │
        └───────────────────────────────────┘
```

See issue #51 ("How this site is built") for the full architecture write-up.

---

## Getting started

### Prerequisites

- **Node.js 20+** (use \`fnm\` or \`nvm\`)
- **pnpm 9+** (\`npm i -g pnpm\`)
- **Git** with conventional commit messages
- A POSIX shell

### Setup

```bash
git clone https://github.com/raihankhan/portfolio.git
cd portfolio
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

### Useful scripts

| Script              | What it does                                  |
| ------------------- | --------------------------------------------- |
| \`pnpm dev\`         | Start dev server                              |
| \`pnpm build\`       | Production build                              |
| \`pnpm start\`       | Start production server                       |
| \`pnpm lint\`        | ESLint                                        |
| \`pnpm typecheck\`   | \`tsc --noEmit\`                               |
| \`pnpm test\`        | Unit tests (Vitest)                           |
| \`pnpm test:e2e\`    | Playwright e2e tests                          |
| \`pnpm format\`      | Prettier                                      |
| \`pnpm analyze\`     | Bundle analyzer                               |

---

## Project layout

```
portfolio/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home
│   ├── projects/          # Projects list + [id]
│   ├── blog/              # Blog list + [slug]
│   ├── notes/             # Notes list + [slug]
│   ├── experience/        # Timeline
│   ├── decisions/         # ADRs
│   ├── contact/           # Contact form
│   └── arcade/            # Kubernetes games
├── components/            # React components (UI + sections)
│   ├── ui/               # shadcn primitives
│   ├── game-console/     # Arcade launcher
│   └── ...
├── content/               # MDX content (blog, notes, ADRs)
│   ├── blog/
│   ├── notes/
│   └── decisions/
├── lib/                   # Shared utilities, schemas, data
├── hooks/                 # Custom React hooks
├── public/                # Static assets
├── styles/                # Global styles
├── infra/                 # Terraform / IaC (planned)
├── docs/                  # Repo documentation
└── tests/                 # E2E + visual regression
```

---

## How we work

### Issues & labels

Issues live in the **public roadmap** (see Project "Platform & FDE Roadmap").

Every issue carries these labels:

| Label            | Meaning                                          |
| ---------------- | ------------------------------------------------ |
| \`area:*\`        | Subsystem (frontend, backend, platform, ai, ...) |
| \`track:*\`       | Strategic workstream (portfolio, ai-agent, ...)  |
| \`priority:*\`    | p0 (critical) → p3 (nice to have)                |
| \`effort:*\`      | xs (<1h), s (1-3h), m (3-8h), l (1-3d), xl (>3d) |
| \`tech:*\`        | Specific tech involved                           |
| \`highlight:*\`   | What's notable (architecture, metrics, agentic)  |
| \`epic:*\`        | Part of a larger initiative                      |

Full label catalog: see [\`docs/labels.md\`](./docs/labels.md) (or just browse the live labels in the sidebar).

### Branching & commits

- **Branch off \`master\`**: \`git switch -c type/short-description\`
  - \`feat/\`, \`fix/\`, \`chore/\`, \`docs/\`, \`refactor/\`, \`test/\`
- **Conventional commits** (enforced by CI):
  \`feat: add MCP server skeleton\`
  \`fix(search): handle empty query gracefully\`
  \`docs: update contributing guide\`

### Pull requests

- Use the [PR template](./.github/pull_request_template.md)
- Self-review checklist at the bottom is **mandatory**
- Squash-merge with the PR title as the commit message
- One concern per PR; smaller is better

### Reviews & merge

- 1 approval required
- Stale approvals dismissed on new pushes
- Linear history only (squash or rebase)
- Conversation resolution required
- All CI checks must pass

See [branch protection rules](./.github/CODEOWNERS) for the authoritative list.

---

## Adding content

> **Before you write**, open an issue using the **Content Submission** template so the team can weigh in on the angle.

### Projects

Add to \`content/projects/\` as MDX:

\`\`\`mdx
---
id: my-project
title: "Enterprise Kubernetes Platform"
description: "Multi-tenant production platform..."
problemStatement: "..."
techStack:
  primary: [Kubernetes, Terraform, ArgoCD]
  supporting: [Helm, Prometheus]
tradeoffs:
  - decision: "GitOps over push-based CD"
    rationale: "Audit trail + drift detection..."
    alternatives: [Spinnaker, Jenkins X]
metrics:
  - label: "Deployment time"
    value: "12 min"
    improvement: "-87% from 90 min baseline"
outcomes:
  - "50+ teams onboarded with zero security incidents"
  - "99.99% platform availability"
links:
  github: https://github.com/...
image: /projects/k8s-platform.png
featured: true
---
# Long description (Markdown)
...
\`\`\`

### Blog posts

Add to \`content/blog/<slug>.mdx\` with frontmatter:

\`\`\`yaml
---
title: "..."
excerpt: "..."
publishedAt: 2026-09-15
tags: [kubernetes, terraform]
readingTime: "8 min read"
draft: false
---
\`\`\`

### Notes

Add to \`content/notes/<slug>.mdx\` with frontmatter:

\`\`\`yaml
---
title: "kubectl one-liners"
category: "Kubernetes"
updatedAt: 2026-09-15
---
\`\`\`

### Experience

Edit \`lib/data.ts\` (will migrate to MDX in a future release).

---

## Styling

- **Tailwind CSS v4** with semantic tokens defined in \`app/globals.css\`
- **5 themes** in \`lib/themes.ts\` (OKLCH palette)
- Use \`motion\` from framer-motion for animations
- Respect \`prefers-reduced-motion\`

See [\`docs/design-system.md\`](./docs/design-system.md) when it's written.

---

## Testing & quality

- **Unit**: Vitest (\`*.test.ts\` colocated)
- **Component**: React Testing Library
- **E2E**: Playwright (\`tests/e2e\`)
- **Visual regression**: Playwright + pixelmatch (\`tests/visual\`)
- **Coverage**: >= 80% in \`lib/\`, >= 60% overall
- **Lighthouse CI**: perf / a11y / SEO / best-practices budgets enforced

Test before submitting:

\`\`\`bash
pnpm test
pnpm test:e2e
pnpm typecheck
pnpm lint
\`\`\`

---

## Releases

- Conventional commits drive auto-generated changelogs
- \`release-please\` opens a release PR
- Merging the release PR creates a tag + GitHub Release
- Tags trigger a Vercel production deploy

See [\`docs/release-process.md\`](./docs/release-process.md).

---

## Security

For vulnerabilities, see [SECURITY.md](./SECURITY.md). **Do not** file public issues.

---

## Getting help

- 💬 [GitHub Discussions](https://github.com/raihankhan/portfolio/discussions) — open conversation, Q&A, RFCs
- 🐛 [Issue tracker](https://github.com/raihankhan/portfolio/issues/new/choose) — bug, feature, content
- 📧 Email — see the portfolio site for the address

Welcome aboard! 🚀
