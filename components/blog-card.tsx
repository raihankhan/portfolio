"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Calendar, Clock, ArrowUpRight } from "lucide-react"
import type { BlogPost } from "@/lib/data"

interface BlogCardProps {
  post: BlogPost
  index: number
}

export function BlogCard({ post, index }: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/blog/${post.slug}`}>
        <div className="rounded-xl glass p-6 transition-all glass-hover h-full">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readingTime}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="mt-2 text-muted-foreground line-clamp-2">{post.excerpt}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
