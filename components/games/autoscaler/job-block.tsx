"use client"

import { motion } from "framer-motion"

interface JobBlockProps {
  id: string
  x: number
  y: number
  color: string
  size: number
}

const k8sIcon = (
  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" opacity={0.8}>
    <path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4zm0 4l4 2v4l-4 2-4-2V8l4-2z" />
  </svg>
)

export function JobBlock({ id, x, y, color, size }: JobBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1, y }}
      className="absolute flex items-center justify-center rounded-md border"
      style={{
        left: x,
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}40, ${color}20)`,
        borderColor: `${color}60`,
        boxShadow: `0 0 12px ${color}30, inset 0 0 8px ${color}20`,
      }}
    >
      <div style={{ color }}>{k8sIcon}</div>
    </motion.div>
  )
}
