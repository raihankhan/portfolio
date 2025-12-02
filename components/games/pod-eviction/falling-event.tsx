"use client"

import { motion } from "framer-motion"
import { AlertTriangle, HardDrive, Cpu, Wifi } from "lucide-react"

export type EvictionType = "MemoryPressure" | "DiskPressure" | "PIDPressure" | "NetworkUnavailable"

interface FallingEventProps {
  id: string
  type: EvictionType
  x: number
  y: number
  size: number
  slowMode: boolean
}

const evictionConfig: Record<EvictionType, { icon: typeof AlertTriangle; color: string; label: string }> = {
  MemoryPressure: { icon: Cpu, color: "#ef4444", label: "OOM" },
  DiskPressure: { icon: HardDrive, color: "#f97316", label: "Disk" },
  PIDPressure: { icon: AlertTriangle, color: "#eab308", label: "PID" },
  NetworkUnavailable: { icon: Wifi, color: "#ec4899", label: "Net" },
}

export function FallingEvent({ type, x, y, size, slowMode }: FallingEventProps) {
  const config = evictionConfig[type]
  const Icon = config.icon

  return (
    <motion.div
      className="absolute flex flex-col items-center justify-center rounded-lg border bg-card/90 backdrop-blur-sm"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        borderColor: config.color,
        boxShadow: `0 0 12px ${config.color}40`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: slowMode ? 0.6 : 1,
        scale: 1,
        filter: slowMode ? "blur(1px)" : "blur(0px)",
      }}
    >
      <Icon className="h-5 w-5" style={{ color: config.color }} />
      <span className="mt-1 text-[8px] font-mono" style={{ color: config.color }}>
        {config.label}
      </span>
    </motion.div>
  )
}
