"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PodCircle } from "./pod-circle"
import { DrainTimer } from "./drain-timer"
import { NodeDrainHUD } from "./game-hud"

interface Pod {
  id: string
  x: number
  y: number
  color: string
}

interface NodeCanvasProps {
  onGameOver: (score: number) => void
  gameStarted: boolean
  isPaused: boolean
}

const CANVAS_SIZE = 400
const POD_SIZE = 40
const NODE_SIZE = 100
const POD_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"]

const MIN_PODS = 3
const MAX_PODS = 7
const INITIAL_TIME = 8
const MIN_TIME = 3

export function NodeCanvas({ onGameOver, gameStarted, isPaused }: NodeCanvasProps) {
  const [pods, setPods] = useState<Pod[]>([])
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [round, setRound] = useState(1)
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME)
  const [maxTime, setMaxTime] = useState(INITIAL_TIME)
  const [nodeGlow, setNodeGlow] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)
  const finalScoreRef = useRef(0)

  const animationRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)

  useEffect(() => {
    const saved = localStorage.getItem("node-drain-high-score")
    if (saved) setHighScore(Number.parseInt(saved))
  }, [])

  const spawnPods = useCallback((roundNum: number) => {
    const podCount = Math.min(MAX_PODS, MIN_PODS + Math.floor(roundNum / 2))
    const newPods: Pod[] = []
    const radius = 100

    for (let i = 0; i < podCount; i++) {
      const angle = (i / podCount) * Math.PI * 2 + Math.random() * 0.5
      const dist = radius * (0.5 + Math.random() * 0.5)
      newPods.push({
        id: `pod-${Date.now()}-${i}`,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        color: POD_COLORS[Math.floor(Math.random() * POD_COLORS.length)],
      })
    }

    setPods(newPods)

    // Calculate time for this round
    const time = Math.max(MIN_TIME, INITIAL_TIME - roundNum * 0.5)
    setMaxTime(time)
    setTimeLeft(time)
  }, [])

  const evictPod = useCallback((podId: string) => {
    setPods((prev) => prev.filter((p) => p.id !== podId))
  }, [])

  // Check for round completion
  useEffect(() => {
    if (gameStarted && !isPaused && pods.length === 0 && timeLeft > 0) {
      // Round complete!
      setScore((prev) => prev + 1 + Math.floor(timeLeft))
      setRound((prev) => prev + 1)
      spawnPods(round + 1)
    }
  }, [pods.length, gameStarted, isPaused, timeLeft, round, spawnPods])

  useEffect(() => {
    if (isGameOver) {
      onGameOver(finalScoreRef.current)
      setIsGameOver(false)
    }
  }, [isGameOver, onGameOver])

  // Game loop for timer
  useEffect(() => {
    if (!gameStarted || isPaused) return

    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const deltaTime = (timestamp - lastTimeRef.current) / 1000
      lastTimeRef.current = timestamp

      setTimeLeft((prev) => {
        const newTime = prev - deltaTime
        if (newTime <= 0 && pods.length > 0) {
          // Game over!
          finalScoreRef.current = score
          if (score > highScore) {
            localStorage.setItem("node-drain-high-score", score.toString())
            setHighScore(score)
          }
          setIsGameOver(true)
          return 0
        }
        return Math.max(0, newTime)
      })

      // Update node glow based on time urgency
      setNodeGlow((maxTime - timeLeft) / maxTime)

      animationRef.current = requestAnimationFrame(gameLoop)
    }

    animationRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [gameStarted, isPaused, pods.length, score, highScore, maxTime, timeLeft])

  // Reset game
  useEffect(() => {
    if (gameStarted && !isPaused) {
      setScore(0)
      setRound(1)
      setNodeGlow(0)
      setIsGameOver(false)
      finalScoreRef.current = 0
      lastTimeRef.current = 0
      spawnPods(1)
    }
  }, [gameStarted, spawnPods])

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b from-card/60 to-background/80 backdrop-blur-xl"
      style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* HUD */}
      <div className="absolute left-2 right-2 top-2 z-20">
        <NodeDrainHUD score={score} highScore={highScore} round={round} podsRemaining={pods.length} />
      </div>

      {/* Central Node */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 backdrop-blur-sm"
        style={{
          width: NODE_SIZE,
          height: NODE_SIZE,
          borderColor: `hsl(var(--primary) / ${0.5 + nodeGlow * 0.5})`,
          background: `radial-gradient(circle, hsl(var(--primary) / ${0.1 + nodeGlow * 0.2}), transparent)`,
          boxShadow: `0 0 ${30 + nodeGlow * 40}px hsl(var(--primary) / ${0.3 + nodeGlow * 0.4})`,
        }}
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
      >
        <div className="flex h-full w-full flex-col items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-primary" fill="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="12" cy="8" r="1.5" />
            <circle cx="16" cy="8" r="1.5" />
            <circle cx="8" cy="12" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="16" cy="12" r="1.5" />
          </svg>
          <span className="mt-1 text-xs font-medium text-primary">NODE</span>
        </div>
      </motion.div>

      {/* Pods */}
      <AnimatePresence>
        {pods.map((pod) => (
          <PodCircle
            key={pod.id}
            id={pod.id}
            x={pod.x}
            y={pod.y}
            color={pod.color}
            size={POD_SIZE}
            onClick={() => evictPod(pod.id)}
          />
        ))}
      </AnimatePresence>

      {/* Timer */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <DrainTimer timeLeft={timeLeft} maxTime={maxTime} />
      </div>
    </div>
  )
}
