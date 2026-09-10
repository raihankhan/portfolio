"use client"

/**
 * Text wipe primitives
 *
 * A small set of components that drive a CSS-mask wipe reveal. Used by:
 *   - app/page.tsx (hero description)
 *   - components/spline-robot.tsx (greeting bubble)
 *
 * Why CSS mask-image instead of clipPath: works correctly on inline text
 * fragments (multi-line wraps are independent boxes, each wipes
 * left-to-right). Painted only — no layout cost.
 */

import * as React from "react"
import { motion } from "framer-motion"

/** Static style that binds the --reveal custom property to a mask-image. */
export function wipeStyle(reveal: number): React.CSSProperties {
    return {
        ["--reveal" as string]: `${reveal}%`,
        WebkitMaskImage:
            "linear-gradient(90deg, #000 0%, #000 var(--reveal), transparent var(--reveal))",
        maskImage:
            "linear-gradient(90deg, #000 0%, #000 var(--reveal), transparent var(--reveal))",
    }
}

/**
 * One clause of a wiping text block. Animates --reveal 0 → 100 on mount.
 * When `skip` is true the clause is rendered without any animation.
 */
export function Clause({
    children,
    delay,
    duration = 0.6,
    className,
    skip,
}: {
    children: React.ReactNode
    delay: number
    duration?: number
    className?: string
    skip?: boolean
}) {
    if (skip) {
        return (
            <span className={className} style={wipeStyle(100)}>
                {children}
            </span>
        )
    }
    return (
        <motion.span
            className={className}
            initial={{ ["--reveal" as string]: "0%" } as any}
            animate={{ ["--reveal" as string]: "100%" } as any}
            transition={{
                duration,
                delay,
                ease: [0.16, 1, 0.3, 1] as const,
            }}
            style={wipeStyle(0)}
        >
            {children}
        </motion.span>
    )
}
