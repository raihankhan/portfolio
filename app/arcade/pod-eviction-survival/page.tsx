"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BackToArcadeButton } from "@/components/game-console/game-ui"
import { GameCanvas } from "@/components/games/pod-eviction/game-canvas"
import { RotateCcw, Play, Shield, Clock, Zap } from "lucide-react"

export default function PodEvictionSurvivalPage() {
  const [gameState, setGameState] = useState<"menu" | "playing" | "paused" | "gameover">("menu")
  const [finalScore, setFinalScore] = useState(0)
  const [highScore, setHighScore] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem("pod-eviction-high-score")
    if (saved) setHighScore(Number.parseInt(saved))
  }, [])

  const handleGameOver = (score: number) => {
    setFinalScore(score)
    if (score > highScore) {
      setHighScore(score)
    }
    setGameState("gameover")
  }

  const startGame = () => {
    setGameState("playing")
  }

  const restartGame = () => {
    setFinalScore(0)
    setGameState("playing")
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Escape") {
        if (gameState === "playing") {
          setGameState("paused")
        } else if (gameState === "paused") {
          setGameState("playing")
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameState])

  return (
    <div className="relative min-h-screen px-6 py-24">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <BackToArcadeButton />
        </motion.div>

        {/* Game Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
          <h1 className="mb-2 text-2xl font-bold text-foreground">Pod Eviction Survival</h1>
          <p className="text-sm text-muted-foreground">Avoid eviction events, collect power-ups</p>
        </motion.div>

        {/* Game Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mx-auto"
          style={{ width: 400 }}
        >
          <GameCanvas
            onGameOver={handleGameOver}
            gameStarted={gameState === "playing"}
            isPaused={gameState === "paused"}
          />

          {/* Menu Overlay */}
          <AnimatePresence>
            {gameState === "menu" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 flex items-center justify-center rounded-2xl bg-background/90 backdrop-blur-md"
              >
                <div className="text-center">
                  {/* K8s logo */}
                  <motion.div
                    className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <svg viewBox="0 0 24 24" className="h-10 w-10 text-primary" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </motion.div>

                  <h2 className="mb-4 text-xl font-bold text-foreground">Pod Eviction Survival</h2>

                  {/* Instructions */}
                  <div className="mb-6 space-y-2 text-left text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <span className="text-destructive">●</span> Avoid eviction events
                    </p>
                    <p className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-cyan-400" /> CPU Shield (3s protection)
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-400" /> Memory Slow (4s slow-mo)
                    </p>
                    <p className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-green-400" /> Storage Boost (2x score)
                    </p>
                  </div>

                  <motion.button
                    onClick={startGame}
                    className="flex items-center gap-2 rounded-xl border border-primary/50 bg-primary/10 px-8 py-3 font-medium text-primary transition-colors hover:bg-primary/20"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="h-5 w-5" />
                    Start Game
                  </motion.button>

                  <p className="mt-4 text-xs text-muted-foreground">Arrow Keys / WASD / Mouse to move</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pause Overlay */}
          <AnimatePresence>
            {gameState === "paused" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 flex items-center justify-center rounded-2xl bg-background/80 backdrop-blur-sm"
              >
                <div className="text-center">
                  <h2 className="mb-4 text-2xl font-bold text-foreground">Paused</h2>
                  <p className="mb-6 text-sm text-muted-foreground">Press Space or Escape to resume</p>
                  <motion.button
                    onClick={() => setGameState("playing")}
                    className="rounded-xl border border-primary/50 bg-primary/10 px-6 py-2 font-medium text-primary transition-colors hover:bg-primary/20"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Resume
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Game Over Overlay */}
          <AnimatePresence>
            {gameState === "gameover" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 flex items-center justify-center rounded-2xl bg-background/90 backdrop-blur-md"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-2xl border border-destructive/30 bg-card/90 p-8 text-center backdrop-blur-xl"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20"
                  >
                    <span className="text-3xl">💥</span>
                  </motion.div>

                  <h2 className="mb-2 text-2xl font-bold text-destructive">Evicted!</h2>

                  {finalScore >= highScore && finalScore > 0 && (
                    <motion.p
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mb-4 text-sm font-medium text-primary"
                    >
                      New High Score!
                    </motion.p>
                  )}

                  <p className="mb-1 text-5xl font-bold text-foreground">{finalScore}</p>
                  <p className="mb-6 text-sm text-muted-foreground">points survived</p>

                  <motion.button
                    onClick={restartGame}
                    className="flex items-center gap-2 rounded-xl border border-primary/50 bg-primary/10 px-6 py-3 font-medium text-primary transition-colors hover:bg-primary/20"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Try Again
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Controls hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-muted-foreground">Arrow Keys / WASD / Mouse to move • Space to pause</p>
        </motion.div>
      </div>
    </div>
  )
}
