"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { AnimatedBackground } from "@/components/animated-background"
import { Dock } from "@/components/dock/dock"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <>
      <AnimatedBackground />
      <Dock />

      <main className="min-h-screen flex items-center justify-center px-6 pb-32 pt-20 md:px-12 lg:px-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="text-8xl font-bold gradient-text mb-4"
          >
            404
          </motion.div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-lg glass px-6 py-3 text-sm font-medium text-foreground transition-colors glass-hover"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>
        </motion.div>
      </main>
    </>
  )
}
