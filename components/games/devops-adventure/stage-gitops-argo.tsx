"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GitBranch, RefreshCw, Check, FileJson, Box } from "lucide-react"

interface StageGitOpsArgoProps {
  onSuccess: () => void
}

export function StageGitOpsArgo({ onSuccess }: StageGitOpsArgoProps) {
  const [manifestDropped, setManifestDropped] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isOverDropZone, setIsOverDropZone] = useState(false)
  const [driftDetected, setDriftDetected] = useState(false)
  const [syncClicked, setSyncClicked] = useState(false)
  const [showingSync, setShowingSync] = useState(false)
  const [podsRolling, setPodsRolling] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const constraintsRef = useRef<HTMLDivElement>(null)

  const checkDropZone = useCallback((clientX: number, clientY: number) => {
    if (!dropZoneRef.current) return false
    const dropRect = dropZoneRef.current.getBoundingClientRect()

    const padding = 20
    return (
      clientX >= dropRect.left - padding &&
      clientX <= dropRect.right + padding &&
      clientY >= dropRect.top - padding &&
      clientY <= dropRect.bottom + padding
    )
  }, [])

  const handleDrag = useCallback(
    (event: PointerEvent | MouseEvent | TouchEvent) => {
      let clientX: number, clientY: number

      if ("touches" in event && event.touches.length > 0) {
        clientX = event.touches[0].clientX
        clientY = event.touches[0].clientY
      } else if ("clientX" in event) {
        clientX = event.clientX
        clientY = event.clientY
      } else {
        return
      }

      setIsOverDropZone(checkDropZone(clientX, clientY))
    },
    [checkDropZone],
  )

  const handleDragEnd = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent) => {
      setIsDragging(false)

      let clientX: number, clientY: number

      if ("changedTouches" in event && event.changedTouches.length > 0) {
        clientX = event.changedTouches[0].clientX
        clientY = event.changedTouches[0].clientY
      } else if ("clientX" in event) {
        clientX = event.clientX
        clientY = event.clientY
      } else {
        setIsOverDropZone(false)
        return
      }

      const droppedInZone = checkDropZone(clientX, clientY)
      setIsOverDropZone(false)

      if (droppedInZone) {
        setManifestDropped(true)
        setTimeout(() => setDriftDetected(true), 1000)
      }
    },
    [checkDropZone],
  )

  const handleSyncClick = () => {
    if (!driftDetected || syncClicked) return

    setSyncClicked(true)
    setShowingSync(true)

    setTimeout(() => {
      setShowingSync(false)
      setPodsRolling(true)

      setTimeout(() => {
        setPodsRolling(false)
        setIsComplete(true)
        setTimeout(onSuccess, 2000)
      }, 2000)
    }, 1500)
  }

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 p-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-foreground"
      >
        Stage 4: GitOps with ArgoCD
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center text-sm text-muted-foreground"
      >
        {!manifestDropped
          ? "Drag the K8s manifest to the GitOps repo"
          : !driftDetected
            ? "ArgoCD detecting changes..."
            : !syncClicked
              ? "Click the blinking Sync button!"
              : "Syncing deployment..."}
      </motion.p>

      <div ref={constraintsRef} className="flex w-full items-center justify-center gap-8 py-4">
        {/* Manifest to drag */}
        <AnimatePresence>
          {!manifestDropped && (
            <motion.div
              drag
              dragConstraints={constraintsRef}
              dragElastic={0.1}
              dragMomentum={false}
              onDragStart={() => setIsDragging(true)}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: isDragging ? 1.1 : 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="flex h-20 w-20 cursor-grab flex-col items-center justify-center rounded-xl border-2 border-dashed border-yellow-500/50 bg-yellow-500/10 backdrop-blur-sm active:cursor-grabbing"
              style={{ touchAction: "none" }}
            >
              <FileJson className="mb-1 h-6 w-6 text-yellow-400" />
              <span className="text-xs font-medium text-yellow-400">deploy.yaml</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* GitOps Repo */}
        <motion.div
          ref={dropZoneRef}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: isOverDropZone ? 1.1 : 1,
            borderColor: isOverDropZone
              ? "hsl(var(--primary))"
              : isDragging
                ? "hsl(var(--primary) / 0.5)"
                : "hsl(var(--border))",
            boxShadow: isOverDropZone
              ? "0 0 40px hsl(var(--primary) / 0.5)"
              : isDragging
                ? "0 0 20px hsl(var(--primary) / 0.2)"
                : "none",
          }}
          transition={{ duration: 0.2 }}
          className="relative flex h-24 w-24 flex-col items-center justify-center rounded-xl border-2 border-border/50 bg-card/60 backdrop-blur-sm"
        >
          <GitBranch className="mb-1 h-6 w-6 text-orange-400" />
          <span className="text-xs font-medium text-foreground">GitOps Repo</span>

          {isDragging && !isOverDropZone && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -bottom-6 text-xs text-muted-foreground"
            >
              Drop here
            </motion.span>
          )}

          {manifestDropped && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500"
            >
              <Check className="h-3 w-3 text-white" />
            </motion.div>
          )}
        </motion.div>

        {/* ArgoCD Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex h-24 w-32 flex-col items-center justify-center rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm"
        >
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/20">
            <RefreshCw className={`h-4 w-4 text-orange-400 ${showingSync ? "animate-spin" : ""}`} />
          </div>
          <span className="mb-2 text-xs font-medium text-foreground">ArgoCD</span>

          {/* Sync Button */}
          {driftDetected && !syncClicked && (
            <motion.button
              onClick={handleSyncClick}
              animate={{
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 0 0 0 rgba(34, 197, 94, 0)",
                  "0 0 0 8px rgba(34, 197, 94, 0.3)",
                  "0 0 0 0 rgba(34, 197, 94, 0)",
                ],
              }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              className="rounded-md border border-green-500/50 bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400"
            >
              Sync
            </motion.button>
          )}

          {syncClicked && !isComplete && <span className="text-xs text-muted-foreground">Syncing...</span>}
        </motion.div>
      </div>

      {/* Pods Rolling Out */}
      <AnimatePresence>
        {podsRolling && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.3, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.5 }}
                className="flex h-12 w-12 flex-col items-center justify-center rounded-lg border border-green-500/50 bg-green-500/20"
              >
                <Box className="h-5 w-5 text-green-400" />
                <span className="mt-1 text-xs text-green-400">Pod</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

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
              <span className="font-medium text-green-400">GitOps Sync Successful via ArgoCD</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
