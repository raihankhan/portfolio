"use client"

import { motion } from "framer-motion"
import { Shield, Clock, Zap, Trophy } from "lucide-react"

interface GameHUDProps {
  score: number
  highScore: number
  multiplier: number
  activeBuffs: {
    shield: number
    slowMode: number
    multiplier: number
  }
}

export function GameHUD({ score, highScore, multiplier, activeBuffs }: GameHUDProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute left-1/2 top-4 z-10 flex -translate-x-1/2 items-center gap-4 rounded-xl border border-border/50 bg-card/70 px-6 py-3 backdrop-blur-xl"
    >
      {/* Score */}
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Score</p>
        <p className="text-2xl font-bold tabular-nums text-foreground">{Math.floor(score)}</p>
      </div>

      <div className="h-8 w-px bg-border/50" />

      {/* High Score */}
      <div className="flex items-center gap-2">
        <Trophy className="h-4 w-4 text-primary" />
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Best</p>
          <p className="text-lg font-semibold tabular-nums text-primary">{Math.floor(highScore)}</p>
        </div>
      </div>

      {/* Multiplier */}
      {multiplier > 1 && (
        <>
          <div className="h-8 w-px bg-border/50" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 rounded-md bg-green-500/20 px-2 py-1"
          >
            <Zap className="h-3 w-3 text-green-400" />
            <span className="text-sm font-bold text-green-400">x{multiplier.toFixed(1)}</span>
          </motion.div>
        </>
      )}

      {/* Active Buffs */}
      <div className="flex items-center gap-2">
        {activeBuffs.shield > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 rounded-md bg-cyan-500/20 px-2 py-1"
          >
            <Shield className="h-3 w-3 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400">{activeBuffs.shield.toFixed(1)}s</span>
          </motion.div>
        )}
        {activeBuffs.slowMode > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 rounded-md bg-purple-500/20 px-2 py-1"
          >
            <Clock className="h-3 w-3 text-purple-400" />
            <span className="text-xs font-mono text-purple-400">{activeBuffs.slowMode.toFixed(1)}s</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
