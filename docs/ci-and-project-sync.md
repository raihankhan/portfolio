# CI & Project Sync

This document explains how automation keeps **Issues, Pull Requests, Labels, Milestones, and the GitHub Project Board** in sync — without manual bookkeeping.

## Overview

Two workflows live under `.github/workflows/`:

1. **`project-sync.yml`** — Syncs issues ↔ PRs ↔ Project Board (Status, Track fields)
2. **`milestone-sync.yml`** — Maintains a rolling progress comment per milestone

Both are triggered by GitHub events and run via `actions/github-script@v7` with GraphQL where needed.

## project-sync.yml

Triggers: every `pull_request.*`, `pull_request_review.*`, and `issues.*` event.

### Behavior matrix

| Event | Effect |
|-------|--------|
| **PR opened** | Parses `Closes #N` in PR body → adds linked issue to project, sets Status = "In Progress", applies `status: in-progress` label on the issue |
| **PR edited / new commit pushed** | Re-parses keywords; re-syncs labels (idempotent) |
| **PR moved out of draft (`ready_for_review`)** | Re-evaluates; same as opened |
| **PR review: APPROVED** | Sets linked issues' Status = "In Review" |
| **PR review: CHANGES_REQUESTED** | (No-op — leaves at "In Progress") |
| **PR review: DISMISSED** | Re-evaluates; moves back to "In Progress" if needed |
| **PR merged (`closed: true, merged: true`)** | Auto-closes linked issues; sets Status = "Done" |
| **PR closed without merge** | Does NOT close issues; sets Status back to "Todo" |
| **Issue opened / labeled / unlabeled** | Adds issue to project if missing; syncs Status from labels |
| **Issue closed** | Sets Status = "Done" |

### Bot exclusion

PRs from these accounts are ignored to avoid feedback loops with Dependabot et al:

- `dependabot[bot]`
- `github-actions[bot]`
- `renovate[bot]`

To extend the list, edit the `BOT_LOGIN_SKIP_LIST` env var at the top of the workflow.

### Status mapping

| Source | Project Status |
|--------|----------------|
| Issue has `status: in-progress` label | `In Progress` |
| Issue has `status: needs-review` label | `In Progress` (during review) |
| Issue has `status: blocked` | `Todo` (kept visible but flagged) |
| Issue is `closed` | `Done` |
| Otherwise | `Todo` |

### Field auto-population

When an issue is added to the project, the **Track** field is auto-derived from labels:

- `track: portfolio` → `Track = Portfolio`
- `track: platform` → `Track = Platform`
- `track: ai-agent` → `Track = AI Agent`
- `track: knowledge-sharing` → `Track = Knowledge Sharing`
- `track: fde-readiness` → `Track = FDE-Readiness`

If the Track is already set, it's left alone (no overwrites on subsequent syncs).

**Priority** and **Effort** are intentionally **not** auto-set — those are populated by manual triage when filing issues (or by the agent loop for issue #N see [AGENT_LOOP.md](../AGENT_LOOP.md)).

### Required Permissions

The workflow declares:

```yaml
permissions:
  contents: read
  issues: write
  pull-requests: write
```

For **Project (v2)** operations via GraphQL, the workflow also implicitly needs the `projects: write` scope. In repository settings:

1. **Settings** → **Actions** → **General** → **Workflow permissions**
2. Enable **"Allow GitHub Actions to create and approve pull requests"** (if you want the agent loop to open PRs)
3. The Projects API may need to be enabled per repo: **Settings** → **Projects** → enable

If the project sync step fails with `403 Forbidden`, that's the cause — fix it in repo settings.

## milestone-sync.yml

Triggers: `issues.*`, `pull_request.{closed,reopened}`, `workflow_dispatch`.

### Behavior

For every milestone event:

1. Reads the milestone metadata (title, due date, open/closed counts)
2. Recomputes progress: `% = closed_issues / total_issues`
3. Generates a markdown progress bar and summary
4. Posts/updates a single rolling **"tracker issue"** per milestone titled:

   ```
   progress-tracker/<milestone-number>
   ```
   Labeled with `milestone-tracker`.

5. Auto-closes the tracker issue when the milestone hits 100%.
6. Warns if the due date is in the past and progress < 100% (`⚠️ OVERDUE`).
7. Warns if due within 14 days and progress < 100% (`⏰ due in N days`).

### Example output

```markdown
## 📊 Milestone Progress

**Milestone:** `v2.0 — AI Portfolio: Showcase AI / Agentic Engineering Capability`
**Due:** 2027-02-27 ⏰ due in 24 days
**Progress:** ████░░░░░░ **40%** (3/8 issues closed)

_Last updated: 2027-02-03T14:22:11Z_
```

### Discovering milestone progress

To see progress for all milestones at once, search:

```
is:open label:milestone-tracker
```

These tracker issues become the **single source of truth** for "how are we doing?".

## Manual re-sync

If something drifts out of sync (rare, but happens with edge cases), trigger a manual run:

1. **GitHub** → **Actions** → **Project Sync** (or **Milestone Sync**)
2. **Run workflow** → optionally provide a milestone number or issue number
3. The workflow runs the same logic but on demand

## Caveats and known limits

- **Project field IDs are queried at runtime** (no hard-coded IDs) so the workflow stays portable if you rename fields or move to a new project board.
- **Multiple "In Progress" labels on a single issue** — only the first match wins; this is intentional to keep the logic deterministic.
- **Closing a PR without merge does NOT close the linked issue.** This is by design — issues often outlive a single PR attempt. To close an issue, merge the PR or close the issue manually.
- **First-time setup**: the very first PR against a fresh repo triggers a project-sync run; the linked issue (if any) gets added to the project. No backfill — historical issues aren't auto-imported. Run the workflow manually with the issue number if you need a backfill.
- **Bot PRs are skipped entirely** so Dependabot / Renovate / GitHub Actions PRs don't accidentally mutate labels.

## Disable / Enable

To pause sync:

```bash
# Rename the file to disable
mv .github/workflows/project-sync.yml .github/workflows/project-sync.yml.disabled
```

Or use **Settings** → **Actions** → **Disable workflow** for that file.

To enable again, restore the filename or re-enable.

## Future improvements

- [ ] Slack / Discord notification when a milestone flips to OVERDUE
- [ ] Auto-assign reviewers based on CODEOWNERS path matching
- [ ] Closed-milestone archival (move issues to a "📦 archived" project)
- [ ] Sprint reports generated as `/.github/workflows/sprint-report.yml` (weekly cron)
