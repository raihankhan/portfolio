"use client"

import Spline from "@splinetool/react-spline"
import { motion, useReducedMotion } from "framer-motion"
import { useState, useEffect } from "react"
import { Clause } from "@/components/text-wipe"

export function SplineRobot() {
    const [isMounted, setIsMounted] = useState(false)
    const reduceMotion = useReducedMotion() ?? false

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

            {/* Speech bubble — solid from the start. Only the text inside
                animates: a blinking "......" loading state until the hero
                description has finished reading, then a clause-by-clause
                wipe revealing "Hi! Nice to meet you." using the same mask
                primitive as the description. */}
            <BubbleText reduceMotion={reduceMotion} />
        </motion.div>
    )
}

/** Time (in seconds, from page load) at which the bubble transitions
 *  from the loading dots to the wipe reveal. Synced to land right after
 *  the hero description has finished reading. */
const LOADING_DURATION_S = 1.9
/** Initial dot count shown while "composing". */
const LOADING_DOTS = "......"

/**
 * Bubble text state machine.
 *
 * Phase 1 (loading): blinking "......" with dots cycling in pace.
 * Phase 2 (revealing): three clauses wipe in left-to-right using the
 *                       same mask primitive as the hero description.
 *
 * The bubble container itself never animates — it's a solid black pill
 * present from first paint.
 */
function BubbleText({ reduceMotion }: { reduceMotion: boolean }) {
    const [phase, setPhase] = useState<"loading" | "revealing">("loading")

    useEffect(() => {
        if (reduceMotion) return
        const t = setTimeout(() => setPhase("revealing"), LOADING_DURATION_S * 1000)
        return () => clearTimeout(t)
    }, [reduceMotion])

    return (
        <div
            className="pointer-events-none absolute bottom-20 right-10 z-20 flex h-10 w-48 items-center justify-center rounded-full bg-black/85 px-3 ring-1 ring-white/10 backdrop-blur-sm"
            aria-live="polite"
        >
            <span
                className="text-sm text-white"
                style={{ fontFamily: "var(--font-orbitron), sans-serif" }}
            >
                {phase === "loading" ? (
                    <LoadingDots skip={reduceMotion} />
                ) : (
                    <>
                        {/* Same wipe primitive as the hero description —
                            three short clauses wiping left-to-right. */}
                        <Clause delay={0} duration={0.32} skip={reduceMotion} className="inline">
                            Hi!
                        </Clause>{" "}
                        <Clause delay={0.2} duration={0.4} skip={reduceMotion} className="inline">
                            Nice to meet
                        </Clause>{" "}
                        <Clause delay={0.4} duration={0.4} skip={reduceMotion} className="inline">
                            you.
                        </Clause>
                    </>
                )}
            </span>
        </div>
    )
}

/**
 * Six dots that fade in and out with a staggered wave, giving the bubble
 * a "composing" feel while the page reads itself in. Static "......" when
 * the user prefers reduced motion.
 */
function LoadingDots({ skip }: { skip: boolean }) {
    if (skip) {
        return <span aria-label="loading">{LOADING_DOTS}</span>
    }
    return (
        <span aria-label="composing message">
            {LOADING_DOTS.split("").map((d, i) => (
                <motion.span
                    key={i}
                    aria-hidden="true"
                    initial={{ opacity: 0.25 }}
                    animate={{ opacity: [0.25, 1, 0.25] }}
                    transition={{
                        duration: 1.2,
                        delay: i * 0.12,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="inline-block"
                >
                    {d}
                </motion.span>
            ))}
        </span>
    )
}