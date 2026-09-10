# Labels

This repo uses a **rich label taxonomy** to make issues searchable, sortable, and visible as a roadmap.

## Quick reference

Every issue should have **at minimum**:

- One \`area:*\` label (subsystem)
- One \`track:*\` label (strategic workstream)
- One \`priority:*\` label
- One \`effort:*\` label
- One or more \`tech:*\` labels (if specific tech)
- Optional: \`highlight:*\`, \`epic:*\`, \`cert:*\`, \`interview:*\`, \`status:*\`

---

## `area:*` — Subsystem (7)

| Label | Use for |
|-------|---------|
| \`area: frontend\` | UI / components / styling / animation |
| \`area: backend\` | API routes / server logic / integrations |
| \`area: platform\` | Platform engineering, IDP, k8s, GitOps, IaC |
| \`area: ai\` | AI agents, LLMs, RAG, MCP, agentic workflows |
| \`area: devops\` | CI/CD pipelines, observability, SRE |
| \`area: docs\` | Documentation, guides, references |
| \`area: content\` | Blog posts, notes, knowledge base |

## `track:*` — Strategic workstream (5)

| Label | Meaning |
|-------|---------|
| \`track: portfolio\` | Portfolio site itself |
| \`track: fde-readiness\` | Items explicitly tagged for FDE interview prep |
| \`track: platform\` | Platform engineering broadly |
| \`track: ai-agent\` | AI/agent engineering (MCP, RAG, agents, evals) |
| \`track: knowledge-sharing\` | Blog posts, talks, interview prep |

## `priority:*` — Urgency (4)

| Label | When |
|-------|------|
| \`priority: p0\` | Critical, blocking, do now |
| \`priority: p1\` | High, this sprint / month |
| \`priority: p2\` | Medium, this quarter |
| \`priority: p3\` | Low / nice to have |

## `effort:*` — Estimated time (5)

| Label | Time |
|-------|------|
| \`effort: xs (< 1h)\` | Quick fix |
| \`effort: s (1-3h)\` | Small |
| \`effort: m (3-8h)\` | Medium |
| \`effort: l (1-3d)\` | Large |
| \`effort: xl (> 3d)\` | Multi-day initiative |

## `tech:*` — Specific technology (15)

\`kubernetes\`, \`terraform\`, \`argocd\`, \`aws\`, \`gcp\`, \`go\`, \`typescript\`, \`python\`, \`observability\`, \`llm\`, \`mcp\`, \`vector-db\`, \`workflow\`, \`edge\`

## `highlight:*` — What makes this noteworthy (8)

\`architecture\`, \`tradeoffs\`, \`metrics\`, \`a11y\`, \`perf\`, \`sec\`, \`ai-native\`, \`agentic\`

Use these on items that **demonstrate senior / FDE-grade engineering**.

## `epic:*` — Part of a larger initiative (8)

\`portfolio-revamp\`, \`ai-portfolio-section\`, \`fde-launch\`, \`ci-cd-pipeline\`, \`observability\`, \`design-system\`, \`content-engine\`, \`case-studies\`

## `cert:*` — Certification context (6)

\`cka\`, \`ckad\`, \`aws-sap\`, \`aws-devops\`, \`terraform-associate\`, \`gcp-pca\`

## `interview:*` — Interview prep (4)

\`fde\`, \`system-design\`, \`coding\`, \`behavioral\`

## `status:*` — Workflow state (4)

\`blocked\`, \`in-progress\`, \`needs-review\`, \`needs-info\`

## Workflow labels

\`epic\`, \`good first issue\`, \`tech debt\`, \`rfc\`, \`experiment\`, \`demo\`, \`showcase\`, \`bug\`, \`documentation\`, \`duplicate\`, \`enhancement\`, \`invalid\`, \`question\`, \`wontfix\`
