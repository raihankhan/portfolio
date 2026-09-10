# Release process

## Tooling

- **commitlint** — enforces conventional commit messages
- **release-please** — opens a release PR when conventional commits accumulate
- **GitHub Actions** — runs CI on every PR; deploys on tags

## Conventional commits

Format: \`<type>(<scope>): <description>\`

Types:
- \`feat\` — new feature
- \`fix\` — bug fix
- \`docs\` — documentation only
- \`refactor\` — code change that neither fixes a bug nor adds a feature
- \`test\` — adding missing tests
- \`chore\` — tooling / deps / non-code changes
- \`ci\` — CI configuration changes
- \`perf\` — performance improvement
- \`revert\` — revert a previous commit

Examples:
- \`feat(mcp): add search_portfolio tool\`
- \`fix(search): handle empty query gracefully\`
- \`docs(adr): write ADR-0001 gitops decision\`
- \`chore(deps): bump next.js to 16.1.2\`

## Release flow

1. Commits land on \`master\` (squash-merged via PR)
2. \`release-please\` opens a release PR with:
   - Updated version in \`package.json\`
   - Updated CHANGELOG.md
   - Updated release notes draft
3. Reviewer approves and merges
4. GitHub tag is created
5. Tag triggers Vercel production deploy
6. GitHub Release is published

## Versioning

[SemVer](https://semver.org/) — \`MAJOR.MINOR.PATCH\`

- \`MAJOR\` — breaking changes (we don't have any yet)
- \`MINOR\` — new features (most releases)
- \`PATCH\` — bug fixes

## Hotfix flow

1. Branch off master: \`git switch -c hotfix/critical-bug master\`
2. Fix + test
3. Open PR directly to master (skip release-please)
4. Merge → tag → deploy

## Rollback

Vercel keeps all deployments. To rollback:

\`\`\`bash
vercel rollback <deployment-url>
\`\`\`

Or click "Promote to Production" on the previous deployment in Vercel dashboard.
