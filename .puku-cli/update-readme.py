#!/usr/bin/env python3
"""Update project README."""
import subprocess

readme = '''## Platform & FDE Roadmap

Single source of truth for Raihan\'s portfolio + FDE-readiness work.

### How this is organized

**Custom fields on every item:**
- **Status** (Todo / In Progress / Done) — workflow state
- **Priority** (P0–P3) — urgency
- **Effort** (XS–XL) — estimated time
- **Track** — strategic workstream (Portfolio / FDE-Readiness / AI Agent / Platform / Knowledge Sharing)

**Plus built-in:** Milestone, Assignees, Labels, Updated date.

### Views (8)

| View | What it shows |
|------|---------------|
| **Status Board (Kanban)** | All open items grouped by Status |
| **Roadmap by Milestone** | Timeline across 8 milestones |
| **By Track (Grouped)** | Table grouped by Track |
| **AI / FDE Workstream** | Filtered to AI + FDE work |
| **Quick Wins** | Effort XS or S items |
| **Priority Board** | P0 + P1 items |
| **All Epics** | Items tagged epic:* |
| **Showcase / Highlights** | Items with highlight/demo/showcase labels |

### Tracks

- **Portfolio** — The portfolio site itself (this repo)
- **FDE-Readiness** — Items explicitly demonstrating FDE capability
- **AI Agent** — AI/agent engineering (MCP, RAG, agents, evals)
- **Platform** — Platform engineering broadly
- **Knowledge Sharing** — Blog, talks, interview prep

### Milestones (8, mapped to the next 12 months)

1. **v1.0** — Foundation: Senior Platform Engineer Brand (Sept 2026)
2. **v1.1** — Operational Excellence: CI/CD, Testing, Quality Gates (Oct 2026)
3. **v1.2** — Observability & SRE: SLOs, RUM, Error Tracking (Nov 2026)
4. **v1.3** — Design System & DX: Tokens, Theming, Components (Dec 2026)
5. **v2.0** — AI Portfolio: Showcase AI / Agentic Engineering (Feb 2027)
6. **v2.1** — Knowledge Engine: Blog 2.0, Notes, OG (Mar 2027)
7. **v2.2** — Interactive Demos: Visualizer, Calculator, K8s Lab (May 2027)
8. **v3.0** — FDE Launch: Storytelling, Case Studies, Talk Bank (Aug 2027)
'''

# Write readme to a temp file and pass via -F
with open("/tmp/readme.md", "w") as f:
    f.write(readme)

q = '''
mutation($readme: String!) {
  updateProjectV2(
    input: {
      projectId: "PVT_kwHOAYGZZc4BhuAE"
      readme: $readme
    }
  ) {
    projectV2 { id }
  }
}
'''

with open("/tmp/readme.md") as f:
    readme_text = f.read()

result = subprocess.run(
    ["gh", "api", "graphql",
     "-f", f"query={q}",
     "-F", f"readme={readme_text}"],
    capture_output=True, text=True
)
print("STDOUT:", result.stdout[:500])
print("STDERR:", result.stderr[:500])
