"use client"

import { motion } from "framer-motion"
import { RotateCcw, ArrowLeft, Trophy } from "lucide-react"
import Link from "next/link"

interface ScoreBoardProps {
  score: number
  highScore?: number
  label?: string
}

export function ScoreBoard({ score, highScore, label = "Score" }: ScoreBoardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 rounded-xl border border-border/50 bg-card/60 px-6 py-3 backdrop-blur-xl"
    >
      <div className="text-center">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold text-foreground">{score}</p>
      </div>
      {highScore !== undefined && (
        <>
          <div className="h-8 w-px bg-border/50" />
          <div className="flex items-center gap-2 text-center">
            <Trophy className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Best</p>
              <p className="text-lg font-semibold text-primary">{highScore}</p>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}

interface RestartButtonProps {
  onRestart: () => void
  label?: string
}

export function RestartButton({ onRestart, label = "Restart" }: RestartButtonProps) {
  return (
    <motion.button
      onClick={onRestart}
      className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <RotateCcw className="h-4 w-4" />
      {label}
    </motion.button>
  )
}

export function BackToArcadeButton() {
  return (
    <Link href="/arcade">
      <motion.div
        className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/60 px-4 py-2 text-sm text-muted-foreground backdrop-blur-xl transition-colors hover:bg-card hover:text-foreground"
        whileHover={{ scale: 1.02, x: -4 }}
        whileTap={{ scale: 0.98 }}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Arcade
      </motion.div>
    </Link>
  )
}

interface GameOverOverlayProps {
  score: number
  highScore: number
  onRestart: () => void
  title?: string
}

export function GameOverOverlay({ score, highScore, onRestart, title = "Game Over" }: GameOverOverlayProps) {
  const isNewHighScore = score >= highScore && score > 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border/50 bg-card/80 p-8 text-center backdrop-blur-xl"
      >
        <h2 className="mb-2 text-2xl font-bold text-foreground">{title}</h2>

        {isNewHighScore && (
          <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-4 text-sm font-medium text-primary">
            New High Score!
          </motion.p>
        )}

        <p className="mb-1 text-4xl font-bold text-foreground">{score}</p>
        <p className="mb-6 text-sm text-muted-foreground">points</p>

        <RestartButton onRestart={onRestart} label="Play Again" />
      </motion.div>
    </motion.div>
  )
}
