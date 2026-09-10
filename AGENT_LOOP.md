# AGENT LOOP

> An end-to-end autonomous workflow for picking GitHub issues, planning them, implementing them, and opening a PR — using **git worktrees** for isolation.
>
> Designed for use with Puku CLI / Claude (or any capable coding agent) acting on the `raihankhan/portfolio` repository.

---

## Table of contents

1. [Goals & non-goals](#1-goals--non-goals)
2. [Core principles (Karpathy-informed)](#2-core-principles-karpathy-informed)
3. [The loop at a glance](#3-the-loop-at-a-glance)
4. [Inputs](#4-inputs)
5. [Phase 1 — Pick](#phase-1--pick)
6. [Phase 2 — Plan](#phase-2--plan)
7. [Phase 3 — Research](#phase-3--research)
8. [Phase 4 — Implement](#phase-4--implement)
9. [Phase 5 — Verify](#phase-5--verify)
10. [Phase 6 — PR](#phase-6--pr)
11. [Phase 7 — Cleanup](#phase-7--cleanup)
12. [Worktree conventions](#worktree-conventions)
13. [Safety guardrails](#safety-guardrails)
14. [Failure modes & recovery](#failure-modes--recovery)
15. [Telemetry & continuous improvement](#telemetry--continuous-improvement)

---

## 1. Goals & non-goals

### Goals

- **Autonomous end-to-end:** Pick a GitHub issue, plan, research, code, verify, and open a PR with no human in the loop except for review.
- **Isolated execution:** Every issue runs in its own git worktree so multiple loops can run in parallel without conflicts.
- **Senior-engineer output:** Resulting PRs are small, focused, well-tested, and match existing code style.
- **Verifiable success:** Every loop terminates with a checkable goal (tests pass, lint clean, build succeeds, PR opened).
- **Resumable:** If the agent is killed mid-loop, it can pick up where it left off on the same issue.

### Non-goals

- **Not a replacement for human review.** A human still reviews the PR. The agent's job is to make the PR review trivial, not to skip it.
- **Not autonomous deployment.** Merging to `master` is a human action.
- **Not for architectural decisions.** Issues that require a tradeoff discussion (RFCs) are flagged and skipped (see [Safety guardrails](#safety-guardrails)).
- **Not for emergencies.** Production incidents need a human in the loop, not a 5-minute autonomous PR.

---

## 2. Core principles (Karpathy-informed)

These come from `karpathy-guidelines` and govern every decision the agent makes.

### 2.1 Think before coding

- **State assumptions explicitly** at the start of every phase. If uncertain, surface the question.
- **Present tradeoffs** when multiple reasonable approaches exist; pick the simpler one unless stated otherwise.
- **Stop and ask** when the issue is ambiguous, the codebase surprises you, or you discover a hidden constraint.

### 2.2 Simplicity first

- Minimum code that solves the problem. Nothing speculative.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- If a 200-line solution could be 50, rewrite it.
- **Would a senior engineer say this is overcomplicated?** If yes, simplify.

### 2.3 Surgical changes

- **Touch only what you must.** Don't "improve" adjacent code, comments, or formatting.
- **Match existing style**, even if you'd do it differently.
- **Don't refactor things that aren't broken.**
- Every changed line must trace directly to the user's request (the issue body).
- **Remove only your own orphans** — pre-existing dead code stays unless explicitly part of the issue.

### 2.4 Goal-driven execution

- Every loop has **explicit, verifiable success criteria** stated up front.
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"
- The agent loops on verification until criteria are met — no "looks good, ship it".

---

## 3. The loop at a glance

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ┌────────┐    ┌────────┐    ┌─────────┐    ┌─────────────┐    │
│   │  PICK  │──▶│  PLAN  │──▶│ RESEARCH │──▶│  IMPLEMENT  │    │
│   └────────┘    └────────┘    └─────────┘    └──────┬──────┘    │
│                                                     │           │
│                                                     ▼           │
│              ┌──────────┐    ┌──────────┐    ┌──────────┐        │
│              │ CLEANUP  │◀───│    PR    │◀───│  VERIFY  │        │
│              └──────────┘    └──────────┘    └──────────┘        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Each phase has a **clear entry condition, exit condition, and time budget**.

---

## 4. Inputs

The loop is parameterized by:

| Input | Type | Required | Default |
|-------|------|----------|---------|
| `issue` | issue number or URL | yes | — |
| `repo` | `owner/repo` | no | `raihankhan/portfolio` |
| `base` | base branch | no | `master` |
| `model` | which model to use | no | inherited |
| `isolation` | `worktree` \| `branch` | no | `worktree` |
| `auto_pr` | bool — open PR automatically | no | `true` |
| `auto_merge` | bool — auto-merge dependabot-style PRs | no | `false` |
| `verify` | `lint typecheck test build` (any subset) | no | all |
| `time_budget_min` | per-phase hard cap | no | 30 |
| `max_turns` | safety cap on agent turns | no | 200 |

Example invocation:

```
/loop --issue 19 --isolation worktree --verify lint,typecheck,test,build --auto_pr true
```

---

## Phase 1 — Pick

### Entry
- No active worktree for the issue.
- Issue is in the **open** state, has a `track:*` label, has a `priority:*` label, has an `effort:*` label.

### Algorithm
1. **Select candidate** from the public roadmap project ("Platform & FDE Roadmap"):
   - Filter: `is:open` + `priority:p1` OR `priority:p0`.
   - Exclude: items with `status:blocked`, `interview:*` (those are prep, not code), or `epic:*` (those are too big for one loop).
   - Order: highest priority score (custom field), then lowest issue number (oldest first).
   - Tiebreak: `effort:xs` then `effort:s` — quick wins get fast feedback.
2. **Verify scope fit** (reject and pick next if any):
   - Estimated diff > 600 lines → reject (too big for one loop).
   - Requires changes to > 3 packages → reject.
   - Touches secrets, auth, billing, or DB migrations → reject (human review required).
   - Has unresolved `status: needs-info` or `status: needs-review` → reject.
3. **Lock the issue**:
   - Post a comment: "🤖 Agent loop started by @raihankhan. Worktree: `<name>`. Will open a PR within <time_budget>."
   - Add label `status: in-progress` and remove `status: needs-review`.
4. **Hand off to Phase 2**.

### Exit
- One issue is locked and assigned to a new worktree path.

---

## Phase 2 — Plan

### Entry
- Issue body, comments, and labels are loaded.

### Algorithm
1. **Restate the goal in verifiable form.** No "implement the feature" — instead:
   - "Add an OG image generator at `/api/og` that returns a 1200x630 PNG with the post title and tags."
   - "Write a test that fails when no OG image is generated for a blog post page."
   - "Make the test pass."
2. **Identify files to touch.** Use `Grep` and `Glob` to find:
   - Existing similar features (for surgical style matching)
   - Public surface that will change (route handlers, exports)
   - Test files that exercise the area
3. **Identify constraints**:
   - Tech stack constraints (already in `tech:*` labels).
   - Style constraints (lint rules, naming conventions).
   - Existing patterns (other features in the same area).
4. **Decompose into steps.** For each step, write the verification check:
   ```
   1. Add a route handler in app/api/og/route.ts → verify: curl returns 200 with image/png content type
   2. Add a test in tests/api/og.test.ts → verify: vitest passes
   3. Add og:image meta to blog post page → verify: grep matches the new meta tag
   4. Update documentation in /docs/og-images.md → verify: file exists and links from README
   ```
5. **Estimate diff size.** If > 600 lines, split into multiple PRs or escalate.
6. **Surface unknowns.** If the plan has > 2 "I don't know" markers, return to human before Phase 3.

### Exit
- A short plan (5–10 lines) is written to the worktree's `.agent/plan.md`.

---

## Phase 3 — Research

### Entry
- Plan is in `.agent/plan.md`.

### Algorithm
1. **Read the issue and all comments.** Note any decisions, constraints, or links.
2. **Read the linked files** identified in Phase 2.
3. **Read adjacent files** that look stylistically similar (for surgical style matching).
4. **Search the codebase** for:
   - Existing utilities that solve part of the problem (avoid duplication).
   - Existing patterns (how similar features are wired in).
   - Existing tests (to match style and to know what to update).
5. **Check external docs** only when the issue is gated on framework/library behavior:
   - Use `WebFetch` or `WebSearch` sparingly; prefer `Read` of existing code first.
6. **Write findings to `.agent/research.md`**:
   - Files to modify (with line ranges).
   - Files to reference (read-only).
   - Patterns to match (with example snippets).
   - External docs cited (URLs).
   - Open questions for human (if any).

### Exit
- `.agent/research.md` exists and is non-empty.
- All "open questions" have answers OR are escalated to human.

**Time budget:** 5 minutes.

---

## Phase 4 — Implement

### Entry
- `.agent/research.md` and `.agent/plan.md` exist.

### Algorithm

Apply Karpathy principles ruthlessly:

1. **Write tests first** (when the issue requires behavior verification).
   - Place test files in the same style as existing tests in the repo.
   - Run the test, confirm it fails for the right reason.
2. **Make the minimum change** that makes the test pass.
   - Touch only files in `.agent/research.md`.
   - Match style of adjacent code — variables, naming, indentation, imports order.
   - No defensive `try/catch` for impossible failures.
   - No speculative parameters, options, or env vars.
3. **Iterate** until:
   - All planned steps are complete.
   - No TODO comments left behind.
   - No console.log / debug code left.
4. **Self-review checklist** (mandatory):
   - [ ] Every changed line traces to an item in `.agent/plan.md`.
   - [ ] No imports left unused.
   - [ ] No variables left unused.
   - [ ] No formatting changes to unrelated lines.
   - [ ] Comments only where the code is non-obvious.
   - [ ] No new top-level abstractions for single-use code.
   - [ ] Match style of the file I'm editing.

### Exit
- All planned steps complete.
- `git status` shows only the files expected.
- Working tree has no leftover debug code.

**Time budget:** 15 minutes for `effort:m`, 30 for `effort:l`, 60 for `effort:xl`.

---

## Phase 5 — Verify

### Entry
- Implementation complete.

### Algorithm

Run each enabled check from `--verify`. **Each check must pass. No "looks fine".**

```bash
# Lint
pnpm lint

# Typecheck
pnpm typecheck

# Tests
pnpm test

# Build
pnpm build

# Bundle size (if applicable)
pnpm analyze

# Lighthouse (for perf-sensitive changes)
pnpm lhci

# Security
pnpm audit --prod
gitleaks detect --no-git
```

For each failure:

1. **Read the error carefully.** Don't speculate.
2. **Fix the root cause**, not the symptom.
3. **Re-run all checks** (not just the one that failed).
4. **Repeat** until all pass OR escalate to human with full error context.

### Exit
- All checks pass.
- A `.agent/verify.log` is written with timestamps and pass/fail status.

**Hard cap:** If any check fails 3 times in a row, escalate to human.

---

## Phase 6 — PR

### Entry
- All verify checks pass.
- Working tree is clean except for the intended changes.

### Algorithm

1. **Commit** with conventional-commit format:
   ```
   <type>(<scope>): <subject>

   <body>

   Closes #<issue>
   ```
   - `type` from the issue's `track:*` label (e.g., `feat`, `fix`, `chore`).
   - `scope` from the area affected (e.g., `mcp`, `blog`, `ci`).
   - Body explains the **why** in 2–4 lines.
2. **Push the worktree branch.**
3. **Open the PR** using `gh pr create`:
   - Title: conventional-commit subject.
   - Body: filled from `.github/pull_request_template.md`, with:
     - Closes #N pre-filled.
     - Summary, test plan, screenshots pre-filled.
     - Self-review checklist marked.
4. **Request review** from the CODEOWNERS of the changed paths.
5. **Post a comment on the issue** linking to the PR.
6. **Add the PR to the project board** with `Status: In Review` (or move it to "Done" if `auto_merge` is true and all checks pass).
7. **Label the PR** with all labels from the issue, plus `track: portfolio` or similar.

### Exit
- PR exists, is open, has a review requested.
- Issue has a link to the PR.
- Project board is updated.

---

## Phase 7 — Cleanup

### Entry
- PR is open (or merged).

### Algorithm

1. **Remove the worktree:**
   ```bash
   git worktree remove .worktrees/issue-<N> --force
   ```
2. **Delete the local branch** (only if the PR was merged or closed).
3. **Archive** `.agent/plan.md`, `.agent/research.md`, `.agent/verify.log` to `.agent/logs/<run-id>/`.
4. **Remove** the in-progress label from the issue.
5. **If `auto_merge` is true** and PR checks pass, merge with `--squash` (Dependabot-style for `chore:` PRs only).
6. **Update telemetry** (see below).

### Exit
- Worktree directory removed.
- Issue state correct.
- Telemetry logged.

---

## Worktree conventions

Every loop runs in an isolated worktree:

```bash
# Path convention
.worktrees/issue-<N>-<short-slug>/

# Example
.worktrees/issue-19-design-tokens/

# Create
git worktree add .worktrees/issue-19-design-tokens -b agent/issue-19 master

# Run inside worktree
cd .worktrees/issue-19-design-tokens
# ... agent does its work ...

# Cleanup after PR is opened
git worktree remove .worktrees/issue-19-design-tokens --force
```

**Why worktrees:**
- Multiple loops can run in parallel without clobbering each other.
- The main checkout (`master`) stays clean and ready for human work.
- The worktree's branch can be force-pushed without affecting anything else.
- Easy cleanup: `git worktree remove` and the branch is gone.

**Concurrency rules:**
- One worktree per issue at a time.
- Multiple loops can run in parallel on **different** issues.
- Two loops targeting the same issue → second one waits, then re-validates.

---

## Safety guardrails

The agent must **stop and escalate** to a human when any of these are true:

| Condition | Action |
|-----------|--------|
| Issue requires architectural decision | Add `status: needs-info`, comment "@raihankhan please confirm the tradeoff", stop. |
| Issue touches auth, secrets, billing, or infra | Add `status: needs-review`, comment "human review required", stop. |
| Estimated diff > 600 lines | Stop and split into multiple issues. |
| More than 2 unknowns in the plan | Stop and ask. |
| Any verify check fails 3 times in a row | Stop with full error context. |
| Branch protection rules can't be satisfied | Stop. |
| Need to push to `master` directly | Stop. Always go through a PR. |
| Need to run destructive git operations | Stop and confirm. |

The agent **must not**:
- Push to `master` (always via PR).
- Modify GitHub repo settings (labels, milestones, branch protection) without explicit human confirmation.
- Comment on issues unrelated to the current loop.
- Open PRs against repos other than the configured `repo`.
- Spend more than `--time_budget_min` per phase without escalation.
- Merge its own PR (unless `auto_merge: true` for `chore:` PRs only).

---

## Failure modes & recovery

| Failure | Recovery |
|---------|----------|
| Agent killed mid-loop | Resume: detect existing `.agent/plan.md` and `.agent/research.md` in worktree, skip completed phases. |
| Worktree state corrupted | `git worktree remove --force`, recreate from `master`. |
| PR checks fail after push | Iterate: fix, push to same branch, checks re-run. |
| Conflict with `master` during rebase | `git rebase --abort`, comment on PR "needs rebase", stop. |
| Human overrides the agent | Detect via issue label `status: blocked` or comment, stop and clean up. |
| Same issue picked by 2 loops | Second loop detects in-progress label, picks next issue. |
| Verify command doesn't exist | Treat as escalation — surface to human. |

---

## Telemetry & continuous improvement

Every loop writes to `.agent/logs/<run-id>/`:

```json
{
  "run_id": "2026-08-28-001",
  "issue": 19,
  "issue_title": "Implement design tokens",
  "labels": ["area: frontend", "track: portfolio", "effort: l", "priority: p1"],
  "started_at": "2026-08-28T10:00:00Z",
  "phases": {
    "pick":  { "duration_s": 2, "result": "ok" },
    "plan":  { "duration_s": 180, "result": "ok", "lines_planned": 220 },
    "research": { "duration_s": 240, "result": "ok", "files_read": 14 },
    "implement": { "duration_s": 720, "result": "ok", "lines_changed": 195, "files_touched": 6 },
    "verify": { "duration_s": 60, "result": "ok", "checks": ["lint:ok", "typecheck:ok", "test:ok", "build:ok"] },
    "pr":    { "duration_s": 30, "result": "ok", "pr_number": 63, "pr_url": "..." },
    "cleanup": { "duration_s": 5, "result": "ok" }
  },
  "total_duration_s": 1237,
  "tokens_used": { "input": 45000, "output": 12000 },
  "outcome": "merged" | "open" | "closed" | "escalated",
  "human_interventions": 0
}
```

Use this to:
- **Tune time budgets** per phase and effort label.
- **Identify patterns** in failures (most failures during which phase?).
- **Track velocity** by track / area.
- **Spot issues** that consistently need human input (refine labels or templates).
- **Compare models** if you switch between them.

A weekly summary can be auto-generated as a Markdown report and posted to `/docs/agent-metrics/<week>.md`.

---

## Quick reference: minimal command

```
/loop --issue 19 --verify lint,typecheck,test,build
```

That single command:
1. Picks the issue (or uses the one given).
2. Creates a worktree.
3. Plans, researches, implements.
4. Runs lint, typecheck, tests, build.
5. Opens a PR.
6. Cleans up the worktree.

---

## Appendix A — Worktree setup (one-time)

```bash
# Add worktrees path to .gitignore
echo ".worktrees/" >> .gitignore
echo ".agent/logs/" >> .gitignore

# Make worktrees directory
mkdir -p .worktrees

# Verify git config
git config --get user.email || git config --set user.email "agent@raihankhan.dev"
git config --get user.name  || git config --set user.name  "Raihan's Agent"
```

## Appendix B — Label heuristics for "safe to loop"

An issue is safe to run autonomously when **all** are true:

- Has `track:*` label (not a meta / interview prep item)
- Has `effort:*` label that is `xs`, `s`, `m`, or `l`
- Has `priority:*` label that is `p1` or `p0`
- Does **not** have:
  - `status: blocked`
  - `status: needs-info`
  - `interview:*`
  - `epic:*`
  - `cert:*` (cert work often involves doc review)
- Title is concrete (verb + noun) — not "Explore X" or "Consider Y"

## Appendix C — Phrases the agent should never use in PRs

- "Refactored adjacent code for consistency"
- "Updated formatting throughout"
- "Improved error handling"
- "Made the API more flexible"
- "Future-proofed for X"
- "Added documentation"
- "TODO: ..."

If a PR body contains any of these, **rewrite** before submitting.

---

*This document governs the agent loop. Update it when the loop changes; the loop should not deviate from the doc without a doc change first.*
