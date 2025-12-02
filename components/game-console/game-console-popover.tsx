"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Gamepad2, Joystick } from "lucide-react"
import Link from "next/link"

export function GameConsolePopover() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen])

  return (
    <div ref={containerRef} className="fixed right-16 top-4 z-50">
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-card/80 backdrop-blur-xl transition-colors hover:bg-card"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open game console"
        aria-expanded={isOpen}
      >
        <Gamepad2 className="h-4 w-4 text-foreground/80" />
      </motion.button>

      {/* Popover Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute right-0 top-14 w-64 origin-top-right overflow-hidden rounded-xl border border-border/50 bg-popover/80 p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-3 flex items-center gap-2">
              <Gamepad2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Game Console</span>
            </div>

            <p className="mb-4 text-xs text-muted-foreground">Take a break and enjoy some classic games!</p>

            <Link href="/arcade" onClick={() => setIsOpen(false)}>
              <motion.div
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Joystick className="h-4 w-4" />
                <span>Open Game Arcade</span>
              </motion.div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
