"use client"

import { motion } from "framer-motion"
import { BackToArcadeButton } from "@/components/game-console/game-ui"
import { DevOpsAdventureGitOps } from "@/components/games/devops-adventure/devops-adventure-gitops"
import { Workflow } from "lucide-react"

export default function DevOpsAdventureGitOpsPage() {
  return (
    <div className="relative min-h-screen px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <BackToArcadeButton />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <motion.div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          >
            <Workflow className="h-8 w-8 text-primary" />
          </motion.div>
          <h1 className="mb-2 text-2xl font-bold text-foreground">Multi-Stage DevOps Adventure</h1>
          <p className="text-sm text-muted-foreground">GitOps Edition - Master the complete DevOps pipeline!</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <DevOpsAdventureGitOps />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-muted-foreground">Complete all 7 stages to master the GitOps workflow</p>
        </motion.div>
      </div>
    </div>
  )
}
