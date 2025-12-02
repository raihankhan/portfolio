"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Calendar, BookOpen } from "lucide-react"
import { AnimatedBackground } from "@/components/animated-background"
import { Dock } from "@/components/dock/dock"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import type { Note } from "@/lib/data"

export function NotePageClient({ note }: { note: Note }) {
  return (
    <>
      <AnimatedBackground />
      <Dock />

      <main className="min-h-screen px-6 pb-32 pt-20 md:px-12 lg:px-24">
        <article className="mx-auto max-w-3xl">
          {/* Back Link */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
            <Link
              href="/notes"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Notes
            </Link>
          </motion.div>

          {/* Header */}
          <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <BookOpen className="h-3 w-3" />
                {note.category}
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{note.title}</h1>

            <p className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Last updated{" "}
              {new Date(note.updatedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </motion.header>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl glass p-6 md:p-8"
          >
            <MarkdownRenderer content={note.content} />
          </motion.div>
        </article>
      </main>
    </>
  )
}
