"use client"

import { motion } from "framer-motion"

interface DrainTimerProps {
  timeLeft: number
  maxTime: number
}

export function DrainTimer({ timeLeft, maxTime }: DrainTimerProps) {
  const percent = (timeLeft / maxTime) * 100
  const isUrgent = percent < 30
  const isCritical = percent < 15

  return (
    <div className="relative">
      {/* Background ring */}
      <svg className="h-24 w-24 -rotate-90">
        <circle cx="48" cy="48" r="40" fill="none" strokeWidth="6" className="stroke-muted/30" />
        <motion.circle
          cx="48"
          cy="48"
          r="40"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={251.2}
          strokeDashoffset={251.2 * (1 - percent / 100)}
          className={isCritical ? "stroke-destructive" : isUrgent ? "stroke-orange-500" : "stroke-primary"}
          animate={{
            strokeDashoffset: 251.2 * (1 - percent / 100),
          }}
          transition={{ duration: 0.1 }}
        />
      </svg>

      {/* Timer text */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        animate={isCritical ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.3, repeat: isCritical ? Number.POSITIVE_INFINITY : 0 }}
      >
        <span
          className={`text-2xl font-bold ${
            isCritical ? "text-destructive" : isUrgent ? "text-orange-500" : "text-foreground"
          }`}
        >
          {timeLeft.toFixed(1)}
        </span>
        <span className="text-xs text-muted-foreground">DRAIN</span>
      </motion.div>

      {/* Glow effect when urgent */}
      {isUrgent && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
          style={{
            background: `radial-gradient(circle, ${isCritical ? "hsl(var(--destructive) / 0.3)" : "rgba(249,115,22,0.3)"} 0%, transparent 70%)`,
          }}
        />
      )}
    </div>
  )
}
