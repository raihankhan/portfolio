"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Package, TestTube, Hammer, Container, Database, Check } from "lucide-react"

interface StageCIPipelineProps {
  onSuccess: () => void
}

const PIPELINE_STEPS = [
  { id: "install", label: "Install Dependencies", icon: Package, timing: { start: 0.3, end: 0.7 } },
  { id: "test", label: "Run Tests", icon: TestTube, timing: { start: 0.4, end: 0.6 } },
  { id: "build", label: "Build Artifacts", icon: Hammer, timing: { start: 0.35, end: 0.65 } },
  { id: "docker", label: "Docker Build", icon: Container, timing: { start: 0.25, end: 0.75 } },
  { id: "cache", label: "Cache Reuse", icon: Database, timing: { start: 0.5, end: 0.9 } },
]

export function StageCIPipeline({ onSuccess }: StageCIPipelineProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [stepProgress, setStepProgress] = useState(0)
  const [clickTiming, setClickTiming] = useState<"perfect" | "good" | "miss" | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [showFinalBadge, setShowFinalBadge] = useState(false)

  useEffect(() => {
    if (isAnimating || currentStep >= PIPELINE_STEPS.length) return

    const interval = setInterval(() => {
      setStepProgress((prev) => {
        if (prev >= 1) {
          setClickTiming("miss")
          setTimeout(() => {
            setClickTiming(null)
            setStepProgress(0)
          }, 500)
          return 0
        }
        return prev + 0.02
      })
    }, 30)

    return () => clearInterval(interval)
  }, [isAnimating, currentStep])

  const handleClick = () => {
    if (isAnimating || currentStep >= PIPELINE_STEPS.length) return

    const step = PIPELINE_STEPS[currentStep]
    const { start, end } = step.timing

    setIsAnimating(true)

    if (stepProgress >= start && stepProgress <= end) {
      const midPoint = (start + end) / 2
      const tolerance = (end - start) / 4
      const isPerfect = Math.abs(stepProgress - midPoint) <= tolerance

      setClickTiming(isPerfect ? "perfect" : "good")
      setCompletedSteps((prev) => [...prev, currentStep])

      setTimeout(() => {
        setClickTiming(null)
        setStepProgress(0)
        setIsAnimating(false)

        if (currentStep < PIPELINE_STEPS.length - 1) {
          setCurrentStep((prev) => prev + 1)
        } else {
          setShowFinalBadge(true)
          setTimeout(onSuccess, 2000)
        }
      }, 800)
    } else {
      setClickTiming("miss")
      setTimeout(() => {
        setClickTiming(null)
        setStepProgress(0)
        setIsAnimating(false)
      }, 500)
    }
  }

  const currentStepData = PIPELINE_STEPS[currentStep]
  const StepIcon = currentStepData?.icon

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 p-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-foreground"
      >
        Stage 2: CI Pipeline Execution
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center text-sm text-muted-foreground"
      >
        Click when the indicator is in the green zone!
      </motion.p>

      {/* Pipeline Steps Progress */}
      <div className="flex items-center gap-2">
        {PIPELINE_STEPS.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
              completedSteps.includes(index)
                ? "border-green-500/50 bg-green-500/20"
                : index === currentStep
                  ? "border-primary/50 bg-primary/20"
                  : "border-border/50 bg-card/40"
            }`}
          >
            {completedSteps.includes(index) ? (
              <Check className="h-5 w-5 text-green-400" />
            ) : (
              <step.icon className={`h-5 w-5 ${index === currentStep ? "text-primary" : "text-muted-foreground"}`} />
            )}
          </motion.div>
        ))}
      </div>

      {/* Current Step */}
      {!showFinalBadge && currentStepData && (
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-2">
            {StepIcon && <StepIcon className="h-5 w-5 text-primary" />}
            <span className="font-medium text-foreground">{currentStepData.label}</span>
          </div>

          {/* Timing Bar */}
          <div className="relative mb-6 h-8 w-64 overflow-hidden rounded-lg border border-border/50 bg-card/60">
            {/* Green Zone */}
            <div
              className="absolute top-0 h-full bg-green-500/30"
              style={{
                left: `${currentStepData.timing.start * 100}%`,
                width: `${(currentStepData.timing.end - currentStepData.timing.start) * 100}%`,
              }}
            />
            {/* Perfect Zone */}
            <div
              className="absolute top-0 h-full bg-green-500/50"
              style={{
                left: `${((currentStepData.timing.start + currentStepData.timing.end) / 2 - 0.05) * 100}%`,
                width: "10%",
              }}
            />
            {/* Indicator */}
            <motion.div
              className="absolute top-0 h-full w-1 bg-primary shadow-[0_0_10px_hsl(var(--primary))]"
              style={{ left: `${stepProgress * 100}%` }}
            />
          </div>

          {/* Click Button */}
          <motion.button
            onClick={handleClick}
            disabled={isAnimating}
            className={`rounded-xl px-8 py-3 font-medium transition-all ${
              clickTiming === "perfect"
                ? "border-green-500 bg-green-500/20 text-green-400"
                : clickTiming === "good"
                  ? "border-yellow-500 bg-yellow-500/20 text-yellow-400"
                  : clickTiming === "miss"
                    ? "border-red-500 bg-red-500/20 text-red-400"
                    : "border-primary/50 bg-primary/10 text-primary hover:bg-primary/20"
            } border`}
            whileHover={!isAnimating ? { scale: 1.05 } : {}}
            whileTap={!isAnimating ? { scale: 0.95 } : {}}
          >
            {clickTiming === "perfect"
              ? "Perfect!"
              : clickTiming === "good"
                ? "Good!"
                : clickTiming === "miss"
                  ? "Miss!"
                  : "Execute"}
          </motion.button>
        </motion.div>
      )}

      {/* Final Badge */}
      <AnimatePresence>
        {showFinalBadge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 3 }}
              className="flex h-20 w-20 items-center justify-center rounded-2xl border border-green-500/50 bg-green-500/20"
            >
              <Check className="h-10 w-10 text-green-400" />
            </motion.div>
            <div className="rounded-lg border border-green-500/50 bg-green-500/20 px-4 py-2">
              <span className="font-mono text-sm text-green-400">CI Passed</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
