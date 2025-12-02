"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BackToArcadeButton } from "@/components/game-console/game-ui"
import { GameLoop } from "@/components/games/autoscaler/game-loop"
import { RotateCcw, Play, Zap, Clock, Server, MousePointerClick, Keyboard } from "lucide-react"

export default function AutoscalerRampagePage() {
  const [gameState, setGameState] = useState<"menu" | "playing" | "paused" | "gameover">("menu")
  const [finalScore, setFinalScore] = useState(0)
  const [highScore, setHighScore] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem("autoscaler-rampage-high-score")
    if (saved) setHighScore(Number.parseInt(saved))
  }, [])

  const handleGameOver = (score: number) => {
    setFinalScore(score)
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem("autoscaler-rampage-high-score", score.toString())
    }
    setGameState("gameover")
  }

  const startGame = () => setGameState("playing")
  const restartGame = () => {
    setFinalScore(0)
    setGameState("playing")
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Escape") {
        if (gameState === "playing") setGameState("paused")
        else if (gameState === "paused") setGameState("playing")
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameState])

  return (
    <div className="relative min-h-screen px-6 py-24">
      <div className="mx-auto max-w-lg">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <BackToArcadeButton />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
          <h1 className="mb-2 text-2xl font-bold text-foreground">Cluster Autoscaler Rampage</h1>
          <p className="text-sm text-muted-foreground">Scale nodes to handle incoming jobs</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mx-auto"
          style={{ width: 400 }}
        >
          <GameLoop
            onGameOver={handleGameOver}
            gameStarted={gameState === "playing"}
            isPaused={gameState === "paused"}
          />

          <AnimatePresence>
            {gameState === "menu" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 flex items-center justify-center overflow-y-auto rounded-2xl bg-background/95 p-4 backdrop-blur-md"
              >
                <div className="w-full max-w-sm text-center">
                  <motion.div
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Server className="h-8 w-8 text-primary" />
                  </motion.div>

                  <h2 className="mb-2 text-xl font-bold text-foreground">Cluster Autoscaler Rampage</h2>
                  <p className="mb-4 text-xs text-muted-foreground">
                    Manage your Kubernetes cluster by adding nodes to process incoming jobs!
                  </p>

                  {/* How to Play Section */}
                  <div className="mb-4 rounded-xl border border-border/50 bg-card/50 p-3 text-left">
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Keyboard className="h-4 w-4 text-primary" />
                      How to Play
                    </h3>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>Jobs (colored blocks) fall from above continuously</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>Each node at the bottom can hold up to 4 jobs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>
                          Click the <strong className="text-foreground">+ Add Node</strong> button to add more capacity
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>Adding nodes has a 3-second cooldown and costs 5 points</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                        <span>
                          <strong className="text-destructive">Game Over</strong> when a job lands with no available
                          node capacity
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Power-ups Section */}
                  <div className="mb-4 rounded-xl border border-border/50 bg-card/50 p-3 text-left">
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                      <MousePointerClick className="h-4 w-4 text-primary" />
                      Power-ups (Click to Collect)
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md border border-green-500/50 bg-green-500/20">
                          <Zap className="h-4 w-4 text-green-400" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-green-400">Scale Up Burst</p>
                          <p className="text-xs text-muted-foreground">Instantly adds 3 nodes (+10 pts)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-purple-500/10 p-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md border border-purple-500/50 bg-purple-500/20">
                          <Clock className="h-4 w-4 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-purple-400">Job Throttle</p>
                          <p className="text-xs text-muted-foreground">Slows falling speed for 5 seconds (+5 pts)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="mb-4 flex justify-center gap-4 text-xs text-muted-foreground">
                    <span className="rounded-md border border-border/50 bg-card/50 px-2 py-1">
                      <kbd className="font-mono text-foreground">Space</kbd> Pause
                    </span>
                    <span className="rounded-md border border-border/50 bg-card/50 px-2 py-1">
                      <kbd className="font-mono text-foreground">Esc</kbd> Pause
                    </span>
                  </div>

                  <motion.button
                    onClick={startGame}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/50 bg-primary/10 px-8 py-3 font-medium text-primary transition-colors hover:bg-primary/20"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play className="h-5 w-5" />
                    Start Game
                  </motion.button>

                  {highScore > 0 && <p className="mt-3 text-sm text-muted-foreground">High Score: {highScore}</p>}
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
                  <motion.button
                    onClick={() => setGameState("playing")}
                    className="rounded-xl border border-primary/50 bg-primary/10 px-6 py-2 font-medium text-primary"
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
                  className="rounded-2xl border border-destructive/30 bg-card/90 p-8 text-center backdrop-blur-xl"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20"
                  >
                    <Server className="h-8 w-8 text-destructive" />
                  </motion.div>

                  <h2 className="mb-2 text-2xl font-bold text-destructive">Cluster Overloaded!</h2>
                  <p className="mb-4 text-sm text-muted-foreground">No node capacity available for incoming job</p>

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
                  <p className="mb-6 text-sm text-muted-foreground">jobs processed</p>

                  <motion.button
                    onClick={restartGame}
                    className="flex items-center gap-2 rounded-xl border border-primary/50 bg-primary/10 px-6 py-3 font-medium text-primary"
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-muted-foreground">Click power-ups as they fall to collect them</p>
        </motion.div>
      </div>
    </div>
  )
}
