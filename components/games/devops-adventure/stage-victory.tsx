"use client"

import { motion } from "framer-motion"
import {
  GitBranch,
  Workflow,
  Container,
  GitCompare,
  RefreshCw,
  Box,
  ArrowRightLeft,
  Activity,
  Check,
  RotateCcw,
} from "lucide-react"

interface StageVictoryProps {
  onPlayAgain: () => void
}

const PIPELINE_ICONS = [
  { icon: GitBranch, label: "Git", color: "text-orange-400" },
  { icon: Workflow, label: "CI", color: "text-blue-400" },
  { icon: Container, label: "Docker", color: "text-cyan-400" },
  { icon: GitCompare, label: "GitOps", color: "text-purple-400" },
  { icon: RefreshCw, label: "ArgoCD", color: "text-orange-400" },
  { icon: Box, label: "K8s", color: "text-blue-400" },
  { icon: Box, label: "Canary", color: "text-yellow-400" },
  { icon: ArrowRightLeft, label: "Blue-Green", color: "text-green-400" },
  { icon: Activity, label: "Observability", color: "text-pink-400" },
]

export function StageVictory({ onPlayAgain }: StageVictoryProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-8 p-8">
      {/* Animated Icons Pipeline */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {PIPELINE_ICONS.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.15, type: "spring" }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ delay: index * 0.15 + 1, duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm"
            >
              <item.icon className={`h-6 w-6 ${item.color}`} />
            </motion.div>
            <span className="mt-1 text-xs text-muted-foreground">{item.label}</span>

            {index < PIPELINE_ICONS.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: index * 0.15 + 0.1 }}
                className="absolute ml-14 h-px w-4 bg-border/50"
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Victory Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
        className="rounded-2xl border border-green-500/30 bg-card/80 p-8 text-center shadow-2xl backdrop-blur-xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.8, type: "spring" }}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20"
        >
          <Check className="h-8 w-8 text-green-400" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="mb-2 text-2xl font-bold text-foreground"
        >
          DevOps Pipeline Completed Successfully!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="mb-6 text-sm text-muted-foreground"
        >
          You've mastered the GitOps workflow from commit to production!
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4 }}
          onClick={onPlayAgain}
          className="flex items-center gap-2 rounded-xl border border-primary/50 bg-primary/10 px-6 py-3 font-medium text-primary transition-colors hover:bg-primary/20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="h-4 w-4" />
          Play Again
        </motion.button>
      </motion.div>
    </div>
  )
}
