"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { ScoreBoard, BackToArcadeButton, GameOverOverlay } from "@/components/game-console/game-ui"

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT"
type Position = { x: number; y: number }

const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SPEED = 150

export default function SnakePage() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }])
  const [food, setFood] = useState<Position>({ x: 15, y: 10 })
  const [direction, setDirection] = useState<Direction>("RIGHT")
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  const directionRef = useRef(direction)
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("snake-high-score")
    if (saved) setHighScore(Number.parseInt(saved))
  }, [])

  // Generate random food position
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      }
    } while (currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [])

  // Game loop
  const gameLoop = useCallback(() => {
    if (gameOver || isPaused) return

    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] }
      const currentDirection = directionRef.current

      switch (currentDirection) {
        case "UP":
          head.y -= 1
          break
        case "DOWN":
          head.y += 1
          break
        case "LEFT":
          head.x -= 1
          break
        case "RIGHT":
          head.x += 1
          break
      }

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true)
        return prevSnake
      }

      // Check self collision
      if (prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true)
        return prevSnake
      }

      const newSnake = [head, ...prevSnake]

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore((prev) => {
          const newScore = prev + 10
          if (newScore > highScore) {
            setHighScore(newScore)
            localStorage.setItem("snake-high-score", newScore.toString())
          }
          return newScore
        })
        setFood(generateFood(newSnake))
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [food, gameOver, isPaused, generateFood, highScore])

  // Start game loop
  useEffect(() => {
    if (gameStarted && !gameOver && !isPaused) {
      gameLoopRef.current = setInterval(gameLoop, INITIAL_SPEED)
    }

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    }
  }, [gameLoop, gameStarted, gameOver, isPaused])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) {
        setGameStarted(true)
        return
      }

      if (e.key === " " || e.key === "Escape") {
        setIsPaused((prev) => !prev)
        return
      }

      const keyDirections: Record<string, Direction> = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
        w: "UP",
        s: "DOWN",
        a: "LEFT",
        d: "RIGHT",
        W: "UP",
        S: "DOWN",
        A: "LEFT",
        D: "RIGHT",
      }

      const newDirection = keyDirections[e.key]
      if (!newDirection) return

      // Prevent 180-degree turns
      const opposites: Record<Direction, Direction> = {
        UP: "DOWN",
        DOWN: "UP",
        LEFT: "RIGHT",
        RIGHT: "LEFT",
      }

      if (opposites[newDirection] !== directionRef.current) {
        directionRef.current = newDirection
        setDirection(newDirection)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameStarted])

  const restartGame = () => {
    setSnake([{ x: 10, y: 10 }])
    setFood({ x: 15, y: 10 })
    setDirection("RIGHT")
    directionRef.current = "RIGHT"
    setGameOver(false)
    setScore(0)
    setIsPaused(false)
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
          className="relative mx-auto overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-4 backdrop-blur-xl"
          style={{ width: GRID_SIZE * CELL_SIZE + 32, height: GRID_SIZE * CELL_SIZE + 32 }}
        >
          {/* Grid */}
          <div
            className="relative rounded-lg bg-background/50"
            style={{
              width: GRID_SIZE * CELL_SIZE,
              height: GRID_SIZE * CELL_SIZE,
              display: "grid",
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
            }}
          >
            {/* Grid lines */}
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
              <div key={i} className="border border-border/10" />
            ))}

            {/* Snake */}
            {snake.map((segment, index) => (
              <motion.div
                key={`${segment.x}-${segment.y}-${index}`}
                className="absolute rounded-sm"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  width: CELL_SIZE - 2,
                  height: CELL_SIZE - 2,
                  left: segment.x * CELL_SIZE + 1,
                  top: segment.y * CELL_SIZE + 1,
                  backgroundColor: index === 0 ? "var(--primary)" : "var(--primary)",
                  opacity: index === 0 ? 1 : 0.7 - index * 0.02,
                }}
              />
            ))}

            {/* Food */}
            <motion.div
              className="absolute rounded-full bg-destructive"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
              style={{
                width: CELL_SIZE - 4,
                height: CELL_SIZE - 4,
                left: food.x * CELL_SIZE + 2,
                top: food.y * CELL_SIZE + 2,
              }}
            />
          </div>

          {/* Start Screen */}
          {!gameStarted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            >
              <div className="text-center">
                <h2 className="mb-4 text-2xl font-bold text-foreground">Snake</h2>
                <p className="mb-6 text-sm text-muted-foreground">Press any key to start</p>
                <p className="text-xs text-muted-foreground">Use Arrow keys or WASD to move</p>
              </div>
            </motion.div>
          )}

          {/* Pause Screen */}
          {isPaused && !gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            >
              <div className="text-center">
                <h2 className="mb-4 text-2xl font-bold text-foreground">Paused</h2>
                <p className="text-sm text-muted-foreground">Press Space or Escape to resume</p>
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
          <p className="text-sm text-muted-foreground">Arrow Keys / WASD to move • Space to pause</p>
        </motion.div>
      </div>
    </div>
  )
}
