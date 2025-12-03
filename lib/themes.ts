export type ThemeName = "aura-blue" | "electric-purple" | "emerald-green" | "solar-orange" | "mossy-hollow"

export interface Theme {
  name: ThemeName
  label: string
  colors: {
    primary: string
    primaryHue: number
    secondary: string
    secondaryHue: number
    accent: string
    accentHue: number
    gradient1: string
    gradient2: string
    gradient3: string
  }
}

export const themes: Record<ThemeName, Theme> = {
  "aura-blue": {
    name: "aura-blue",
    label: "Aura Blue",
    colors: {
      primary: "oklch(0.78 0.15 195)",
      primaryHue: 195,
      secondary: "oklch(0.55 0.18 255)",
      secondaryHue: 255,
      accent: "oklch(0.65 0.17 160)",
      accentHue: 160,
      gradient1: "#22d3ee",
      gradient2: "#3b82f6",
      gradient3: "#10b981",
    },
  },
  "electric-purple": {
    name: "electric-purple",
    label: "Electric Purple",
    colors: {
      primary: "oklch(0.70 0.20 295)",
      primaryHue: 295,
      secondary: "oklch(0.60 0.22 330)",
      secondaryHue: 330,
      accent: "oklch(0.65 0.18 260)",
      accentHue: 260,
      gradient1: "#a855f7",
      gradient2: "#ec4899",
      gradient3: "#8b5cf6",
    },
  },
  "emerald-green": {
    name: "emerald-green",
    label: "Emerald Green",
    colors: {
      primary: "oklch(0.72 0.19 155)",
      primaryHue: 155,
      secondary: "oklch(0.65 0.15 175)",
      secondaryHue: 175,
      accent: "oklch(0.70 0.12 140)",
      accentHue: 140,
      gradient1: "#10b981",
      gradient2: "#14b8a6",
      gradient3: "#22c55e",
    },
  },
  "solar-orange": {
    name: "solar-orange",
    label: "Solar Orange",
    colors: {
      primary: "oklch(0.75 0.18 55)",
      primaryHue: 55,
      secondary: "oklch(0.65 0.20 25)",
      secondaryHue: 25,
      accent: "oklch(0.70 0.15 80)",
      accentHue: 80,
      gradient1: "#f97316",
      gradient2: "#ef4444",
      gradient3: "#eab308",
    },
  },
  "mossy-hollow": {
    name: "mossy-hollow",
    label: "Mossy Hollow",
    colors: {
      primary: "oklch(0.75 0.10 100)",
      primaryHue: 100,
      secondary: "oklch(0.65 0.12 120)",
      secondaryHue: 120,
      accent: "oklch(0.70 0.15 80)",
      accentHue: 80,
      gradient1: "#bac095",
      gradient2: "#8a9a5b",
      gradient3: "#556b2f",
    },
  },
}

export const themeList = Object.values(themes)
