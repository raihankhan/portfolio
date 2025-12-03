"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Palette, Check } from "lucide-react"
import { useTheme } from "./theme-provider"
import { themeList, type ThemeName } from "@/lib/themes"

export function ThemeSwitcher() {
  const { theme, setTheme, mounted } = useTheme()
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

  const getThemePreviewColor = (themeName: ThemeName) => {
    const colors: Record<ThemeName, string> = {
      "aura-blue": "#22d3ee",
      "electric-purple": "#a855f7",
      "emerald-green": "#10b981",
      "solar-orange": "#f97316",
      "mossy-hollow": "#bac095",
    }
    return colors[themeName]
  }

  if (!mounted) {
    return null
  }

  return (
    <div ref={containerRef} className="fixed right-4 top-4 z-50">
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-card/80 backdrop-blur-xl transition-colors hover:bg-card"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Change theme"
        aria-expanded={isOpen}
      >
        <Palette className="h-4 w-4 text-foreground/80" />
      </motion.button>

      {/* Popover Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute right-0 top-14 w-56 origin-top-right overflow-hidden rounded-xl border border-border/50 bg-popover/80 p-2 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-2 px-2 py-1">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Theme</span>
            </div>

            <div className="space-y-1">
              {themeList.map((t) => (
                <motion.button
                  key={t.name}
                  onClick={() => {
                    setTheme(t.name)
                    setIsOpen(false)
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                    theme === t.name ? "bg-primary/10" : "hover:bg-muted/50"
                  }`}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Color preview circle */}
                  <motion.div
                    className="relative flex h-5 w-5 items-center justify-center rounded-full"
                    style={{ backgroundColor: getThemePreviewColor(t.name) }}
                    layoutId={`theme-circle-${t.name}`}
                  >
                    <AnimatePresence>
                      {theme === t.name && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <Check className="h-3 w-3 text-background" strokeWidth={3} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Theme label */}
                  <span
                    className={`text-sm ${theme === t.name ? "font-medium text-foreground" : "text-foreground/80"}`}
                  >
                    {t.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
