"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { JobBlock } from "./job-block"
import { NodeGrid, type NodeData } from "./node-grid"
import { AutoscalerHUD } from "./hud"
import { Zap, Clock } from "lucide-react"

interface Job {
  id: string
  x: number
  y: number
  color: string
}

interface PowerUp {
  id: string
  x: number
  y: number
  type: "scaleUpBurst" | "jobThrottle"
}

interface GameLoopProps {
  onGameOver: (score: number) => void
  gameStarted: boolean
  isPaused: boolean
}

const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 500
const JOB_SIZE = 28
const POWERUP_SIZE = 32
const INITIAL_FALL_SPEED = 1.5
const MAX_FALL_SPEED = 5
const NODE_COOLDOWN = 3
const JOBS_PER_NODE = 4
const MAX_NODES = 12

const JOB_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

export function GameLoop({ onGameOver, gameStarted, isPaused }: GameLoopProps) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [powerUps, setPowerUps] = useState<PowerUp[]>([])
  const [nodes, setNodes] = useState<NodeData[]>([
    { id: "node-1", jobs: 0, maxJobs: JOBS_PER_NODE },
    { id: "node-2", jobs: 0, maxJobs: JOBS_PER_NODE },
  ])
  const [score, setScore] = useState(0)
  const [fallSpeed, setFallSpeed] = useState(INITIAL_FALL_SPEED)
  const [cooldown, setCooldown] = useState(0)
  const [activeBuffs, setActiveBuffs] = useState({ scaleUpBurst: 0, jobThrottle: 0 })
  const [isGameOver, setIsGameOver] = useState(false)
  const finalScoreRef = useRef(0)

  const animationRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  const spawnTimerRef = useRef<number>(0)
  const powerUpTimerRef = useRef<number>(0)

  const addNode = useCallback(() => {
    if (cooldown > 0 || nodes.length >= MAX_NODES) return

    setNodes((prev) => [...prev, { id: `node-${Date.now()}`, jobs: 0, maxJobs: JOBS_PER_NODE }])
    setCooldown(NODE_COOLDOWN)
    setScore((prev) => Math.max(0, prev - 5))
  }, [cooldown, nodes.length])

  const getTotalCapacity = useCallback(() => {
    return nodes.reduce((acc, node) => acc + (node.maxJobs - node.jobs), 0)
  }, [nodes])

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

      // Update cooldown
      setCooldown((prev) => Math.max(0, prev - deltaTime))

      // Update buffs
      setActiveBuffs((prev) => ({
        scaleUpBurst: Math.max(0, prev.scaleUpBurst - deltaTime),
        jobThrottle: Math.max(0, prev.jobThrottle - deltaTime),
      }))

      // Increase difficulty
      setFallSpeed((prev) => Math.min(MAX_FALL_SPEED, prev + 0.0003))

      // Spawn jobs
      spawnTimerRef.current += deltaTime
      const spawnRate = 1.5 - fallSpeed * 0.15
      if (spawnTimerRef.current > spawnRate) {
        const newJob: Job = {
          id: `job-${Date.now()}-${Math.random()}`,
          x: Math.random() * (CANVAS_WIDTH - JOB_SIZE - 20) + 10,
          y: -JOB_SIZE,
          color: JOB_COLORS[Math.floor(Math.random() * JOB_COLORS.length)],
        }
        setJobs((prev) => [...prev, newJob])
        spawnTimerRef.current = 0
      }

      // Spawn power-ups
      powerUpTimerRef.current += deltaTime
      if (powerUpTimerRef.current > 8) {
        if (Math.random() < 0.35) {
          const newPowerUp: PowerUp = {
            id: `powerup-${Date.now()}`,
            x: Math.random() * (CANVAS_WIDTH - POWERUP_SIZE - 20) + 10,
            y: -POWERUP_SIZE,
            type: Math.random() < 0.5 ? "scaleUpBurst" : "jobThrottle",
          }
          setPowerUps((prev) => [...prev, newPowerUp])
        }
        powerUpTimerRef.current = 0
      }

      // Move power-ups
      const currentSpeed = activeBuffs.jobThrottle > 0 ? fallSpeed * 0.4 : fallSpeed
      setPowerUps((prev) => prev.map((p) => ({ ...p, y: p.y + currentSpeed })).filter((p) => p.y < CANVAS_HEIGHT - 120))

      // Move jobs and check for landing
      setJobs((prev) => {
        const nodeZoneY = CANVAS_HEIGHT - 140
        let shouldEndGame = false

        const remaining = prev.filter((job) => {
          const newY = job.y + currentSpeed

          // Check if job reached node zone
          if (newY >= nodeZoneY) {
            // Try to assign to a node
            let assigned = false
            setNodes((nodes) => {
              const availableNode = nodes.find((n) => n.jobs < n.maxJobs)
              if (availableNode) {
                assigned = true
                setScore((s) => s + 1)
                return nodes.map((n) => (n.id === availableNode.id ? { ...n, jobs: n.jobs + 1 } : n))
              }
              return nodes
            })

            if (!assigned) {
              shouldEndGame = true
            }
            return false
          }

          job.y = newY
          return true
        })

        if (shouldEndGame) {
          finalScoreRef.current = score
          setIsGameOver(true)
        }

        return remaining
      })

      animationRef.current = requestAnimationFrame(gameLoop)
    }

    animationRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [gameStarted, isPaused, fallSpeed, score, activeBuffs.jobThrottle])

  // Handle power-up collection (click)
  const collectPowerUp = useCallback((powerUp: PowerUp) => {
    setPowerUps((prev) => prev.filter((p) => p.id !== powerUp.id))

    if (powerUp.type === "scaleUpBurst") {
      // Add 3 nodes instantly
      setNodes((prev) => {
        const newNodes = [...prev]
        for (let i = 0; i < 3 && newNodes.length < MAX_NODES; i++) {
          newNodes.push({
            id: `node-${Date.now()}-${i}`,
            jobs: 0,
            maxJobs: JOBS_PER_NODE,
          })
        }
        return newNodes
      })
      setActiveBuffs((prev) => ({ ...prev, scaleUpBurst: 2 }))
      setScore((prev) => prev + 10)
    } else {
      setActiveBuffs((prev) => ({ ...prev, jobThrottle: 5 }))
      setScore((prev) => prev + 5)
    }
  }, [])

  // Reset game state
  useEffect(() => {
    if (gameStarted && !isPaused) {
      setJobs([])
      setPowerUps([])
      setNodes([
        { id: "node-1", jobs: 0, maxJobs: JOBS_PER_NODE },
        { id: "node-2", jobs: 0, maxJobs: JOBS_PER_NODE },
      ])
      setScore(0)
      setFallSpeed(INITIAL_FALL_SPEED)
      setCooldown(0)
      setActiveBuffs({ scaleUpBurst: 0, jobThrottle: 0 })
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
        <AutoscalerHUD
          score={score}
          nodeCount={nodes.length}
          cooldown={cooldown}
          maxCooldown={NODE_COOLDOWN}
          powerUps={activeBuffs}
          onAddNode={addNode}
          canAddNode={cooldown === 0 && nodes.length < MAX_NODES}
        />
      </div>

      {/* Falling Jobs */}
      <AnimatePresence>
        {jobs.map((job) => (
          <JobBlock key={job.id} id={job.id} x={job.x} y={job.y} color={job.color} size={JOB_SIZE} />
        ))}
      </AnimatePresence>

      {/* Power-ups */}
      <AnimatePresence>
        {powerUps.map((powerUp) => (
          <motion.button
            key={powerUp.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1, y: powerUp.y }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => collectPowerUp(powerUp)}
            className="absolute flex items-center justify-center rounded-lg border backdrop-blur-sm transition-transform hover:scale-110"
            style={{
              left: powerUp.x,
              width: POWERUP_SIZE,
              height: POWERUP_SIZE,
              background:
                powerUp.type === "scaleUpBurst"
                  ? "linear-gradient(135deg, rgba(34,197,94,0.3), rgba(34,197,94,0.1))"
                  : "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(168,85,247,0.1))",
              borderColor: powerUp.type === "scaleUpBurst" ? "rgba(34,197,94,0.5)" : "rgba(168,85,247,0.5)",
              boxShadow:
                powerUp.type === "scaleUpBurst" ? "0 0 16px rgba(34,197,94,0.4)" : "0 0 16px rgba(168,85,247,0.4)",
            }}
          >
            {powerUp.type === "scaleUpBurst" ? (
              <Zap className="h-4 w-4 text-green-400" />
            ) : (
              <Clock className="h-4 w-4 text-purple-400" />
            )}
          </motion.button>
        ))}
      </AnimatePresence>

      {/* Node Grid at bottom */}
      <div className="absolute bottom-0 left-0 right-0 rounded-b-2xl border-t border-border/30 bg-card/40 backdrop-blur-sm">
        <NodeGrid nodes={nodes} maxNodesPerRow={6} />
      </div>

      {/* Capacity Warning */}
      {getTotalCapacity() <= 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute left-1/2 top-20 -translate-x-1/2 rounded-lg border border-destructive/50 bg-destructive/20 px-3 py-1 text-xs font-medium text-destructive backdrop-blur-sm"
        >
          Low Capacity! Add Nodes!
        </motion.div>
      )}
    </div>
  )
}
