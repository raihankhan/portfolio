"use client"

import { motion } from "framer-motion"
import { Plus, Zap, Clock } from "lucide-react"

interface HUDProps {
  score: number
  nodeCount: number
  cooldown: number
  maxCooldown: number
  powerUps: { scaleUpBurst: number; jobThrottle: number }
  onAddNode: () => void
  canAddNode: boolean
}

export function AutoscalerHUD({ score, nodeCount, cooldown, maxCooldown, powerUps, onAddNode, canAddNode }: HUDProps) {
  const cooldownPercent = ((maxCooldown - cooldown) / maxCooldown) * 100

  return (
    <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card/60 p-3 backdrop-blur-xl">
      {/* Score */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">Score</p>
        <p className="text-xl font-bold text-foreground">{score}</p>
      </div>

      {/* Nodes */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">Nodes</p>
        <p className="text-xl font-bold text-primary">{nodeCount}</p>
      </div>

      {/* Power-ups */}
      <div className="flex gap-2">
        {powerUps.scaleUpBurst > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/20 text-green-400"
          >
            <Zap className="h-4 w-4" />
          </motion.div>
        )}
        {powerUps.jobThrottle > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400"
          >
            <Clock className="h-4 w-4" />
          </motion.div>
        )}
      </div>

      {/* Add Node Button */}
      <motion.button
        onClick={onAddNode}
        disabled={!canAddNode}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-primary/50 bg-primary/10 text-primary transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
        whileHover={canAddNode ? { scale: 1.05 } : {}}
        whileTap={canAddNode ? { scale: 0.95 } : {}}
      >
        <Plus className="h-5 w-5" />
        {/* Cooldown overlay */}
        {cooldown > 0 && (
          <div
            className="absolute inset-0 rounded-lg bg-background/80"
            style={{
              clipPath: `inset(${cooldownPercent}% 0 0 0)`,
            }}
          />
        )}
      </motion.button>
    </div>
  )
}
