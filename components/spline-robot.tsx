"use client"

import Spline from "@splinetool/react-spline"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export function SplineRobot() {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex h-[500px] w-full overflow-hidden"
        >
            <div className="absolute inset-0 z-0 scale-[0.70]">
                {isMounted && (
                    <Spline
                        scene="https://prod.spline.design/NxReUEq0U9aFgqMA/scene.splinecode"
                    />
                )}
            </div>
            <div className="pointer-events-none absolute inset-0 z-10 bg-transparent" />
            <div className="pointer-events-none absolute bottom-20 right-10 z-20 flex h-10 w-48 items-center justify-center bg-black">
                <span className="text-sm text-white" style={{ fontFamily: "var(--font-orbitron), sans-serif" }}>
                    Hi! Nice to meet you...
                </span>
            </div>
        </motion.div>
    )
}
