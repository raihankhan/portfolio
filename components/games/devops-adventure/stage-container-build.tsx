"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Box, Package, FileCode, Terminal, Check, Upload } from "lucide-react"

interface StageContainerBuildProps {
  onSuccess: () => void
}

const CONTAINER_LAYERS = [
  { id: "base", label: "Base Image", icon: Box, code: "FROM node:18-alpine" },
  { id: "deps", label: "Dependencies", icon: Package, code: "RUN npm install" },
  { id: "app", label: "App Code", icon: FileCode, code: "COPY . /app" },
  { id: "cmd", label: "CMD", icon: Terminal, code: 'CMD ["npm", "start"]' },
]

export function StageContainerBuild({ onSuccess }: StageContainerBuildProps) {
  const [selectedLayers, setSelectedLayers] = useState<string[]>([])
  const [showError, setShowError] = useState(false)
  const [isBuilding, setIsBuilding] = useState(false)
  const [isPushing, setIsPushing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleLayerClick = (layerId: string) => {
    if (isBuilding || isComplete) return

    const expectedNext = CONTAINER_LAYERS[selectedLayers.length]?.id

    if (layerId === expectedNext) {
      setSelectedLayers((prev) => [...prev, layerId])
      setShowError(false)

      if (selectedLayers.length === CONTAINER_LAYERS.length - 1) {
        // All layers selected correctly
        setIsBuilding(true)
        setTimeout(() => {
          setIsBuilding(false)
          setIsPushing(true)
          setTimeout(() => {
            setIsPushing(false)
            setIsComplete(true)
            setTimeout(onSuccess, 1500)
          }, 1500)
        }, 1500)
      }
    } else {
      setShowError(true)
      setTimeout(() => setShowError(false), 500)
    }
  }

  const availableLayers = CONTAINER_LAYERS.filter((layer) => !selectedLayers.includes(layer.id))

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 p-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-foreground"
      >
        Stage 3: Containerization
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center text-sm text-muted-foreground"
      >
        Click the Dockerfile layers in the correct order
      </motion.p>

      <div className="flex gap-8">
        {/* Available Layers */}
        <div className="w-48">
          <h3 className="mb-3 text-xs font-medium text-muted-foreground">Available Layers</h3>
          <div className="flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {availableLayers.map((layer) => (
                <motion.button
                  key={layer.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0, scale: showError ? [1, 1.05, 0.95, 1] : 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => handleLayerClick(layer.id)}
                  disabled={isBuilding || isComplete}
                  className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/60 px-3 py-2 text-left transition-colors hover:border-primary/50 hover:bg-primary/10 disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <layer.icon className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground">{layer.label}</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Dockerfile Preview */}
        <div className="w-64">
          <h3 className="mb-3 text-xs font-medium text-muted-foreground">Dockerfile</h3>
          <div className="min-h-[200px] rounded-xl border border-border/50 bg-background/80 p-4 font-mono text-xs">
            <AnimatePresence mode="popLayout">
              {selectedLayers.map((layerId) => {
                const layer = CONTAINER_LAYERS.find((l) => l.id === layerId)
                return (
                  <motion.div
                    key={layerId}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-2 text-green-400"
                  >
                    {layer?.code}
                  </motion.div>
                )
              })}
            </AnimatePresence>
            {selectedLayers.length < CONTAINER_LAYERS.length && !isBuilding && (
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                className="text-muted-foreground"
              >
                # Select next layer...
              </motion.span>
            )}
          </div>
        </div>
      </div>

      {/* Building Animation */}
      <AnimatePresence>
        {isBuilding && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="h-4 w-4 rounded-full border-2 border-blue-400 border-t-transparent"
            />
            <span className="font-mono text-sm text-blue-400">docker build -t devops-app:v1 .</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pushing Animation */}
      <AnimatePresence>
        {isPushing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-2"
          >
            <Upload className="h-4 w-4 text-purple-400" />
            <span className="font-mono text-sm text-purple-400">Pushing to registry...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 rounded-lg border border-green-500/50 bg-green-500/20 px-6 py-3"
          >
            <Check className="h-5 w-5 text-green-400" />
            <span className="font-medium text-green-400">Image pushed to registry!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
