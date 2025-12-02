"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Activity, Clock, AlertTriangle, Check } from "lucide-react"

interface StageObservabilityProps {
  onSuccess: () => void
}

const METRICS = [
  { id: "latency", label: "Latency", unit: "ms", normal: 45, spiked: 850 },
  { id: "errors", label: "Error Rate", unit: "%", normal: 0.1, spiked: 15.8 },
  { id: "cpu", label: "CPU Usage", unit: "%", normal: 35, spiked: 42 },
]

export function StageObservability({ onSuccess }: StageObservabilityProps) {
  const [spikedMetric, setSpikedMetric] = useState<string | null>(null)
  const [clickedMetric, setClickedMetric] = useState<string | null>(null)
  const [isResolving, setIsResolving] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Randomly spike a metric after mount
    const timer = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * 2) // Only spike latency or errors
      setSpikedMetric(METRICS[randomIndex].id)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleMetricClick = (metricId: string) => {
    if (clickedMetric || !spikedMetric) return

    if (metricId === spikedMetric) {
      setClickedMetric(metricId)
      setIsResolving(true)

      setTimeout(() => {
        setIsResolving(false)
        setSpikedMetric(null)
        setIsComplete(true)
        setTimeout(onSuccess, 2000)
      }, 2000)
    }
  }

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 p-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-foreground"
      >
        Stage 6: Observability & Alert Resolution
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center text-sm text-muted-foreground"
      >
        {!spikedMetric
          ? "Monitoring metrics..."
          : isResolving
            ? "Resolving incident..."
            : "Click the spiking metric to resolve the issue!"}
      </motion.p>

      {/* Mini Dashboard */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm"
      >
        <div className="mb-4 flex items-center gap-2 border-b border-border/50 pb-3">
          <Activity className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Grafana Dashboard</span>
        </div>

        <div className="grid gap-3">
          {METRICS.map((metric) => {
            const isSpiked = spikedMetric === metric.id && !isComplete
            const isClicked = clickedMetric === metric.id
            const value = isSpiked && !isResolving ? metric.spiked : metric.normal

            return (
              <motion.button
                key={metric.id}
                onClick={() => handleMetricClick(metric.id)}
                disabled={!!clickedMetric || !spikedMetric}
                className={`relative flex items-center justify-between rounded-lg border p-3 text-left transition-all ${
                  isSpiked && !isResolving
                    ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20"
                    : isClicked && isResolving
                      ? "border-yellow-500/50 bg-yellow-500/10"
                      : "border-border/50 bg-background/50"
                }`}
                animate={isSpiked && !isResolving ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 0.5, repeat: isSpiked && !isResolving ? Number.POSITIVE_INFINITY : 0 }}
              >
                <div className="flex items-center gap-3">
                  {isSpiked && !isResolving ? (
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  ) : (
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className={`text-sm ${isSpiked && !isResolving ? "text-red-400" : "text-foreground"}`}>
                    {metric.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <motion.span
                    className={`font-mono text-sm ${
                      isSpiked && !isResolving ? "text-red-400" : "text-muted-foreground"
                    }`}
                    animate={isResolving && isClicked ? { opacity: [1, 0.5, 1] } : {}}
                    transition={{ duration: 0.5, repeat: isResolving ? Number.POSITIVE_INFINITY : 0 }}
                  >
                    {value.toFixed(1)} {metric.unit}
                  </motion.span>

                  {/* Mini chart line */}
                  <div className="flex h-4 w-16 items-end gap-px">
                    {Array.from({ length: 8 }).map((_, i) => {
                      const height = isSpiked && !isResolving && i >= 5 ? 100 : 20 + Math.random() * 30
                      return (
                        <motion.div
                          key={i}
                          className={`w-1.5 rounded-t ${
                            isSpiked && !isResolving && i >= 5 ? "bg-red-400" : "bg-primary/50"
                          }`}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      )
                    })}
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

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
              <span className="font-medium text-green-400">Incident Resolved</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
