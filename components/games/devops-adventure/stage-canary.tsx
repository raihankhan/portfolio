"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Box, ArrowRight, Check } from "lucide-react"

interface StageCanaryProps {
  onSuccess: () => void
}

const TRAFFIC_STEPS = [10, 50, 100]

export function StageCanary({ onSuccess }: StageCanaryProps) {
  const [trafficPercent, setTrafficPercent] = useState(0)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [showError, setShowError] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleSliderChange = (value: number) => {
    const expectedValue = TRAFFIC_STEPS[currentStepIndex]

    if (Math.abs(value - expectedValue) <= 5) {
      setTrafficPercent(expectedValue)
      setShowError(false)

      setTimeout(() => {
        if (currentStepIndex < TRAFFIC_STEPS.length - 1) {
          setCurrentStepIndex((prev) => prev + 1)
        } else {
          setIsComplete(true)
          setTimeout(onSuccess, 2000)
        }
      }, 800)
    } else if (value > TRAFFIC_STEPS[currentStepIndex]) {
      setShowError(true)
      setTimeout(() => setShowError(false), 500)
    } else {
      setTrafficPercent(value)
    }
  }

  const v1Traffic = 100 - trafficPercent
  const v2Traffic = trafficPercent

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 p-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-foreground"
      >
        Stage 5A: Canary Deployment
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center text-sm text-muted-foreground"
      >
        Gradually shift traffic from v1 to v2: {TRAFFIC_STEPS[currentStepIndex]}% target
      </motion.p>

      {/* Version Cards */}
      <div className="flex items-center gap-8">
        {/* V1 Stable */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative flex h-32 w-32 flex-col items-center justify-center rounded-xl border border-blue-500/50 bg-blue-500/10"
        >
          <Box className="mb-2 h-8 w-8 text-blue-400" />
          <span className="text-sm font-medium text-blue-400">v1 (stable)</span>
          <motion.div
            className="absolute -top-3 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-400"
            animate={{ scale: v1Traffic > 0 ? 1 : 0.8, opacity: v1Traffic > 0 ? 1 : 0.5 }}
          >
            {v1Traffic}%
          </motion.div>

          {/* Traffic indicator pods */}
          <div className="mt-2 flex gap-1">
            {Array.from({ length: Math.ceil(v1Traffic / 25) }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1, backgroundColor: "rgb(59, 130, 246)" }}
                className="h-2 w-2 rounded-full"
              />
            ))}
          </div>
        </motion.div>

        <ArrowRight className="h-6 w-6 text-muted-foreground" />

        {/* V2 Canary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative flex h-32 w-32 flex-col items-center justify-center rounded-xl border border-green-500/50 bg-green-500/10"
        >
          <Box className="mb-2 h-8 w-8 text-green-400" />
          <span className="text-sm font-medium text-green-400">v2 (canary)</span>
          <motion.div
            className="absolute -top-3 rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400"
            animate={{ scale: v2Traffic > 0 ? 1 : 0.8, opacity: v2Traffic > 0 ? 1 : 0.5 }}
          >
            {v2Traffic}%
          </motion.div>

          {/* Traffic indicator pods */}
          <div className="mt-2 flex gap-1">
            {Array.from({ length: Math.ceil(v2Traffic / 25) }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1, backgroundColor: "rgb(34, 197, 94)" }}
                transition={{ delay: i * 0.1 }}
                className="h-2 w-2 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Traffic Slider */}
      {!isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            x: showError ? [0, -10, 10, -10, 10, 0] : 0,
          }}
          transition={{ x: { duration: 0.4 } }}
          className="w-64"
        >
          <input
            type="range"
            min="0"
            max="100"
            value={trafficPercent}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className="w-full cursor-pointer accent-primary"
          />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </motion.div>
      )}

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {TRAFFIC_STEPS.map((step, index) => (
          <motion.div
            key={step}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
              index < currentStepIndex || isComplete
                ? "border-green-500/50 bg-green-500/20 text-green-400"
                : index === currentStepIndex
                  ? "border-primary/50 bg-primary/20 text-primary"
                  : "border-border/50 bg-card/40 text-muted-foreground"
            } border`}
          >
            {index < currentStepIndex || isComplete ? <Check className="h-4 w-4" /> : `${step}%`}
          </motion.div>
        ))}
      </div>

      {/* Success */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 rounded-lg border border-green-500/50 bg-green-500/20 px-6 py-3"
          >
            <Check className="h-5 w-5 text-green-400" />
            <span className="font-medium text-green-400">v2 is now stable!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
