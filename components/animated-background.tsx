"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const { clientX, clientY } = e
      const x = (clientX / window.innerWidth) * 100
      const y = (clientY / window.innerHeight) * 100
      containerRef.current.style.setProperty("--mouse-x", `${x}%`)
      containerRef.current.style.setProperty("--mouse-y", `${y}%`)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden transition-colors duration-700"
      style={
        {
          "--mouse-x": "50%",
          "--mouse-y": "50%",
        } as React.CSSProperties
      }
    >
      {/* Base gradient */}
      <div className="absolute inset-0 bg-background transition-colors duration-700" />

      <motion.div
        className="absolute h-[600px] w-[600px] rounded-full opacity-30 blur-[120px] transition-[background] duration-700"
        style={{
          background: "radial-gradient(circle, var(--theme-gradient-1, #22d3ee) 0%, transparent 70%)",
          left: "var(--mouse-x)",
          top: "var(--mouse-y)",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full opacity-20 blur-[100px] transition-[background] duration-700"
        style={{
          background: "radial-gradient(circle, var(--theme-gradient-2, #3b82f6) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full opacity-15 blur-[80px] transition-[background] duration-700"
        style={{
          background: "radial-gradient(circle, var(--theme-gradient-3, #10b981) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(10,10,15,0.5) 100%)",
        }}
      />
    </div>
  )
}
