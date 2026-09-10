"use client"

import { useCallback, useEffect } from "react"
import { Dock } from "./dock/dock"
import { SearchDialog, useSearch } from "./search-dialog"

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const { isOpen, open, close, toggle } = useSearch()

  // Global keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        toggle()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [toggle])

  return (
    <>
      {children}
      <Dock onOpenSearch={open} />
      <SearchDialog isOpen={isOpen} onClose={close} />
    </>
  )
}