# Portfolio Context - Raihan Khan

## Overview

A Next.js 16-based portfolio showcasing platform engineering expertise. Built with App Router, TypeScript, Tailwind CSS v4, and Framer Motion. Positioned as **"Senior Platform Engineer"** with focus on Kubernetes, cloud infrastructure, GitOps, and internal developer platforms.

**Last Updated:** 2026-05-22

---

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js | 16.1.1 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.1.9 |
| UI Components | shadcn/ui + Radix | Latest |
| Animation | Framer Motion | Latest |
| Charts | Recharts | 2.15.4 |
| Fonts | Inter, JetBrains Mono, Orbitron | Google Fonts |
| State | React Context + localStorage | Built-in |

**Dependencies:** 45+ packages including Radix UI primitives, Recharts, Framer Motion, Lucide icons

---

## Project Structure

```
portfolio/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Home/Hero with skills radar
│   ├── layout.tsx               # Root layout with JSON-LD schemas
│   ├── globals.css              # Tailwind config + design tokens
│   ├── not-found.tsx            # 404 page
│   ├── sitemap.xml/route.ts     # Dynamic sitemap
│   ├── rss.xml/route.ts        # RSS feed
│   ├── projects/
│   │   ├── page.tsx            # Projects list
│   │   └── [id]/
│   │       ├── page.tsx        # Project detail
│   │       └── project-page-client.tsx
│   ├── blog/
│   │   ├── page.tsx            # Blog list with search
│   │   └── [slug]/
│   │       ├── page.tsx        # Blog post
│   │       ├── blog-post-page-client.tsx  # With TOC & reading progress
│   │       └── loading.tsx
│   ├── notes/
│   │   ├── page.tsx            # Notes list
│   │   └── [slug]/
│   │       ├── page.tsx
│   │       └── note-page-client.tsx
│   ├── experience/page.tsx       # Timeline + certifications
│   ├── contact/page.tsx          # Contact form
│   ├── feed/page.tsx             # Social feed
│   └── arcade/                   # 7 Kubernetes-themed games
├── components/
│   ├── ui/                      # shadcn/ui primitives (59 files)
│   ├── animated-background.tsx   # Mouse-following gradient orbs
│   ├── bug-walk.tsx             # Animated bug character
│   ├── devops-status.tsx         # Status ticker
│   ├── spline-robot.tsx         # 3D robot (Spline)
│   ├── section-header.tsx        # Page section headers
│   ├── project-card.tsx         # Enhanced with metrics
│   ├── blog-card.tsx            # Blog card
│   ├── note-card.tsx            # Note card
│   ├── tech-badge.tsx           # Tech badge
│   ├── experience-timeline.tsx  # Timeline
│   ├── markdown-renderer.tsx     # Enhanced with TOC IDs
│   ├── contact-form.tsx          # Validated form
│   ├── dock/
│   │   └── dock.tsx             # macOS-style nav + search button
│   ├── theme/                   # Theme provider + switcher
│   ├── game-console/            # Arcade game launcher
│   ├── skills-radar.tsx         # NEW: Interactive radar chart
│   ├── architecture-diagram.tsx # NEW: Mermaid diagram viewer
│   ├── search-dialog.tsx         # NEW: Full-text search
│   └── layout-shell.tsx          # NEW: Global layout wrapper
├── lib/
│   ├── data.ts                  # Content + enhanced project schema
│   ├── themes.ts                # Theme definitions (5 themes)
│   ├── utils.ts                 # Utility functions (cn)
│   └── seo.ts                   # NEW: SEO schemas & sitemap generation
├── hooks/                        # Custom React hooks
├── styles/                       # Additional styles
└── public/                       # Static assets

```

---

## Data Model (Enhanced)

### Projects
```typescript
interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  problemStatement: string          // NEW
  architectureDiagram?: {           // NEW
    type: "mermaid" | "image"
    content: string
    caption?: string
  }
  techStack: {                    // NEW: Separated stack
    primary: string[]
    supporting: string[]
  }
  tradeoffs: {                    // NEW: Architectural decisions
    decision: string
    rationale: string
    alternatives: string[]
  }[]
  technologies: string[]
  challenges: string[]
  outcomes: string[]
  metrics: {                      // NEW: Quantifiable metrics
    label: string
    value: string
    improvement?: string
  }[]
  links: { github?, demo?, docs?, caseStudy? }
  image: string
  featured: boolean
}
```
- **Count:** 5 projects (3 featured, 2 other)
- **Locations:** `lib/data.ts`

### Skills (NEW)
```typescript
interface Skill {
  name: string
  category: "kubernetes" | "cloud" | "gitops" | "golang" | "observability" | "security" | "ai"
  level: number // 0-100
  years: number
}
```
- **Count:** 7 skills for radar chart

### Certifications (NEW)
```typescript
interface Certification {
  id: string
  name: string
  issuer: string
  icon: string
  date: string
  expires?: string
  verificationUrl?: string
}
```
- **Count:** 5 certifications (CKA, AWS SAP, AWS DevOps Pro, Terraform Associate, GCP PCF)

### Blog Posts
```typescript
interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string  // Markdown with heading IDs for TOC
  publishedAt: string
  tags: string[]
  readingTime: string
}
```
- **Count:** 3 blog posts
- **Features:** Table of contents, reading progress bar

### Notes
```typescript
interface Note {
  slug: string
  title: string
  category: string
  content: string  // Markdown
  updatedAt: string
}
```
- **Count:** 3 notes

### Experience
```typescript
interface Experience {
  id: string
  role: string
  company: string
  location: string
  startDate: string
  endDate: string | null
  description: string
  achievements: string[]
  technologies: string[]
}
```
- **Count:** 3 roles

---

## New Components

### SkillsRadar (`components/skills-radar.tsx`)
- Interactive radar chart using Recharts
- Shows proficiency across 7 skill categories
- Legend with skill levels and years of experience
- Expertise level bars for detailed view

### ArchitectureDiagram (`components/architecture-diagram.tsx`)
- Renders Mermaid diagrams with custom SVG
- Fullscreen mode
- Zoom controls
- Copy to clipboard for Mermaid source
- Caption support

### SearchDialog (`components/search-dialog.tsx`)
- Full-text search across blog posts and notes
- Filter by content type (all/blog/notes)
- Keyboard shortcut: Cmd/Ctrl+K
- Relevance-based sorting
- Highlighted search matches

### LayoutShell (`components/layout-shell.tsx`)
- Global layout wrapper
- Manages Dock and SearchDialog state
- Keyboard shortcut handler

---

## SEO Implementation

### JSON-LD Schemas (`lib/seo.ts`)
- **Person:** Name, job title, skills, social links
- **Organization:** Portfolio branding
- **Website:** Site metadata
- **BlogPosting:** Per-article schema

### Dynamic Routes
- `/sitemap.xml` - XML sitemap with all pages
- `/rss.xml` - RSS feed for blog posts

### Metadata
- Enhanced Open Graph tags
- Twitter card metadata
- Canonical URLs
- RSS feed link in `<head>`

---

## Theme System

**File:** `lib/themes.ts`

5 themes with OKLCH color values:
| Theme | Primary | Gradient 1 |
|-------|---------|------------|
| Aura Blue | oklch(0.78 0.15 195) | #22d3ee |
| Electric Purple | oklch(0.70 0.20 295) | #a855f7 |
| Emerald Green | oklch(0.72 0.19 155) | #10b981 |
| Solar Orange | oklch(0.75 0.18 55) | #f97316 |
| Mossy Hollow | oklch(0.75 0.10 100) | #bac095 |

---

## Design System

### Colors (OKLCH)
- Background: `oklch(0.04 0.01 260)`
- Foreground: `oklch(0.93 0.01 260)`
- Primary: `oklch(0.78 0.15 195)` (theme-reactive)
- Card: `oklch(0.12 0.01 260 / 0.6)` (glassmorphic)
- Border: `oklch(0.25 0.01 260 / 0.4)`

### Glassmorphism Pattern
```css
.glass {
  background: oklch(0.12 0.01 260 / 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid oklch(0.25 0.01 260 / 0.4);
}
```

### Typography
- Body: Inter (variable)
- Code: JetBrains Mono (variable)
- Accent: Orbitron (variable)

---

## Routes & Pages

| Route | Page | Features |
|-------|------|----------|
| `/` | Home | Hero, skills radar, architecture diagram |
| `/projects` | Projects | Grid with metrics badges |
| `/projects/[id]` | Project Detail | Architecture diagram, tradeoffs, metrics |
| `/blog` | Blog | Search, tag filtering |
| `/blog/[slug]` | Blog Post | TOC slideout, reading progress, share |
| `/notes` | Notes | Category filtering |
| `/notes/[slug]` | Note Detail | Markdown rendering |
| `/experience` | Timeline | Certifications section, open source |
| `/contact` | Contact | Validated form |
| `/sitemap.xml` | Sitemap | Dynamic XML |
| `/rss.xml` | RSS | Blog feed |
| `/arcade/*` | Games | 7 Kubernetes-themed games |

---

## Key Features Implemented

### Sprint 1 (Completed)
- [x] Hero section redesign with "Platform Engineer" positioning
- [x] Skills radar component with interactive chart
- [x] Enhanced project data structure with metrics, tradeoffs, diagrams
- [x] Architecture diagram component

### Sprint 2 (Completed)
- [x] JSON-LD structured data (Person, Organization, Website)
- [x] Dynamic sitemap.xml generation
- [x] RSS feed for blog
- [x] Blog post template with TOC slideout
- [x] Reading progress indicator

### Sprint 3 (Completed)
- [x] Certifications section with 5 credentials
- [x] Open source contributions section
- [x] Enhanced skills overview

### Sprint 4 (Completed)
- [x] Full-text search across blog and notes
- [x] Keyboard shortcut (Cmd/Ctrl+K)
- [x] Search dialog with type filtering

---

## Files Created/Modified

### Created
- `components/skills-radar.tsx`
- `components/architecture-diagram.tsx`
- `components/search-dialog.tsx`
- `components/layout-shell.tsx`
- `lib/seo.ts`
- `app/sitemap.xml/route.ts`
- `app/rss.xml/route.ts`

### Modified
- `app/page.tsx` - Hero redesign
- `app/layout.tsx` - JSON-LD, RSS link, LayoutShell
- `lib/data.ts` - Enhanced schemas, skills, certifications
- `components/project-card.tsx` - Metrics display
- `components/project-page-client.tsx` - Full architecture view
- `components/markdown-renderer.tsx` - Heading IDs for TOC
- `components/blog-post-page-client.tsx` - TOC, reading progress
- `components/experience/page.tsx` - Certifications section
- `components/dock/dock.tsx` - Search button added

---

## Performance Notes

- **Images:** Next.js Image with optimization
- **Fonts:** next/font with display swap
- **Animations:** Framer Motion with CSS transforms
- **Search:** Client-side with memoization
- **Sitemap/RSS:** Static generation with revalidation

---

## Deployment

- **Host:** Vercel (ready)
- **Build:** `pnpm build`
- **Environment:** No env vars required (static content)
- **Optional:** `NEXT_PUBLIC_SITE_URL` for absolute URLs in SEO

---

## Related Documentation

- `README.md` - Quick start guide
- `PROJECT.md` - Full project documentation
- `CONTRIBUTING.md` - Content management guide
- `plan.md` - Transformation roadmap

---

*This context document serves as a reference for the portfolio codebase.*
*For transformation plans, see `plan.md`.*
