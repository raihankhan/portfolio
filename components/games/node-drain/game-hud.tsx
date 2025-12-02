"use client"

import { motion } from "framer-motion"

interface GameHUDProps {
  score: number
  highScore: number
  round: number
  podsRemaining: number
}

export function NodeDrainHUD({ score, highScore, round, podsRemaining }: GameHUDProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card/60 p-3 backdrop-blur-xl">
      <div className="text-center">
        <p className="text-xs text-muted-foreground">Score</p>
        <p className="text-xl font-bold text-foreground">{score}</p>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">Round</p>
        <p className="text-xl font-bold text-primary">{round}</p>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">Pods</p>
        <motion.p
          key={podsRemaining}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          className="text-xl font-bold text-accent"
        >
          {podsRemaining}
        </motion.p>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">Best</p>
        <p className="text-lg font-medium text-muted-foreground">{highScore}</p>
      </div>
    </div>
  )
}
