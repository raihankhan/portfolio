"use client"

import { useState } from "react"
import { AnimatedBackground } from "@/components/animated-background"
import { Dock } from "@/components/dock/dock"
import { SectionHeader } from "@/components/section-header"
import { NoteCard } from "@/components/note-card"
import { notes } from "@/lib/data"

export default function NotesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Get all unique categories
  const categories = Array.from(new Set(notes.map((note) => note.category)))

  // Filter notes
  const filteredNotes = selectedCategory ? notes.filter((note) => note.category === selectedCategory) : notes

  // Group by category
  const groupedNotes = filteredNotes.reduce(
    (acc, note) => {
      if (!acc[note.category]) {
        acc[note.category] = []
      }
      acc[note.category].push(note)
      return acc
    },
    {} as Record<string, typeof notes>,
  )

  return (
    <>
      <AnimatedBackground />
      <Dock />

      <main className="min-h-screen px-6 pb-32 pt-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <SectionHeader
            title="Notes"
            description="Quick references, cheatsheets, and code snippets for Kubernetes, Go, Terraform, and more."
          />

          {/* Category Filters */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                !selectedCategory
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Notes Grid */}
          <div className="space-y-8">
            {Object.entries(groupedNotes).map(([category, categoryNotes]) => (
              <section key={category}>
                <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">{category}</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {categoryNotes.map((note, index) => (
                    <NoteCard key={note.slug} note={note} index={index} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
