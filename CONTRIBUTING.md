# Contributing to Raihan Khan's Portfolio

Thank you for your interest in contributing to this portfolio website! This document provides guidelines for adding and managing content.

## Table of Contents

- [Project Structure](#project-structure)
- [Adding Blog Posts](#adding-blog-posts)
- [Adding Notes](#adding-notes)
- [Adding Projects](#adding-projects)
- [Adding Experience](#adding-experience)
- [Styling Guidelines](#styling-guidelines)

## Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
│   ├── blog/              # Blog section
│   ├── contact/           # Contact page
│   ├── experience/        # Experience timeline
│   ├── notes/             # Notes section
│   └── projects/          # Portfolio projects
├── components/            # React components
├── lib/
│   └── data.ts           # Content data (projects, blog, notes, experience)
└── public/               # Static assets
\`\`\`

## Adding Blog Posts

Blog posts are stored in `lib/data.ts` in the `blogPosts` array.

### Step 1: Add a new blog post object

\`\`\`typescript
// lib/data.ts
export const blogPosts: BlogPost[] = [
  {
    slug: "your-post-slug",           // URL-friendly identifier (lowercase, hyphens)
    title: "Your Blog Post Title",
    excerpt: "A brief 1-2 sentence summary of your post.",
    content: `
# Your Blog Post Title

Your markdown content goes here...

## Subheading

More content...

\`\`\`bash
# Code blocks are supported
echo "Hello World"
\`\`\`
    `,
    publishedAt: "2024-03-20",         // YYYY-MM-DD format
    tags: ["DevOps", "Kubernetes"],    // Array of relevant tags
    readingTime: "5 min read",         // Estimated reading time
  },
  // ... existing posts
];
\`\`\`

### Step 2: Content Guidelines

- Use Markdown syntax for formatting
- Include code blocks with language specification: \`\`\`language
- Keep excerpts under 200 characters
- Use 3-5 relevant tags per post
- Estimate reading time (roughly 200 words per minute)

## Adding Notes

Notes are quick references stored in `lib/data.ts` in the `notes` array.

### Step 1: Add a new note object

\`\`\`typescript
// lib/data.ts
export const notes: Note[] = [
  {
    slug: "your-note-slug",            // URL-friendly identifier
    title: "Your Note Title",
    category: "Kubernetes",            // Category for grouping
    content: `
# Your Note Title

Quick reference content...

## Commands

\`\`\`bash
kubectl get pods
\`\`\`
    `,
    updatedAt: "2024-03-20",           // Last update date
  },
  // ... existing notes
];
\`\`\`

### Step 2: Categories

Current categories include:
- Kubernetes
- Golang
- Terraform
- Docker
- AWS
- CI/CD

Feel free to add new categories as needed.

## Adding Projects

Projects are stored in `lib/data.ts` in the `projects` array.

### Step 1: Add a new project object

\`\`\`typescript
// lib/data.ts
export const projects: Project[] = [
  {
    id: "project-id",                  // Unique identifier
    title: "Project Title",
    description: "Short description (1-2 sentences).",
    longDescription: "Detailed description of the project...",
    technologies: ["Kubernetes", "Terraform", "AWS"],
    challenges: [
      "Challenge 1",
      "Challenge 2",
    ],
    outcomes: [
      "Outcome 1",
      "Outcome 2",
    ],
    links: {
      github: "https://github.com/...",     // Optional
      demo: "https://demo.example.com",     // Optional
      docs: "https://docs.example.com",     // Optional
    },
    image: "/project-image.jpg",       // Path to project image
    featured: true,                    // Show in featured section
  },
  // ... existing projects
];
\`\`\`

### Step 2: Adding Project Images

1. Add your image to the `public/` directory
2. Reference it as `/your-image.jpg` in the `image` field
3. Recommended dimensions: 1200x630 pixels (16:9 ratio)

## Adding Experience

Experience entries are stored in `lib/data.ts` in the `experiences` array.

### Step 1: Add a new experience object

\`\`\`typescript
// lib/data.ts
export const experiences: Experience[] = [
  {
    id: "experience-id",
    role: "Senior DevOps Engineer",
    company: "Company Name",
    companyUrl: "https://company.com",     // Optional
    location: "City, State",
    startDate: "2022-01",                  // YYYY-MM format
    endDate: null,                         // null for current position
    description: "Brief role description...",
    achievements: [
      "Achievement 1",
      "Achievement 2",
    ],
    technologies: ["Kubernetes", "AWS", "Terraform"],
  },
  // ... existing experiences
];
\`\`\`

### Step 2: Guidelines

- List experiences in reverse chronological order (newest first)
- Use `null` for `endDate` if it's your current position
- Include 3-5 key achievements per role
- List technologies actually used in that role

## Styling Guidelines

### Tailwind CSS Classes

This project uses Tailwind CSS with custom design tokens:

- `text-foreground` - Primary text color
- `text-muted-foreground` - Secondary/muted text
- `bg-background` - Main background
- `bg-muted` - Muted background sections
- `text-primary` - Accent/primary color (cyan)
- `glass` - Glassmorphism effect

### Component Patterns

- Use `motion` from framer-motion for animations
- Apply `glass` class for glassmorphic cards
- Use `TechBadge` component for technology tags

## Development

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
\`\`\`

## Questions?

If you have questions about contributing, please open an issue or reach out directly.
