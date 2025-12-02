"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { StageCommit } from "./stage-commit"
import { StageCIPipeline } from "./stage-ci-pipeline"
import { StageContainerBuild } from "./stage-container-build"
import { StageGitOpsArgo } from "./stage-gitops-argo"
import { StageCanary } from "./stage-canary"
import { StageBlueGreen } from "./stage-blue-green"
import { StageObservability } from "./stage-observability"
import { StageVictory } from "./stage-victory"

type Stage = "commit" | "ci" | "container" | "gitops" | "canary" | "bluegreen" | "observability" | "victory"

const STAGES: { id: Stage; label: string }[] = [
  { id: "commit", label: "Commit" },
  { id: "ci", label: "CI Pipeline" },
  { id: "container", label: "Container" },
  { id: "gitops", label: "GitOps" },
  { id: "canary", label: "Canary" },
  { id: "bluegreen", label: "Blue-Green" },
  { id: "observability", label: "Observability" },
  { id: "victory", label: "Complete" },
]

export function DevOpsAdventureGitOps() {
  const [currentStage, setCurrentStage] = useState<Stage>("commit")

  const currentStageIndex = STAGES.findIndex((s) => s.id === currentStage)

  const advanceStage = () => {
    const nextIndex = currentStageIndex + 1
    if (nextIndex < STAGES.length) {
      setCurrentStage(STAGES[nextIndex].id)
    }
  }

  const resetGame = () => {
    setCurrentStage("commit")
  }

  return (
    <div className="flex flex-col">
      {/* Progress Bar */}
      <div className="mb-6 px-4">
        <div className="flex items-center justify-between">
          {STAGES.slice(0, -1).map((stage, index) => (
            <div key={stage.id} className="flex flex-1 items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{
                  scale: index <= currentStageIndex ? 1 : 0.8,
                  backgroundColor:
                    index < currentStageIndex
                      ? "hsl(var(--primary))"
                      : index === currentStageIndex
                        ? "hsl(var(--primary) / 0.5)"
                        : "hsl(var(--muted))",
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-primary-foreground"
              >
                {index < currentStageIndex ? "✓" : index + 1}
              </motion.div>
              {index < STAGES.length - 2 && (
                <div className="mx-1 h-1 flex-1 rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: index < currentStageIndex ? "100%" : "0%" }}
                    className="h-full rounded-full bg-primary"
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between px-1">
          {STAGES.slice(0, -1).map((stage, index) => (
            <span
              key={stage.id}
              className={`text-xs ${index <= currentStageIndex ? "text-primary" : "text-muted-foreground"}`}
              style={{ width: index === STAGES.length - 2 ? "auto" : `${100 / (STAGES.length - 1)}%` }}
            >
              {stage.label}
            </span>
          ))}
        </div>
      </div>

      {/* Stage Content */}
      <div className="min-h-[450px] rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {currentStage === "commit" && <StageCommit onSuccess={advanceStage} />}
            {currentStage === "ci" && <StageCIPipeline onSuccess={advanceStage} />}
            {currentStage === "container" && <StageContainerBuild onSuccess={advanceStage} />}
            {currentStage === "gitops" && <StageGitOpsArgo onSuccess={advanceStage} />}
            {currentStage === "canary" && <StageCanary onSuccess={advanceStage} />}
            {currentStage === "bluegreen" && <StageBlueGreen onSuccess={advanceStage} />}
            {currentStage === "observability" && <StageObservability onSuccess={advanceStage} />}
            {currentStage === "victory" && <StageVictory onPlayAgain={resetGame} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
