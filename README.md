# Raihan Khan — Senior Platform Engineer → Forward Deployed Engineer

<p align="center">
  <img src="https://komarev.com/ghpvc/?username=raihankhan&label=Visitors&color=0e75b6&style=flat-square" alt="profile views" />
  <a href="https://github.com/raihankhan/portfolio">
    <img src="https://img.shields.io/github/stars/raihankhan/portfolio?style=flat-square" />
  </a>
  <a href="https://github.com/raihankhan/portfolio/issues">
    <img src="https://img.shields.io/github/issues/raihankhan/portfolio?style=flat-square" />
  </a>
  <a href="https://github.com/raihankhan/portfolio/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/raihankhan/portfolio?style=flat-square" />
  </a>
</p>

> **TL;DR** — This is **the working portfolio of a senior platform engineer** pivoting toward a Forward Deployed Engineer (FDE) role. The site is shipped as a production product — with real CI/CD, observability, an MCP server, RAG, agent evals, and a public roadmap.

👉 **Live site:** [raihankhan.dev](https://raihankhan.dev) (or GitHub Pages)
👉 **Public roadmap:** [Platform & FDE Roadmap](https://github.com/users/raihankhan/projects/1)
👉 **Hiring manager summary:** [/hiring-managers](https://raihankhan.dev/hiring-managers)

---

## 🧭 What's in this repo

| What | Where |
|------|-------|
| **Source** of the portfolio site | `/app`, `/components`, `/lib` |
| **Content** (blog, notes, ADRs) | `/content` |
| **Project** with 8 milestones | [Platform & FDE Roadmap](https://github.com/users/raihankhan/projects/1) |
| **Issues** (52 strategic items) | [Issue tracker](../../issues) |
| **Discussions** (community channel) | [Discussions](../../discussions) |
| **Docs** | [`/docs`](./docs) |
| **CI/CD** | [`/.github/workflows`](./.github/workflows) |
| **Governance** (CODEOWNERS, templates, security policy) | [`/.github`](./.github) |

---

## 🚀 Quick start

```bash
git clone https://github.com/raihankhan/portfolio.git
cd portfolio
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

---

## 🏗️ Tech stack

| Layer | Choice | Why |
|-------|--------|-----|
| **Framework** | Next.js 16 (App Router) | RSC + streaming + edge-native |
| **Language** | TypeScript 5 (strict) | Type safety = senior hygiene |
| **Styling** | Tailwind v4 + OKLCH | Semantic tokens, theme-able |
| **Components** | shadcn/ui + Radix | Accessible, composable, owned |
| **Animation** | Framer Motion | Physics-based, reduced-motion aware |
| **Charts** | Recharts | Declarative, theme-aware |
| **Hosting** | Vercel | Preview deploys on every PR |
| **Edge** | Cloudflare Workers | MCP server, RAG, OG images |
| **CI** | GitHub Actions | The bar |
| **Observability** | OpenTelemetry + Sentry (planned) | Telemetry before features |

---

## 🎯 The FDE playbook

This repo is intentionally structured to **demonstrate FDE-readiness in public**:

| FDE competency | Where it's demonstrated |
|----------------|------------------------|
| **Ship production software** | The site itself, with CI/CD, observability, SLOs |
| **AI / agent engineering** | MCP server, RAG, multi-step agent, eval harness |
| **Customer-facing work** | "Ask my portfolio" widget, "Tailor my pitch" tool |
| **Multi-tenant systems** | MCP resource/tool model, tenant isolation patterns |
| **Operational excellence** | Public roadmap, SLOs, status page, incident templates |
| **Communication** | ADRs, system design writeups, blog posts, talks |
| **Eval-driven iteration** | Public agent eval dashboard |
| **Telemetry-driven decisions** | Web Vitals, OpenTelemetry, structured logs |

---

## 🤖 AI / Agent engineering

This is the FDE pivot — and the differentiator.

- 🧩 **MCP server** (in progress) — exposes the portfolio to any AI assistant
- 🔍 **RAG pipeline** — semantic + keyword hybrid search across all content
- 🤖 **Multi-step agent** — "tailor my pitch for this JD" with eval harness
- 📊 **Public eval dashboard** — every run published, regressions surfaced
- 🛠️ **Agent observability** — Langfuse / OpenLLMetry traces
- 🧪 **Eval harness** — recall@k, MRR, latency, cost-per-query

See issues [#8](../../issues/8), [#9](../../issues/9), [#28](../../issues/28), [#39](../../issues/39), [#50](../../issues/50).

---

## 🛠️ Platform engineering showcase

| Project | Highlight |
|---------|-----------|
| Enterprise Kubernetes Platform | Multi-tenant GitOps at 50+ teams |
| Self-Service CI/CD | 90% reduction in deploy tickets |
| Multi-Cloud IaC Framework | 40% cost reduction, zero violations |
| K8s Operator in Go | Custom controllers in production |
| Unified Observability Platform | MTTR 4h → 30m |

See [issue #2](../../issues/2) for the long-form case studies.

---

## 📚 Knowledge sharing

- 📝 [Blog](./app/blog) — 10+ deep posts on platform / FDE topics
- 📓 [Notes](./app/notes) — Quick references for daily ops
- 📐 [Decisions](./app/decisions) — Architecture Decision Records
- 🎤 [Talks](#) — Conference abstracts + slide decks
- 📞 [For hiring managers](./app/hiring-managers) — One-pager

---

## 🎮 Bonus: The Kubernetes arcade

Because managing clusters is serious business, but sometimes you just need to play.

| Game | What it teaches |
|------|-----------------|
| Snake | Pod lifecycle, eviction |
| Flappy Bird | Load balancing, throughput |
| Pod Eviction Survival | Disruption budgets |
| Cluster Autoscaler Rampage | Capacity planning |
| Node Drain Rush | Graceful shutdown |
| DevOps Adventure: GitOps | End-to-end deployment |

[Try the arcade →](https://raihankhan.dev/arcade)

---

## 📁 Project structure

```
portfolio/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home / Hero
│   ├── projects/          # Project portfolio
│   ├── blog/              # Blog posts
│   ├── notes/             # Quick references
│   ├── decisions/         # ADRs
│   ├── experience/        # Timeline
│   ├── hiring-managers/   # One-pager
│   ├── contact/           # Contact form
│   └── arcade/            # 🎮 Kubernetes games
├── components/            # React components
│   ├── ui/               # shadcn primitives
│   ├── game-console/     # Arcade launcher
│   └── ...               # Section components
├── content/               # MDX content
│   ├── blog/
│   ├── notes/
│   └── decisions/
├── lib/                   # Utilities + data
├── hooks/                 # Custom React hooks
├── public/                # Static assets
├── styles/                # Global styles
├── infra/                 # Terraform / IaC
├── docs/                  # Repo documentation
├── tests/                 # E2E + visual regression
└── .github/               # CI/CD + governance
    ├── workflows/
    ├── ISSUE_TEMPLATE/
    ├── CODEOWNERS
    ├── dependabot.yml
    ├── pull_request_template.md
    └── stale.yml
```

---

## 🤝 Contributing

This repo is open to contributions — content suggestions, bug fixes, ideas.

👉 See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide.

Quick paths:
- 🐛 [Report a bug](../../issues/new?template=bug.yml)
- ✨ [Propose a feature](../../issues/new?template=feature.yml)
- 📝 [Suggest content](../../issues/new?template=content.yml)
- 💬 [Join the discussion](../../discussions)
- 🔒 [Report a security issue](./SECURITY.md)

---

## 📄 License

GNU GPL v3 — see [LICENSE](./LICENSE).

---

## 🔗 Connect

<p align="center">
  <a href="https://github.com/raihankhan"><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github" /></a>
  <a href="https://linkedin.com/in/raihankhan"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin" /></a>
  <a href="https://twitter.com/raihankhan"><img src="https://img.shields.io/badge/Twitter-1DA1F2?style=flat-square&logo=twitter" /></a>
</p>

<p align="center">
  <em>Built with ☕, too much <code>kubectl</code>, and an unreasonable amount of <code>tsc --watch</code></em>
</p>
