# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| master  | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

**Please do not open a public issue for security vulnerabilities.**

Instead, report privately via GitHub Security Advisories:
👉 https://github.com/raihankhan/portfolio/security/advisories/new

I'll acknowledge within **48 hours** and aim to triage within **7 days**.

### What to include

- Description of the vulnerability and impact
- Reproduction steps
- Affected versions / commits
- Any known workarounds

### What to expect

- Confirmation of receipt within 48 hours
- Triage decision within 7 days
- Fix timeline communicated before disclosure
- Public CVE / advisory credit if you'd like

## Security Posture

- All dependencies scanned via Dependabot
- CodeQL enabled on every push + weekly schedule
- gitleaks pre-commit + CI scanning
- Strict CSP and security headers (see issue #21)
- Branch protection enforces linear history + 1 approval
- Secret scanning + push protection enabled at the repo level

## Acknowledgements

Thanks to everyone who reports vulnerabilities responsibly. 🙏
