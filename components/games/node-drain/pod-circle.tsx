"use client"

import { motion } from "framer-motion"

interface PodCircleProps {
  id: string
  x: number
  y: number
  color: string
  size: number
  onClick: () => void
}

export function PodCircle({ id, x, y, color, size, onClick }: PodCircleProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{
        opacity: 0,
        scale: 0,
        x: (x > 0 ? 1 : -1) * 100,
        y: (y > 0 ? 1 : -1) * 100,
      }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.8 }}
      onClick={onClick}
      className="absolute flex items-center justify-center rounded-full border-2 transition-shadow hover:shadow-lg"
      style={{
        left: `calc(50% + ${x}px - ${size / 2}px)`,
        top: `calc(50% + ${y}px - ${size / 2}px)`,
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, ${color}60, ${color}30)`,
        borderColor: color,
        boxShadow: `0 0 20px ${color}40`,
      }}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill={color}>
        <path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z" />
      </svg>
    </motion.button>
  )
}
