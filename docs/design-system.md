# Design System

> **Status:** In progress. See issue #19 for the design tokens work and #18 for accessibility audit.

## Principles

1. **Semantic tokens, not primitives** — Components reference \`--color-fg\`, not \`--gray-900\`
2. **Theme-aware by default** — Every color flows from theme primitives
3. **Motion with meaning** — Animations guide attention, never decorate
4. **Accessible always** — WCAG 2.2 AA baseline, no exceptions

## Color tokens

### Primitive palette (themes)

Each theme defines an OKLCH palette. See \`lib/themes.ts\`.

| Theme | Primary | Use |
|-------|---------|-----|
| Aura Blue | oklch(0.78 0.15 195) | Default |
| Electric Purple | oklch(0.70 0.20 295) | High-energy |
| Emerald Green | oklch(0.72 0.19 155) | Calm / growth |
| Solar Orange | oklch(0.75 0.18 55) | Warm / active |
| Mossy Hollow | oklch(0.75 0.10 100) | Subdued |

### Semantic tokens

| Token | Purpose |
|-------|---------|
| \`--background\` | Page background |
| \`--foreground\` | Primary text |
| \`--primary\` | Brand accent, CTAs |
| \`--secondary\` | Supporting accent |
| \`--accent\` | Hover / focus states |
| \`--muted\` | Subdued backgrounds |
| \`--card\` | Glassmorphic card surface |
| \`--border\` | Subtle borders |

## Typography

- **Body:** Inter (variable)
- **Code:** JetBrains Mono (variable)
- **Display:** Orbitron (variable, used sparingly)

## Spacing

Tailwind default scale (4px base). Use semantic classnames where possible:
\`section-sm\`, \`section-md\`, \`section-lg\`.

## Motion

- **Duration:** 150ms (micro), 250ms (small), 400ms (medium), 600ms (large)
- **Easing:** \`ease-out\` for entrances, \`ease-in\` for exits
- **Respect** \`prefers-reduced-motion\`

## Components

Built on **shadcn/ui** primitives, extended with:
- Custom \`GlassCard\`
- Custom \`Dock\` (macOS-style)
- Custom \`SkillsRadar\`
- Custom \`ArchitectureDiagram\`
- Custom \`SearchDialog\`
