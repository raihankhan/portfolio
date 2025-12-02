"use client"

import { useMemo } from "react"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const html = useMemo(() => {
    let processed = content

    // Code blocks with syntax highlighting styling
    processed = processed.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      const language = lang || "plaintext"
      return `<div class="relative my-6 rounded-lg overflow-hidden">
          <div class="flex items-center justify-between bg-muted px-4 py-2 text-xs text-muted-foreground">
            <span>${language}</span>
          </div>
          <pre class="overflow-x-auto bg-[#0d0d12] p-4"><code class="text-sm font-mono text-foreground">${escapeHtml(
            code.trim(),
          )}</code></pre>
        </div>`
    })

    // Inline code
    processed = processed.replace(
      /`([^`]+)`/g,
      '<code class="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-primary">$1</code>',
    )

    // Headers
    processed = processed.replace(/^### (.+)$/gm, '<h3 class="mt-8 mb-4 text-xl font-semibold text-foreground">$1</h3>')
    processed = processed.replace(
      /^## (.+)$/gm,
      '<h2 class="mt-10 mb-4 text-2xl font-semibold text-foreground">$1</h2>',
    )
    processed = processed.replace(/^# (.+)$/gm, '<h1 class="mt-10 mb-6 text-3xl font-bold text-foreground">$1</h1>')

    // Bold and italic
    processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    processed = processed.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')

    // Lists
    processed = processed.replace(/^- (.+)$/gm, '<li class="ml-4 text-muted-foreground">$1</li>')
    processed = processed.replace(
      /(<li[^>]*>.*<\/li>\n?)+/g,
      '<ul class="my-4 space-y-2 list-disc list-inside">$&</ul>',
    )

    // Paragraphs (lines that don't start with special characters)
    processed = processed.replace(
      /^(?!<[a-z]|#|\*|-|`)(.+)$/gm,
      '<p class="my-4 text-muted-foreground leading-relaxed">$1</p>',
    )

    // Links
    processed = processed.replace(
      /\[([^\]]+)\]$$([^)]+)$$/g,
      '<a href="$2" class="text-primary underline hover:no-underline" target="_blank" rel="noopener noreferrer">$1</a>',
    )

    return processed
  }, [content])

  return <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}
