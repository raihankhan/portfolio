"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type ThemeName, themes } from "@/lib/themes"

interface ThemeContextType {
  theme: ThemeName
  setTheme: (theme: ThemeName) => void
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_STORAGE_KEY = "portfolio-theme"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("aura-blue")
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null
    if (stored && themes[stored]) {
      setThemeState(stored)
    }
    setMounted(true)
  }, [])

  // Apply theme CSS variables
  useEffect(() => {
    if (!mounted) return

    const currentTheme = themes[theme]
    const root = document.documentElement

    // Set data attribute for CSS targeting
    root.setAttribute("data-theme", theme)

    // Apply CSS variables
    root.style.setProperty("--primary", currentTheme.colors.primary)
    root.style.setProperty("--secondary", currentTheme.colors.secondary)
    root.style.setProperty("--accent", currentTheme.colors.accent)
    root.style.setProperty("--ring", currentTheme.colors.primary)
    root.style.setProperty("--sidebar-primary", currentTheme.colors.primary)
    root.style.setProperty("--sidebar-ring", currentTheme.colors.primary)
    root.style.setProperty("--chart-1", currentTheme.colors.primary)
    root.style.setProperty("--chart-2", currentTheme.colors.secondary)
    root.style.setProperty("--chart-3", currentTheme.colors.accent)

    // Theme gradient colors for animated background
    root.style.setProperty("--theme-gradient-1", currentTheme.colors.gradient1)
    root.style.setProperty("--theme-gradient-2", currentTheme.colors.gradient2)
    root.style.setProperty("--theme-gradient-3", currentTheme.colors.gradient3)
  }, [theme, mounted])

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme)
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
  }

  return <ThemeContext.Provider value={{ theme, setTheme, mounted }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
