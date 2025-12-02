import { blogPosts } from "@/lib/data"
import { notFound } from "next/navigation"
import { BlogPostPageClient } from "./blog-post-page-client"

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  return <BlogPostPageClient post={post} />
}
