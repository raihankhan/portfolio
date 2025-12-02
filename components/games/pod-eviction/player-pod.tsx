"use client"

import { motion } from "framer-motion"

interface PlayerPodProps {
  x: number
  hasShield: boolean
  containerWidth: number
  podSize: number
}

export function PlayerPod({ x, hasShield, containerWidth, podSize }: PlayerPodProps) {
  return (
    <motion.div
      className="absolute bottom-4"
      style={{
        left: `${(x / containerWidth) * 100}%`,
        transform: "translateX(-50%)",
      }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Shield glow effect */}
      {hasShield && (
        <motion.div
          className="absolute inset-0 -m-3 rounded-full"
          style={{
            background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
            filter: "blur(8px)",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
        />
      )}

      {/* Pod container */}
      <motion.div
        className="relative flex items-center justify-center rounded-lg border-2 bg-card/80 backdrop-blur-sm"
        style={{
          width: podSize,
          height: podSize,
          borderColor: hasShield ? "var(--primary)" : "var(--border)",
          boxShadow: hasShield ? "0 0 20px var(--primary), 0 0 40px var(--primary)" : "0 4px 12px rgba(0,0,0,0.3)",
        }}
        animate={hasShield ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.5, repeat: hasShield ? Number.POSITIVE_INFINITY : 0 }}
      >
        {/* Kubernetes Pod icon */}
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>

        {/* Pod label */}
        <span className="absolute -bottom-5 whitespace-nowrap text-[10px] font-mono text-muted-foreground">pod-1</span>
      </motion.div>
    </motion.div>
  )
}
