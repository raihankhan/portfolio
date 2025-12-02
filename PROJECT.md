# DevOps Portfolio Website - Project Documentation

## Overview

A modern, dynamic portfolio website for **Raihan Khan**, a Senior DevOps Engineer. Built with Next.js 16, featuring glassmorphism UI, animated backgrounds, a macOS-style dock navigation, and an interactive Kubernetes-themed arcade.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 with CSS custom properties
- **UI Components:** shadcn/ui
- **Animations:** Framer Motion
- **Fonts:** Inter (sans), JetBrains Mono (mono)

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx                    # Home/Hero page
│   ├── layout.tsx                  # Root layout with theme provider
│   ├── globals.css                 # Tailwind config & design tokens
│   ├── projects/                   # Portfolio projects section
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── blog/                       # Blog with Markdown rendering
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── notes/                      # Quick reference notes
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── experience/                 # Professional timeline
│   │   └── page.tsx
│   ├── contact/                    # Contact form
│   │   └── page.tsx
│   └── arcade/                     # Kubernetes-themed games
│       ├── page.tsx                # Game selection hub
│       ├── snake/
│       ├── flappy/
│       ├── tictactoe/
│       ├── pod-eviction-survival/
│       ├── autoscaler-rampage/
│       ├── node-drain-rush/
│       └── devops-adventure-gitops/
├── components/
│   ├── animated-background.tsx     # Dynamic gradient orbs
│   ├── dock/dock.tsx               # macOS-style navigation
│   ├── theme/                      # Multi-theme system
│   │   ├── theme-provider.tsx
│   │   └── theme-switcher.tsx
│   ├── game-console/               # Arcade popover & shared UI
│   ├── games/                      # Individual game components
│   │   ├── pod-eviction/
│   │   ├── autoscaler/
│   │   ├── node-drain/
│   │   └── devops-adventure/
│   └── [section-components]        # Blog cards, project cards, etc.
├── lib/
│   ├── data.ts                     # All content data (projects, blogs, notes, experience)
│   ├── themes.ts                   # Theme definitions
│   └── utils.ts                    # Utility functions (cn)
└── public/                         # Static assets
\`\`\`

## Key Features

### 1. Animated Aura Background
- Mouse-following gradient orbs with smooth interpolation
- Subtle grid pattern and noise texture overlay
- Theme-reactive colors

### 2. macOS-Style Dock Navigation
- Bottom-fixed glassmorphic dock
- Icon magnification on hover (Framer Motion)
- Navigation: Home, Projects, Blog, Notes, Experience, Contact
- Social links: GitHub, LinkedIn, Twitter

### 3. Multi-Theme System
Four color themes with instant switching:
- **Aura Blue** (default): Cyan/blue primary
- **Electric Purple**: Purple/pink primary
- **Emerald Green**: Green/teal primary
- **Solar Orange**: Orange/red primary

Theme switcher in top-right corner, persists to localStorage.

### 4. Content Sections

| Section | Route | Description |
|---------|-------|-------------|
| Projects | `/projects` | DevOps project portfolio with detail pages |
| Blog | `/blog` | Markdown articles with syntax highlighting |
| Notes | `/notes` | Quick reference snippets by category |
| Experience | `/experience` | Animated vertical timeline |
| Contact | `/contact` | Validated contact form |

### 5. Kubernetes Arcade
Seven games accessible via game controller icon in top-right:

| Game | Route | Gameplay |
|------|-------|----------|
| Snake | `/arcade/snake` | Classic snake game |
| Flappy Bird | `/arcade/flappy` | Tap to fly through pipes |
| Tic-Tac-Toe | `/arcade/tictactoe` | Play against simple AI |
| Pod Eviction Survival | `/arcade/pod-eviction-survival` | Dodge falling eviction events |
| Cluster Autoscaler Rampage | `/arcade/autoscaler-rampage` | Add nodes to catch falling jobs |
| Node Drain Rush | `/arcade/node-drain-rush` | Click pods to evict before timer expires |
| DevOps Adventure: GitOps | `/arcade/devops-adventure-gitops` | Multi-stage deployment pipeline |

## Data Management

All content is stored in `lib/data.ts`:

\`\`\`typescript
// Types available:
interface Project { id, title, description, technologies, challenges, outcomes, links, image, featured }
interface BlogPost { slug, title, excerpt, content, publishedAt, tags, readingTime }
interface Note { slug, title, category, content, updatedAt }
interface Experience { id, role, company, location, startDate, endDate, description, achievements, technologies }
\`\`\`

See `CONTRIBUTING.md` for detailed instructions on adding/editing content.

## Design System

### Colors (CSS Custom Properties)
\`\`\`css
--background: /* Dark base */
--foreground: /* Light text */
--primary: /* Theme primary color */
--secondary: /* Theme secondary color */
--accent: /* Theme accent color */
--muted: /* Subdued backgrounds */
--card: /* Card backgrounds with transparency */
\`\`\`

### Glassmorphism Pattern
\`\`\`css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
}
\`\`\`

### Animation Patterns
- Use Framer Motion for all animations
- Stagger children with `variants` and `staggerChildren`
- Page transitions with `initial`, `animate`, `exit`
- Hover effects with `whileHover`, `whileTap`

## Known Issues / TODOs

### Bugs to Fix
- [ ] DevOps Adventure GitOps: Stage 1 (Commit) drag-and-drop not registering drops correctly
- [ ] Remove debug console.log statements from `stage-commit.tsx` after fixing

### Future Enhancements
- [ ] Add real contact form backend (currently frontend-only validation)
- [ ] Add RSS feed for blog
- [ ] Add search functionality across all content
- [ ] Add dark/light mode toggle (currently dark-only)
- [ ] Implement Vercel Analytics
- [ ] Add Open Graph images for social sharing
- [ ] Create MDX file-based content system (currently inline in data.ts)
- [ ] Add game high score persistence (localStorage or database)
- [ ] Mobile touch controls for arcade games

## Development Commands

\`\`\`bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run linting
pnpm lint
\`\`\`

## Architecture Notes

### Server vs Client Components
- Dynamic route pages (`[id]`, `[slug]`) are **Server Components** that await params
- Interactive content moved to separate `*-client.tsx` files for Framer Motion
- Theme/Game providers wrap the app at layout level

### State Management
- Theme state: React Context + localStorage
- Game state: Component-local useState/useRef
- No global state library needed

### Performance Considerations
- Animated background uses CSS transforms (GPU-accelerated)
- Images use Next.js Image component with optimization
- Fonts loaded via `next/font/google` with display swap

## Deployment

Ready for Vercel deployment:
1. Connect GitHub repository
2. Deploy with default Next.js settings
3. No environment variables required (static content)

For contact form functionality, add:
- `RESEND_API_KEY` or similar email service integration
