"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"

interface GameCardProps {
  title: string
  tagline: string
  href: string
  icon: LucideIcon
  index: number
}

export function GameCard({ title, tagline, href, icon: Icon, index }: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={href}>
        <motion.div
          className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-xl transition-colors"
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Glow effect on hover */}
          <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
          </div>

          <div className="relative z-10">
            {/* Icon */}
            <motion.div
              className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary"
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Icon className="h-7 w-7" />
            </motion.div>

            {/* Title */}
            <h3 className="mb-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
              {title}
            </h3>

            {/* Tagline */}
            <p className="text-sm text-muted-foreground">{tagline}</p>

            {/* Play indicator */}
            <div className="mt-4 flex items-center gap-2 text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
              <span>Play now</span>
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}>
                →
              </motion.span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
