import type { Metadata } from "next"
import { blogPosts, experiences, projects, skills } from "./data"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://raihankhan.dev"

// Person schema for SEO
export function generatePersonSchema(): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Raihan Khan",
    jobTitle: "Senior Platform Engineer",
    description:
      "Senior Platform Engineer specializing in Kubernetes, cloud infrastructure, GitOps, security, and internal developer platforms that scale teams and systems reliably.",
    url: BASE_URL,
    sameAs: [
      "https://github.com/raihankhan",
      "https://linkedin.com/in/raihankhan",
      "https://twitter.com/raihankhan",
    ],
    knowsAbout: skills.map((s) => s.name),
    alumniOf: [
      {
        "@type": "EducationalOrganization",
        name: "Cloud Native Computing Foundation",
      },
    ],
  }
  return JSON.stringify(schema)
}

// Blog post schema
export function generateBlogPostSchema(slug: string) {
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return null

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: "Raihan Khan",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Raihan Khan",
    },
    url: `${BASE_URL}/blog/${slug}`,
    keywords: post.tags.join(", "),
    articleBody: post.content.slice(0, 500),
  }
  return JSON.stringify(schema)
}

// Organization schema
export function generateOrganizationSchema(): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Raihan Khan Portfolio",
    url: BASE_URL,
    founder: {
      "@type": "Person",
      name: "Raihan Khan",
    },
    description: "Technical portfolio showcasing platform engineering expertise",
  }
  return JSON.stringify(schema)
}

// Breadcrumb schema
export function generateBreadcrumbSchema(items: { name: string; url: string }[]): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
  return JSON.stringify(schema)
}

// Website schema
export function generateWebsiteSchema(): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Raihan Khan - Senior Platform Engineer",
    url: BASE_URL,
    description:
      "Portfolio of Raihan Khan, a Senior Platform Engineer specializing in Kubernetes, cloud infrastructure, and developer platforms.",
    author: {
      "@type": "Person",
      name: "Raihan Khan",
    },
    about: {
      "@type": "Person",
      name: "Raihan Khan",
      jobTitle: "Senior Platform Engineer",
    },
    keywords: "platform engineering, kubernetes, devops, aws, terraform, golang",
  }
  return JSON.stringify(schema)
}

// Generate sitemap XML
export function generateSitemap(): string {
  const staticPages = [
    { url: BASE_URL, priority: "1.0", changefreq: "weekly" },
    { url: `${BASE_URL}/projects`, priority: "0.9", changefreq: "weekly" },
    { url: `${BASE_URL}/blog`, priority: "0.9", changefreq: "weekly" },
    { url: `${BASE_URL}/notes`, priority: "0.8", changefreq: "monthly" },
    { url: `${BASE_URL}/experience`, priority: "0.8", changefreq: "monthly" },
    { url: `${BASE_URL}/contact`, priority: "0.7", changefreq: "yearly" },
  ]

  const projectPages = projects.map((p) => ({
    url: `${BASE_URL}/projects/${p.id}`,
    priority: "0.8",
    changefreq: "monthly",
  }))

  const blogPages = blogPosts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    priority: "0.7",
    changefreq: "monthly",
  }))

  const allPages = [...staticPages, ...projectPages, ...blogPages]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`
}

// Generate RSS feed XML
export function generateRSSFeed(): string {
  const items = blogPosts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid>${BASE_URL}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <author>noreply@raihankhan.dev (Raihan Khan)</author>
      ${post.tags.map((tag) => `<category>${tag}</category>`).join("\n      ")}
    </item>`
    )
    .join("")

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Raihan Khan - Technical Blog</title>
    <link>${BASE_URL}/blog</link>
    <description>Technical articles on platform engineering, Kubernetes, GitOps, and cloud infrastructure.</description>
    <language>en-us</language>
    <managingEditor>noreply@raihankhan.dev (Raihan Khan)</managingEditor>
    <webMaster>noreply@raihankhan.dev (Raihan Khan)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`
}

// Social metadata
export function generateOpenGraph(title: string, description: string, image?: string) {
  return {
    openGraph: {
      title: `${title} | Raihan Khan`,
      description,
      url: BASE_URL,
      siteName: "Raihan Khan Portfolio",
      images: [
        {
          url: image || `${BASE_URL}/og-default.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Raihan Khan`,
      description,
      images: [image || `${BASE_URL}/og-default.png`],
      creator: "@raihankhan",
    },
  }
}