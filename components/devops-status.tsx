"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Terminal, CheckCircle2, Radio, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

const states = [
    {
        text: "System Online",
        icon: Activity,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
    },
    {
        text: "Ready to Deploy",
        icon: CheckCircle2,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        text: "Listening for Opportunities",
        icon: Radio,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
    },
    {
        text: "Initializing...",
        icon: Terminal,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
    },
]

export function DevOpsStatus() {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % states.length)
        }, 3000)

        return () => clearInterval(timer)
    }, [])

    const CurrentIcon = states[currentIndex].icon

    return (
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm w-fit overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-2"
                >
                    <div className={cn("p-1 rounded-full", states[currentIndex].bg)}>
                        <CurrentIcon className={cn("w-3 h-3", states[currentIndex].color)} />
                    </div>
                    <span className="text-muted-foreground font-mono text-xs md:text-sm">
                        {states[currentIndex].text}
                        <motion.span
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="ml-1 inline-block w-1.5 h-3 bg-primary align-middle"
                        />
                    </span>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
