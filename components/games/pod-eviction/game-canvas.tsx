"use client"

import type React from "react"

import { useCallback, useEffect, useRef, useState } from "react"
import { PlayerPod } from "./player-pod"
import { FallingEvent, type EvictionType } from "./falling-event"
import { PowerUp, type PowerUpType } from "./power-up"
import { GameHUD } from "./game-hud"

interface GameObject {
  id: string
  x: number
  y: number
  type: EvictionType | PowerUpType
  isPowerUp: boolean
}

interface GameCanvasProps {
  onGameOver: (score: number) => void
  gameStarted: boolean
  isPaused: boolean
}

const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 500
const POD_SIZE = 48
const EVENT_SIZE = 44
const POWERUP_SIZE = 32
const INITIAL_FALL_SPEED = 2
const MAX_FALL_SPEED = 8
const SPEED_INCREMENT = 0.0005

const EVICTION_TYPES: EvictionType[] = ["MemoryPressure", "DiskPressure", "PIDPressure", "NetworkUnavailable"]
const POWERUP_TYPES: PowerUpType[] = ["CPU", "Memory", "Storage"]

export function GameCanvas({ onGameOver, gameStarted, isPaused }: GameCanvasProps) {
  const [podX, setPodX] = useState(CANVAS_WIDTH / 2)
  const [objects, setObjects] = useState<GameObject[]>([])
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [multiplier, setMultiplier] = useState(1)
  const [activeBuffs, setActiveBuffs] = useState({ shield: 0, slowMode: 0, multiplier: 0 })
  const [fallSpeed, setFallSpeed] = useState(INITIAL_FALL_SPEED)
  const [isGameOver, setIsGameOver] = useState(false)
  const finalScoreRef = useRef(0)

  const animationRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  const spawnTimerRef = useRef<number>(0)
  const powerUpTimerRef = useRef<number>(0)

  useEffect(() => {
    const saved = localStorage.getItem("pod-eviction-high-score")
    if (saved) setHighScore(Number.parseInt(saved))
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted || isPaused) return

      const moveAmount = 24
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        setPodX((prev) => Math.max(POD_SIZE / 2, prev - moveAmount))
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        setPodX((prev) => Math.min(CANVAS_WIDTH - POD_SIZE / 2, prev + moveAmount))
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameStarted, isPaused])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!gameStarted || isPaused) return
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      setPodX(Math.max(POD_SIZE / 2, Math.min(CANVAS_WIDTH - POD_SIZE / 2, x)))
    },
    [gameStarted, isPaused],
  )

  const spawnObject = useCallback((isPowerUp: boolean) => {
    const id = `${Date.now()}-${Math.random()}`
    const x = Math.random() * (CANVAS_WIDTH - (isPowerUp ? POWERUP_SIZE : EVENT_SIZE))
    const type = isPowerUp
      ? POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)]
      : EVICTION_TYPES[Math.floor(Math.random() * EVICTION_TYPES.length)]

    setObjects((prev) => [...prev, { id, x, y: -50, type, isPowerUp }])
  }, [])

  const checkCollision = useCallback((obj: GameObject, podX: number): boolean => {
    const objCenterX = obj.x + (obj.isPowerUp ? POWERUP_SIZE : EVENT_SIZE) / 2
    const objCenterY = obj.y + (obj.isPowerUp ? POWERUP_SIZE : EVENT_SIZE) / 2
    const podCenterY = CANVAS_HEIGHT - POD_SIZE / 2 - 16

    const dx = Math.abs(objCenterX - podX)
    const dy = Math.abs(objCenterY - podCenterY)
    const collisionThreshold = (obj.isPowerUp ? POWERUP_SIZE : EVENT_SIZE) / 2 + POD_SIZE / 2 - 10

    return dx < collisionThreshold && dy < collisionThreshold
  }, [])

  const applyPowerUp = useCallback(
    (type: PowerUpType) => {
      switch (type) {
        case "CPU":
          setActiveBuffs((prev) => ({ ...prev, shield: 3 }))
          break
        case "Memory":
          setActiveBuffs((prev) => ({ ...prev, slowMode: 4 }))
          break
        case "Storage":
          setActiveBuffs((prev) => ({ ...prev, multiplier: 5 }))
          setMultiplier(2)
          break
      }
      setScore((prev) => prev + 25 * multiplier)
    },
    [multiplier],
  )

  useEffect(() => {
    if (isGameOver) {
      onGameOver(finalScoreRef.current)
      setIsGameOver(false)
    }
  }, [isGameOver, onGameOver])

  useEffect(() => {
    if (!gameStarted || isPaused) return

    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const deltaTime = (timestamp - lastTimeRef.current) / 1000
      lastTimeRef.current = timestamp

      setScore((prev) => prev + deltaTime * multiplier)

      setFallSpeed((prev) => Math.min(MAX_FALL_SPEED, prev + SPEED_INCREMENT))

      setActiveBuffs((prev) => {
        const newBuffs = {
          shield: Math.max(0, prev.shield - deltaTime),
          slowMode: Math.max(0, prev.slowMode - deltaTime),
          multiplier: Math.max(0, prev.multiplier - deltaTime),
        }
        if (prev.multiplier > 0 && newBuffs.multiplier === 0) {
          setMultiplier(1)
        }
        return newBuffs
      })

      spawnTimerRef.current += deltaTime
      if (spawnTimerRef.current > 1.2 - fallSpeed * 0.08) {
        spawnObject(false)
        spawnTimerRef.current = 0
      }

      powerUpTimerRef.current += deltaTime
      if (powerUpTimerRef.current > 5) {
        if (Math.random() < 0.4) spawnObject(true)
        powerUpTimerRef.current = 0
      }

      setObjects((prev) => {
        const currentPodX = podX
        const currentSpeed = activeBuffs.slowMode > 0 ? fallSpeed * 0.5 : fallSpeed
        let shouldEndGame = false

        const filtered = prev.filter((obj) => {
          if (checkCollision(obj, currentPodX)) {
            if (obj.isPowerUp) {
              applyPowerUp(obj.type as PowerUpType)
              return false
            } else if (activeBuffs.shield <= 0) {
              shouldEndGame = true
              return false
            } else {
              return false
            }
          }

          if (obj.y > CANVAS_HEIGHT + 50) return false

          obj.y += currentSpeed
          return true
        })

        if (shouldEndGame) {
          finalScoreRef.current = Math.floor(score)
          if (score > highScore) {
            localStorage.setItem("pod-eviction-high-score", Math.floor(score).toString())
            setHighScore(Math.floor(score))
          }
          setIsGameOver(true)
        }

        return filtered
      })

      animationRef.current = requestAnimationFrame(gameLoop)
    }

    animationRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [
    gameStarted,
    isPaused,
    podX,
    fallSpeed,
    multiplier,
    activeBuffs,
    score,
    highScore,
    checkCollision,
    applyPowerUp,
    spawnObject,
    onGameOver,
  ])

  useEffect(() => {
    if (gameStarted && !isPaused) {
      setScore(0)
      setObjects([])
      setFallSpeed(INITIAL_FALL_SPEED)
      setMultiplier(1)
      setActiveBuffs({ shield: 0, slowMode: 0, multiplier: 0 })
      setPodX(CANVAS_WIDTH / 2)
      setIsGameOver(false)
      finalScoreRef.current = 0
      lastTimeRef.current = 0
      spawnTimerRef.current = 0
      powerUpTimerRef.current = 0
    }
  }, [gameStarted])

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b from-card/60 to-background/80 backdrop-blur-xl"
      style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
      onPointerMove={handlePointerMove}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <GameHUD score={score} highScore={highScore} multiplier={multiplier} activeBuffs={activeBuffs} />

      {objects
        .filter((obj) => !obj.isPowerUp)
        .map((obj) => (
          <FallingEvent
            key={obj.id}
            id={obj.id}
            type={obj.type as EvictionType}
            x={obj.x}
            y={obj.y}
            size={EVENT_SIZE}
            slowMode={activeBuffs.slowMode > 0}
          />
        ))}

      {objects
        .filter((obj) => obj.isPowerUp)
        .map((obj) => (
          <PowerUp key={obj.id} id={obj.id} type={obj.type as PowerUpType} x={obj.x} y={obj.y} size={POWERUP_SIZE} />
        ))}

      <PlayerPod x={podX} hasShield={activeBuffs.shield > 0} containerWidth={CANVAS_WIDTH} podSize={POD_SIZE} />
    </div>
  )
}
