"use client"

import { useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Search, X, FileText, BookOpen, ArrowRight, Clock } from "lucide-react"
import { blogPosts, notes } from "@/lib/data"

interface SearchResult {
  type: "blog" | "note"
  id: string
  title: string
  excerpt: string
  content: string
  url: string
  category?: string
  tags?: string[]
  updatedAt?: string
}

export function SearchDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("")
  const [selectedType, setSelectedType] = useState<"all" | "blog" | "note">("all")

  const allContent: SearchResult[] = useMemo(() => {
    const blogs: SearchResult[] = blogPosts.map((post) => ({
      type: "blog",
      id: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      url: `/blog/${post.slug}`,
      tags: post.tags,
    }))

    const notesContent: SearchResult[] = notes.map((note) => ({
      type: "note",
      id: note.slug,
      title: note.title,
      excerpt: note.category,
      content: note.content,
      url: `/notes/${note.slug}`,
      category: note.category,
      updatedAt: note.updatedAt,
    }))

    return [...blogs, ...notesContent]
  }, [])

  const searchResults = useMemo(() => {
    if (!query.trim()) return []

    const lowerQuery = query.toLowerCase()
    const words = lowerQuery.split(/\s+/).filter((w) => w.length > 2)

    return allContent
      .filter((item) => {
        if (selectedType !== "all" && item.type !== selectedType) return false

        const searchText = `${item.title} ${item.excerpt} ${item.content} ${item.tags?.join(" ") || ""} ${item.category || ""}`.toLowerCase()

        // Match all words or just title
        const allWordsMatch = words.every((word) => searchText.includes(word))
        const titleMatch = item.title.toLowerCase().includes(lowerQuery)

        return allWordsMatch || titleMatch
      })
      .map((item) => {
        // Calculate relevance score
        const titleLower = item.title.toLowerCase()
        const excerptLower = item.excerpt.toLowerCase()

        let score = 0
        if (titleLower.includes(lowerQuery)) score += 10
        if (excerptLower.includes(lowerQuery)) score += 5
        words.forEach((word) => {
          if (titleLower.includes(word)) score += 3
          if (excerptLower.includes(word)) score += 1
        })

        return { ...item, score }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
  }, [query, selectedType, allContent])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    },
    [onClose],
  )

  const highlightMatch = (text: string, maxLength = 150) => {
    if (!query.trim()) return text.slice(0, maxLength) + (text.length > maxLength ? "..." : "")

    // Extract a snippet around the match
    const lowerText = text.toLowerCase()
    const lowerQuery = query.toLowerCase()
    const matchIndex = lowerText.indexOf(lowerQuery)

    if (matchIndex === -1) {
      return text.slice(0, maxLength) + (text.length > maxLength ? "..." : "")
    }

    const start = Math.max(0, matchIndex - 50)
    const end = Math.min(text.length, matchIndex + query.length + 100)
    let snippet = text.slice(start, end)

    if (start > 0) snippet = "..." + snippet
    if (end < text.length) snippet = snippet + "..."

    return snippet
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 mx-4"
            onKeyDown={handleKeyDown}
          >
            <div className="rounded-xl glass overflow-hidden shadow-2xl">
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-border">
                <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search blog posts and notes..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
                  autoFocus
                />
                <button
                  onClick={onClose}
                  className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30">
                {(["all", "blog", "note"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      selectedType === type
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {type === "all" ? "All" : type === "blog" ? "Blog Posts" : "Notes"}
                  </button>
                ))}
              </div>

              {/* Results */}
              <div className="max-h-[400px] overflow-y-auto">
                {query.trim() === "" ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Start typing to search...</p>
                    <p className="text-xs mt-1">Search through blog posts and engineering notes</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <p>No results found for &ldquo;{query}&rdquo;</p>
                    <p className="text-xs mt-1">Try different keywords or check spelling</p>
                  </div>
                ) : (
                  <div className="p-2">
                    {searchResults.map((result, index) => (
                      <motion.div
                        key={`${result.type}-${result.id}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={result.url}
                          onClick={onClose}
                          className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            {result.type === "blog" ? (
                              <BookOpen className="h-5 w-5 text-primary" />
                            ) : (
                              <FileText className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-foreground truncate">{result.title}</h4>
                              <span className="text-xs text-muted-foreground capitalize">{result.type}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {highlightMatch(result.content)}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              {result.tags && result.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {result.tags.slice(0, 3).map((tag) => (
                                    <span
                                      key={tag}
                                      className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {result.category && (
                                <span className="text-xs text-muted-foreground">{result.category}</span>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-2" />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{searchResults.length} results</span>
                  {query && <span>for &ldquo;{query}&rdquo;</span>}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <kbd className="px-1.5 py-0.5 rounded bg-muted">Esc</kbd>
                  <span>to close</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Hook for keyboard shortcut
export function useSearch() {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return { isOpen, open, close, toggle }
}