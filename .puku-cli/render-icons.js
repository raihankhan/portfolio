#!/usr/bin/env node
// Render the monogram SVG to 32x32 PNG variants for light and dark modes.
// Uses sharp with a CSS color-scheme override to force each variant.

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '..', 'public', 'icon.svg');
const svgSrc = fs.readFileSync(svgPath, 'utf8');

async function renderFor(scheme, outPath, size = 32) {
  // Inject a <style> override at the top of the SVG that flips the color-scheme.
  const override = `<style>:root { color-scheme: ${scheme}; }</style>`;
  // Replace existing <style> with one that targets the forced scheme only.
  // Strategy: rewrite the existing media-query block to force the requested scheme,
  // regardless of user preference, so PNG output is deterministic.
  let body = svgSrc
    .replace(
      /@media \(prefers-color-scheme: light\) \{[^}]*\}/g,
      `@media (prefers-color-scheme: ${scheme === 'light' ? 'light' : 'only-dark-fallback'}) { /* disabled */ }`
    );

  // The cleanest way: produce a variant SVG with only the chosen scheme active.
  // We'll do a simpler approach — generate two distinct SVGs by stripping the
  // media query we don't want.
  body = svgSrc
    .replace(/<style>[\s\S]*?<\/style>/, '')
    .replace(
      /<rect class="bg"[^/]*\/>/,
      `<rect class="bg" width="180" height="180" rx="37" fill="${scheme === 'light' ? '#0a0a0f' : '#ffffff'}"/>`
    );

  // Replace text fills with the foreground color via inline attribute
  body = body.replace(
    /<g class="fg"([^>]*)>/,
    `<g fill="${scheme === 'light' ? '#ffffff' : '#0a0a0f'}"$1>`
  );

  // Replace accent dot color
  body = body.replace(
    /<circle class="accent"([^/]*)\/>/,
    `<circle fill="${scheme === 'light' ? '#38bdf8' : '#0a0a0f'}"$1/>`
  );

  await sharp(Buffer.from(body))
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(outPath);

  console.log(`OK  ${path.relative(process.cwd(), outPath)} (${size}x${size}, ${scheme})`);
}

async function main() {
  const publicDir = path.join(__dirname, '..', 'public');
  await renderFor('light', path.join(publicDir, 'icon-light-32x32.png'), 32);
  await renderFor('dark', path.join(publicDir, 'icon-dark-32x32.png'), 32);
  await renderFor('light', path.join(publicDir, 'apple-icon.png'), 180);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
