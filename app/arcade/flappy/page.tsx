"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { ScoreBoard, BackToArcadeButton, GameOverOverlay } from "@/components/game-console/game-ui"

const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 600
const BIRD_SIZE = 30
const PIPE_WIDTH = 60
const PIPE_GAP = 180
const GRAVITY = 0.4
const JUMP_FORCE = -8
const PIPE_SPEED = 3

interface Pipe {
  x: number
  topHeight: number
  passed: boolean
}

export default function FlappyPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)

  const birdRef = useRef({ y: CANVAS_HEIGHT / 2, velocity: 0 })
  const pipesRef = useRef<Pipe[]>([])
  const scoreRef = useRef(0)
  const animationRef = useRef<number | null>(null)

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem("flappy-high-score")
    if (saved) setHighScore(Number.parseInt(saved))
  }, [])

  const jump = useCallback(() => {
    if (gameOver) return
    if (!gameStarted) {
      setGameStarted(true)
    }
    birdRef.current.velocity = JUMP_FORCE
  }, [gameOver, gameStarted])

  // Handle input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault()
        jump()
      }
    }

    const handleClick = () => jump()
    const handleTouch = (e: TouchEvent) => {
      e.preventDefault()
      jump()
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("click", handleClick)
    window.addEventListener("touchstart", handleTouch, { passive: false })

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("click", handleClick)
      window.removeEventListener("touchstart", handleTouch)
    }
  }, [jump])

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const bird = birdRef.current
    const pipes = pipesRef.current

    const getThemeColors = () => {
      const computedStyle = getComputedStyle(document.documentElement)
      return {
        primary: computedStyle.getPropertyValue("--theme-gradient-1").trim() || "#22d3ee",
        secondary: computedStyle.getPropertyValue("--theme-gradient-2").trim() || "#3b82f6",
        bg: "#0a0a0f",
        pipe: "#1a1a2e",
      }
    }

    const gameLoop = () => {
      const colors = getThemeColors()

      // Clear canvas
      ctx.fillStyle = colors.bg
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Draw grid pattern
      ctx.strokeStyle = "rgba(255,255,255,0.02)"
      ctx.lineWidth = 1
      for (let i = 0; i < CANVAS_WIDTH; i += 32) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, CANVAS_HEIGHT)
        ctx.stroke()
      }
      for (let i = 0; i < CANVAS_HEIGHT; i += 32) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(CANVAS_WIDTH, i)
        ctx.stroke()
      }

      if (gameStarted && !gameOver) {
        // Update bird
        bird.velocity += GRAVITY
        bird.y += bird.velocity

        // Generate pipes
        if (pipes.length === 0 || pipes[pipes.length - 1].x < CANVAS_WIDTH - 200) {
          const topHeight = Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 100) + 50
          pipes.push({ x: CANVAS_WIDTH, topHeight, passed: false })
        }

        // Update pipes
        for (let i = pipes.length - 1; i >= 0; i--) {
          pipes[i].x -= PIPE_SPEED

          // Check collision
          const birdLeft = CANVAS_WIDTH / 2 - BIRD_SIZE / 2
          const birdRight = CANVAS_WIDTH / 2 + BIRD_SIZE / 2
          const birdTop = bird.y - BIRD_SIZE / 2
          const birdBottom = bird.y + BIRD_SIZE / 2

          const pipeLeft = pipes[i].x
          const pipeRight = pipes[i].x + PIPE_WIDTH

          if (birdRight > pipeLeft && birdLeft < pipeRight) {
            if (birdTop < pipes[i].topHeight || birdBottom > pipes[i].topHeight + PIPE_GAP) {
              setGameOver(true)
              const finalScore = scoreRef.current
              if (finalScore > highScore) {
                setHighScore(finalScore)
                localStorage.setItem("flappy-high-score", finalScore.toString())
              }
            }
          }

          // Score
          if (!pipes[i].passed && pipes[i].x + PIPE_WIDTH < CANVAS_WIDTH / 2 - BIRD_SIZE / 2) {
            pipes[i].passed = true
            scoreRef.current += 1
            setScore(scoreRef.current)
          }

          // Remove off-screen pipes
          if (pipes[i].x + PIPE_WIDTH < 0) {
            pipes.splice(i, 1)
          }
        }

        // Check floor/ceiling collision
        if (bird.y + BIRD_SIZE / 2 > CANVAS_HEIGHT || bird.y - BIRD_SIZE / 2 < 0) {
          setGameOver(true)
          const finalScore = scoreRef.current
          if (finalScore > highScore) {
            setHighScore(finalScore)
            localStorage.setItem("flappy-high-score", finalScore.toString())
          }
        }
      }

      // Draw pipes
      pipes.forEach((pipe) => {
        // Top pipe
        ctx.fillStyle = colors.pipe
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight)

        // Top pipe glow
        const gradient1 = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0)
        gradient1.addColorStop(0, colors.primary + "40")
        gradient1.addColorStop(1, "transparent")
        ctx.fillStyle = gradient1
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight)

        // Bottom pipe
        ctx.fillStyle = colors.pipe
        ctx.fillRect(pipe.x, pipe.topHeight + PIPE_GAP, PIPE_WIDTH, CANVAS_HEIGHT - pipe.topHeight - PIPE_GAP)

        // Bottom pipe glow
        ctx.fillStyle = gradient1
        ctx.fillRect(pipe.x, pipe.topHeight + PIPE_GAP, PIPE_WIDTH, CANVAS_HEIGHT - pipe.topHeight - PIPE_GAP)

        // Pipe borders
        ctx.strokeStyle = colors.primary
        ctx.lineWidth = 2
        ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight)
        ctx.strokeRect(pipe.x, pipe.topHeight + PIPE_GAP, PIPE_WIDTH, CANVAS_HEIGHT - pipe.topHeight - PIPE_GAP)
      })

      // Draw bird
      const gradient = ctx.createRadialGradient(CANVAS_WIDTH / 2, bird.y, 0, CANVAS_WIDTH / 2, bird.y, BIRD_SIZE)
      gradient.addColorStop(0, colors.primary)
      gradient.addColorStop(1, colors.secondary)

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(CANVAS_WIDTH / 2, bird.y, BIRD_SIZE / 2, 0, Math.PI * 2)
      ctx.fill()

      // Bird glow
      ctx.shadowColor = colors.primary
      ctx.shadowBlur = 20
      ctx.fill()
      ctx.shadowBlur = 0

      if (!gameOver) {
        animationRef.current = requestAnimationFrame(gameLoop)
      }
    }

    animationRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [gameStarted, gameOver, highScore])

  const restartGame = () => {
    birdRef.current = { y: CANVAS_HEIGHT / 2, velocity: 0 }
    pipesRef.current = []
    scoreRef.current = 0
    setScore(0)
    setGameOver(false)
    setGameStarted(true)
  }

  return (
    <div className="relative min-h-screen px-6 py-24">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <BackToArcadeButton />
          <ScoreBoard score={score} highScore={highScore} />
        </div>

        {/* Game Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mx-auto overflow-hidden rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl"
          style={{ width: CANVAS_WIDTH + 16, height: CANVAS_HEIGHT + 16, padding: 8 }}
        >
          <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="rounded-lg" />

          {/* Start Screen */}
          {!gameStarted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            >
              <div className="text-center">
                <h2 className="mb-4 text-2xl font-bold text-foreground">Flappy Bird</h2>
                <p className="mb-6 text-sm text-muted-foreground">Tap or press Space to start</p>
                <motion.div
                  className="mx-auto h-8 w-8 rounded-full bg-primary"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                />
              </div>
            </motion.div>
          )}

          {/* Game Over */}
          {gameOver && <GameOverOverlay score={score} highScore={highScore} onRestart={restartGame} />}
        </motion.div>

        {/* Controls hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-muted-foreground">Space / Click / Tap to jump</p>
        </motion.div>
      </div>
    </div>
  )
}
