"use client"

import { motion } from "framer-motion"
import { Shield, Clock, Zap } from "lucide-react"

export type PowerUpType = "CPU" | "Memory" | "Storage"

interface PowerUpProps {
  id: string
  type: PowerUpType
  x: number
  y: number
  size: number
}

const powerUpConfig: Record<PowerUpType, { icon: typeof Shield; color: string; glow: string }> = {
  CPU: { icon: Shield, color: "#22d3ee", glow: "#22d3ee" },
  Memory: { icon: Clock, color: "#a78bfa", glow: "#a78bfa" },
  Storage: { icon: Zap, color: "#4ade80", glow: "#4ade80" },
}

export function PowerUp({ type, x, y, size }: PowerUpProps) {
  const config = powerUpConfig[type]
  const Icon = config.icon

  return (
    <motion.div
      className="absolute flex items-center justify-center rounded-full border-2 bg-card/80 backdrop-blur-sm"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        borderColor: config.color,
        boxShadow: `0 0 16px ${config.glow}, 0 0 32px ${config.glow}40`,
      }}
      animate={{
        scale: [1, 1.15, 1],
        boxShadow: [
          `0 0 16px ${config.glow}, 0 0 32px ${config.glow}40`,
          `0 0 24px ${config.glow}, 0 0 48px ${config.glow}60`,
          `0 0 16px ${config.glow}, 0 0 32px ${config.glow}40`,
        ],
      }}
      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
    >
      <Icon className="h-4 w-4" style={{ color: config.color }} />
    </motion.div>
  )
}
