#!/usr/bin/env python3
"""Validate YAML syntax of GitHub workflow files."""
import sys
import yaml

files = [
    "/Users/raka/github.com/raihankhan/portfolio/.github/workflows/project-sync.yml",
    "/Users/raka/github.com/raihankhan/portfolio/.github/workflows/milestone-sync.yml",
    "/Users/raka/github.com/raihankhan/portfolio/.github/workflows/nextjs.yml",
    "/Users/raka/github.com/raihankhan/portfolio/.github/dependabot.yml",
    "/Users/raka/github.com/raihankhan/portfolio/.github/stale.yml",
    "/Users/raka/github.com/raihankhan/portfolio/.github/ISSUE_TEMPLATE/bug.yml",
    "/Users/raka/github.com/raihankhan/portfolio/.github/ISSUE_TEMPLATE/feature.yml",
    "/Users/raka/github.com/raihankhan/portfolio/.github/ISSUE_TEMPLATE/content.yml",
    "/Users/raka/github.com/raihankhan/portfolio/.github/ISSUE_TEMPLATE/rfc.yml",
    "/Users/raka/github.com/raihankhan/portfolio/.github/ISSUE_TEMPLATE/config.yml",
]

ok = True
for f in files:
    try:
        with open(f) as fh:
            data = yaml.safe_load(fh)
        size = len(yaml.safe_dump(data))
        print(f"OK  {f.split('/')[-1]:40s} ({size} chars)")
    except yaml.YAMLError as e:
        print(f"ERR {f}: {e}")
        ok = False
    except FileNotFoundError:
        print(f"??  {f}: not found")

sys.exit(0 if ok else 1)
