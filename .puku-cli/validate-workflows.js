#!/usr/bin/env node
// Validate YAML syntax of GitHub workflow files.
const fs = require('fs');
const yaml = require('js-yaml');

const files = [
  '.github/workflows/project-sync.yml',
  '.github/workflows/milestone-sync.yml',
  '.github/workflows/nextjs.yml',
  '.github/dependabot.yml',
  '.github/stale.yml',
  '.github/ISSUE_TEMPLATE/bug.yml',
  '.github/ISSUE_TEMPLATE/feature.yml',
  '.github/ISSUE_TEMPLATE/content.yml',
  '.github/ISSUE_TEMPLATE/rfc.yml',
  '.github/ISSUE_TEMPLATE/config.yml',
];

let ok = true;
for (const f of files) {
  try {
    const text = fs.readFileSync(f, 'utf8');
    const data = yaml.load(text);
    const size = yaml.dump(data).length;
    const name = f.split('/').pop().padEnd(40);
    console.log(`OK  ${name} (${size} chars)`);
  } catch (e) {
    console.error(`ERR ${f}: ${e.message}`);
    ok = false;
  }
}

process.exit(ok ? 0 : 1);
