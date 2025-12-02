"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FileText, Calendar } from "lucide-react"
import type { Note } from "@/lib/data"

interface NoteCardProps {
  note: Note
  index: number
}

export function NoteCard({ note, index }: NoteCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <Link href={`/notes/${note.slug}`}>
        <div className="rounded-xl glass p-5 transition-all glass-hover">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-primary uppercase tracking-wider">{note.category}</span>
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {note.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Updated{" "}
                {new Date(note.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
