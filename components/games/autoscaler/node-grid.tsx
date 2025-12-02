"use client"

import { motion } from "framer-motion"

export interface NodeData {
  id: string
  jobs: number
  maxJobs: number
}

interface NodeGridProps {
  nodes: NodeData[]
  maxNodesPerRow: number
}

export function NodeGrid({ nodes, maxNodesPerRow }: NodeGridProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 p-2">
      {nodes.map((node, index) => {
        const fillPercent = (node.jobs / node.maxJobs) * 100
        const isNearFull = fillPercent >= 80
        const isFull = fillPercent >= 100

        return (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: index * 0.05 }}
            className="relative flex h-14 w-14 flex-col items-center justify-center rounded-lg border backdrop-blur-sm"
            style={{
              borderColor: isFull
                ? "hsl(var(--destructive))"
                : isNearFull
                  ? "hsl(var(--primary) / 0.8)"
                  : "hsl(var(--border) / 0.5)",
              background: isFull ? "hsl(var(--destructive) / 0.15)" : "hsl(var(--card) / 0.6)",
            }}
          >
            {/* Fill bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-lg bg-muted/30">
              <motion.div
                className="h-full rounded-b-lg"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(fillPercent, 100)}%` }}
                style={{
                  backgroundColor: isFull
                    ? "hsl(var(--destructive))"
                    : isNearFull
                      ? "hsl(var(--primary))"
                      : "hsl(var(--accent))",
                }}
              />
            </div>

            {/* Node icon */}
            <svg viewBox="0 0 24 24" className="mb-1 h-5 w-5 text-muted-foreground" fill="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
              <circle cx="8" cy="8" r="1.5" />
              <circle cx="12" cy="8" r="1.5" />
              <circle cx="16" cy="8" r="1.5" />
              <circle cx="8" cy="12" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="16" cy="12" r="1.5" />
            </svg>

            {/* Job count */}
            <span className="text-xs font-medium text-foreground">
              {node.jobs}/{node.maxJobs}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}
