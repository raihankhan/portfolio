import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { ThemeSwitcher } from "@/components/theme/theme-switcher"
import { GameConsolePopover } from "@/components/game-console/game-console-popover"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
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
      <body className={`${inter.className} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <GameConsolePopover />
          <ThemeSwitcher />
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
