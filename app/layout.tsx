import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono, Orbitron } from "next/font/google"

import { ThemeProvider } from "@/components/theme/theme-provider"
import { ThemeSwitcher } from "@/components/theme/theme-switcher"
import { GameConsolePopover } from "@/components/game-console/game-console-popover"
import { ConstellationField } from "@/components/effects/constellation-field/ConstellationField"
import "@/components/effects/constellation-field/styles.css"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
})

export const metadata: Metadata = {
  title: "Raihan Khan | Senior DevOps Engineer",
  description:
    "Senior DevOps Engineer specializing in cloud infrastructure, Kubernetes, CI/CD pipelines, and infrastructure as code. Building reliable, scalable systems.",
  keywords: ["DevOps", "Kubernetes", "AWS", "Terraform", "CI/CD", "Cloud Infrastructure", "Platform Engineering"],
  authors: [{ name: "Raihan Khan" }],
  generator: "v0.app",
  openGraph: {
    title: "Raihan Khan | Senior DevOps Engineer",
    description: "Senior DevOps Engineer specializing in cloud infrastructure and platform engineering.",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" data-theme="aura-blue">
      <body className={`${inter.className} ${jetbrainsMono.variable} ${orbitron.variable} font-sans antialiased`}>
        <ThemeProvider>
          <ConstellationField
            mode="dark"
            speed={1}
            size={1}
            strokeWidth={0.8}
            length={1}
            density={1}
            opacity={0.85}
          />
          <GameConsolePopover />
          <ThemeSwitcher />
          {children}
        </ThemeProvider>

      </body>
    </html>
  )
}
