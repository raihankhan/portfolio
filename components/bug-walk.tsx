"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

export function BugWalk() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [containerWidth, setContainerWidth] = useState(0)
    const [direction, setDirection] = useState<"right" | "left">("right")
    const [isMounted, setIsMounted] = useState(false)

    const bugWidth = 48 // Width of the bug image in pixels

    // Handle mounting for SSR compatibility
    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Measure container width and handle resize
    useEffect(() => {
        if (!containerRef.current) return

        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth)
            }
        }

        // Initial measurement
        updateWidth()

        // Set up ResizeObserver for dynamic width updates
        const resizeObserver = new ResizeObserver(updateWidth)
        resizeObserver.observe(containerRef.current)

        // Also listen to window resize as fallback
        window.addEventListener("resize", updateWidth)

        return () => {
            resizeObserver.disconnect()
            window.removeEventListener("resize", updateWidth)
        }
    }, [])

    // Don't render until mounted (SSR compatibility)
    if (!isMounted || containerWidth === 0) {
        return <div ref={containerRef} className="relative h-10 w-full" />
    }

    // Calculate the end position (container width minus bug width)
    const endPosition = containerWidth - bugWidth

    return (
        <div ref={containerRef} className="relative h-10 w-full overflow-hidden">
            <motion.div
                className="absolute top-0"
                initial={{ x: 0 }}
                animate={{
                    x: direction === "right" ? endPosition : 0,
                }}
                transition={{
                    duration: 6,
                    ease: "linear",
                }}
                onAnimationComplete={() => {
                    // Toggle direction when animation completes
                    setDirection((prev) => (prev === "right" ? "left" : "right"))
                }}
                style={{ width: bugWidth, height: bugWidth }}
            >
                {/* Nested motion.div for rotation wobble effect */}
                <motion.div
                    animate={{
                        rotate: direction === "right"
                            ? [0, -15, 0, 15, 0, -30, 0, 30, 0] // Wobble pattern for right
                            : [0, 15, 0, -15, 0, 30, 0, -30, 0], // Wobble pattern for left
                    }}
                    transition={{
                        duration: 6,
                        ease: "linear",
                        times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1], // Evenly spaced keyframes
                    }}
                >
                    <Image
                        src={direction === "right" ? "/bug.png" : "/bug-reverse.png"}
                        alt="Walking bug"
                        width={bugWidth}
                        height={bugWidth}
                        className="object-contain"
                        priority
                    />
                </motion.div>
            </motion.div>
        </div>
    )
}
