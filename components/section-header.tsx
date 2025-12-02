"use client"

import { motion } from "framer-motion"

interface SectionHeaderProps {
  title: string
  description?: string
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">{title}</h1>
      {description && <p className="mt-4 text-lg text-muted-foreground max-w-2xl">{description}</p>}
    </motion.div>
  )
}
