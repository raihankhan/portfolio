"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ScoreBoard, BackToArcadeButton, GameOverOverlay } from "@/components/game-console/game-ui"

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT"
type Position = { x: number; y: number }
type Food = Position & { char: string; id: number }

const CELL_SIZE = 20
const INITIAL_SPEED = 150
const VOWELS = ["A", "E", "I", "O", "U"]
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

const BOARD_SIZES = [
  { label: "Small", value: 15 },
  { label: "Medium", value: 20 },
  { label: "Large", value: 25 },
]

export default function SnakePage() {
  const [gridSize, setGridSize] = useState(20)
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }])
  const [snakeChars, setSnakeChars] = useState<string[]>([])
  const [food, setFood] = useState<Food>({ x: 15, y: 10, char: "A", id: 0 })
  const [direction, setDirection] = useState<Direction>("RIGHT")
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [speed, setSpeed] = useState(INITIAL_SPEED)

  const directionRef = useRef(direction)
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)
  const foodTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("snake-high-score")
    if (saved) setHighScore(Number.parseInt(saved))
  }, [])

  // Generate random food
  const generateFood = useCallback((currentSnake: Position[], currentGridSize: number): Food => {
    let newPos: Position
    do {
      newPos = {
        x: Math.floor(Math.random() * currentGridSize),
        y: Math.floor(Math.random() * currentGridSize),
      }
    } while (currentSnake.some((segment) => segment.x === newPos.x && segment.y === newPos.y))

    return {
      ...newPos,
      char: ALPHABET[Math.floor(Math.random() * ALPHABET.length)],
      id: Date.now(),
    }
  }, [])

  // Food expiration timer
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return

    if (foodTimeoutRef.current) clearTimeout(foodTimeoutRef.current)

    foodTimeoutRef.current = setTimeout(() => {
      setFood(generateFood(snake, gridSize))
    }, 5000)

    return () => {
      if (foodTimeoutRef.current) clearTimeout(foodTimeoutRef.current)
    }
  }, [food.id, gameStarted, gameOver, isPaused, snake, gridSize, generateFood])

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
      if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        setGameOver(true)
        return prevSnake
      }

      // Check self collision (only if length > 1)
      if (prevSnake.length > 1 && prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
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

        setSnakeChars(prev => [...prev, food.char])

        if (VOWELS.includes(food.char)) {
          setSpeed(prev => Math.max(50, prev - 10))
        }

        setFood(generateFood(newSnake, gridSize))
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [food, gameOver, isPaused, generateFood, gridSize, highScore])

  // Start game loop
  useEffect(() => {
    if (gameStarted && !gameOver && !isPaused) {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
      gameLoopRef.current = setInterval(gameLoop, speed)
    }

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    }
  }, [gameLoop, gameStarted, gameOver, isPaused, speed])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) return

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

  const startGame = (size: number) => {
    setGridSize(size)
    const centerX = Math.floor(size / 2)
    const centerY = Math.floor(size / 2)
    setSnake([{ x: centerX, y: centerY }])
    setSnakeChars([])
    setFood({ x: centerX + 5, y: centerY, char: "A", id: Date.now() })
    setDirection("RIGHT")
    directionRef.current = "RIGHT"
    setGameOver(false)
    setScore(0)
    setIsPaused(false)
    setGameStarted(true)
    setSpeed(INITIAL_SPEED)
  }

  const restartGame = () => {
    startGame(gridSize)
  }

  return (
    <div className="relative min-h-screen px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <BackToArcadeButton />
          <ScoreBoard score={score} highScore={highScore} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mx-auto overflow-hidden rounded-2xl border border-primary/50 bg-primary/5 p-4 backdrop-blur-xl"
          style={{ width: gridSize * CELL_SIZE + 32, height: gridSize * CELL_SIZE + 32 }}
        >
          <div
            className="relative bg-background/50"
            style={{
              width: gridSize * CELL_SIZE,
              height: gridSize * CELL_SIZE,
              display: "grid",
              gridTemplateColumns: `repeat(${gridSize}, ${CELL_SIZE}px)`,
              gridTemplateRows: `repeat(${gridSize}, ${CELL_SIZE}px)`,
            }}
          >
            {/* Grid lines */}
            {Array.from({ length: gridSize * gridSize }).map((_, i) => (
              <div key={i} className="border border-border/10" />
            ))}

            {/* Snake */}
            {snake.map((segment, index) => {
              const isHead = index === 0
              const char = !isHead ? snakeChars[index - 1] : null

              return (
                <div
                  key={index} // Stable key to prevent flicker
                  className={`absolute flex items-center justify-center text-[10px] font-bold text-primary-foreground ${isHead ? "z-10" : "z-0"}`}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    left: segment.x * CELL_SIZE,
                    top: segment.y * CELL_SIZE,
                    backgroundColor: "var(--primary)",
                    boxShadow: "0 0 10px 1px var(--primary)", // Stable Aura effect
                  }}
                >
                  {char}
                </div>
              )
            })}

            {/* Food */}
            <motion.div
              key={food.id}
              className="absolute flex items-center justify-center bg-accent text-accent-foreground text-xs font-bold shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                left: food.x * CELL_SIZE + 1,
                top: food.y * CELL_SIZE + 1,
                borderRadius: "2px",
              }}
            >
              {food.char}
            </motion.div>
          </div>

          {/* Start Screen */}
          {!gameStarted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            >
              <div className="text-center p-6">
                <h2 className="mb-4 text-2xl font-bold text-foreground">Letter Snake</h2>
                <p className="mb-6 text-sm text-muted-foreground">Select Board Size to Start</p>
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {BOARD_SIZES.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => startGame(size.value)}
                      className="rounded-lg border border-border/50 bg-card/60 px-3 py-2 text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
                <div className="space-y-2 text-[10px] text-muted-foreground opacity-80">
                  <p>Collect letters before they disappear (5s)!</p>
                  <p>Eat Vowels <span className="text-primary font-bold">(A, E, I, O, U)</span> for SPEED BOOST</p>
                </div>
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
