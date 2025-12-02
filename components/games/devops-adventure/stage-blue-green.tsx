"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Server, ArrowRightLeft, Check } from "lucide-react"

interface StageBlueGreenProps {
  onSuccess: () => void
}

export function StageBlueGreen({ onSuccess }: StageBlueGreenProps) {
  const [activeEnv, setActiveEnv] = useState<"blue" | "green">("blue")
  const [isSwitching, setIsSwitching] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleSwitch = () => {
    if (isSwitching || isComplete) return

    setIsSwitching(true)

    setTimeout(() => {
      setActiveEnv("green")
      setIsSwitching(false)
      setIsComplete(true)
      setTimeout(onSuccess, 2000)
    }, 1500)
  }

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 p-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-foreground"
      >
        Stage 5B: Blue-Green Deployment
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center text-sm text-muted-foreground"
      >
        Switch traffic instantly from Blue to Green environment
      </motion.p>

      {/* Environment Cards */}
      <div className="flex items-center gap-8">
        {/* Blue Environment */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{
            opacity: activeEnv === "blue" && !isSwitching ? 1 : 0.4,
            x: 0,
            scale: activeEnv === "blue" && !isSwitching ? 1 : 0.95,
          }}
          className={`relative flex h-36 w-36 flex-col items-center justify-center rounded-xl border-2 transition-colors ${
            activeEnv === "blue" && !isSwitching ? "border-blue-500 bg-blue-500/20" : "border-blue-500/30 bg-blue-500/5"
          }`}
        >
          <Server className="mb-2 h-10 w-10 text-blue-400" />
          <span className="text-sm font-medium text-blue-400">Blue Environment</span>
          <span className="mt-1 text-xs text-blue-400/70">v1.0.0</span>

          {activeEnv === "blue" && !isSwitching && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500"
            >
              <Check className="h-4 w-4 text-white" />
            </motion.div>
          )}
        </motion.div>

        {/* Switch Arrow */}
        <motion.div
          animate={{
            x: isSwitching ? [0, 20, 0] : 0,
            opacity: isSwitching ? [1, 0.5, 1] : 1,
          }}
          transition={{ duration: 0.5, repeat: isSwitching ? Number.POSITIVE_INFINITY : 0 }}
        >
          <ArrowRightLeft className="h-8 w-8 text-muted-foreground" />
        </motion.div>

        {/* Green Environment */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{
            opacity: activeEnv === "green" || isSwitching ? 1 : 0.4,
            x: 0,
            scale: activeEnv === "green" ? 1 : 0.95,
          }}
          className={`relative flex h-36 w-36 flex-col items-center justify-center rounded-xl border-2 transition-colors ${
            activeEnv === "green"
              ? "border-green-500 bg-green-500/20"
              : isSwitching
                ? "border-green-500/70 bg-green-500/10"
                : "border-green-500/30 bg-green-500/5"
          }`}
        >
          <Server className="mb-2 h-10 w-10 text-green-400" />
          <span className="text-sm font-medium text-green-400">Green Environment</span>
          <span className="mt-1 text-xs text-green-400/70">v2.0.0</span>

          {activeEnv === "green" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500"
            >
              <Check className="h-4 w-4 text-white" />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Switch Button */}
      {!isComplete && (
        <motion.button
          onClick={handleSwitch}
          disabled={isSwitching}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-xl border border-green-500/50 bg-green-500/10 px-6 py-3 font-medium text-green-400 transition-colors hover:bg-green-500/20 disabled:opacity-50"
          whileHover={!isSwitching ? { scale: 1.05 } : {}}
          whileTap={!isSwitching ? { scale: 0.95 } : {}}
        >
          <ArrowRightLeft className={`h-4 w-4 ${isSwitching ? "animate-spin" : ""}`} />
          {isSwitching ? "Switching..." : "Switch Traffic"}
        </motion.button>
      )}

      {/* Success Toast */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="rounded-xl border border-green-500/50 bg-green-500/20 px-6 py-3 shadow-lg backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-400" />
              <span className="font-medium text-green-400">Blue-Green Switch Successful</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
