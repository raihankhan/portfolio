"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileCode, GitBranch, Check, ArrowRight } from "lucide-react"

interface StageCommitProps {
  onSuccess: () => void
}

export function StageCommit({ onSuccess }: StageCommitProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isDropped, setIsDropped] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isOverDropZone, setIsOverDropZone] = useState(false)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const constraintsRef = useRef<HTMLDivElement>(null)

  const checkDropZone = useCallback((clientX: number, clientY: number) => {
    if (!dropZoneRef.current) return false
    const dropRect = dropZoneRef.current.getBoundingClientRect()

    // Expand hit area for easier dropping
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
        setIsDropped(true)
        setTimeout(() => {
          setShowSuccess(true)
          setTimeout(onSuccess, 1500)
        }, 800)
      }
    },
    [checkDropZone, onSuccess],
  )

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-8 p-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-foreground"
      >
        Stage 1: Code Commit
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center text-sm text-muted-foreground"
      >
        Drag the code file to the Git repository to commit your changes
      </motion.p>

      <div ref={constraintsRef} className="flex w-full items-center justify-center gap-16 py-4">
        {/* Draggable Code File */}
        <AnimatePresence>
          {!isDropped && (
            <motion.div
              drag
              dragConstraints={constraintsRef}
              dragElastic={0.1}
              dragMomentum={false}
              onDragStart={() => setIsDragging(true)}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: isDragging ? 1.1 : 1,
                rotate: isDragging ? 5 : 0,
              }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: 1.05 }}
              className="flex h-24 w-24 cursor-grab flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/50 bg-primary/10 backdrop-blur-sm active:cursor-grabbing"
              style={{ touchAction: "none" }}
            >
              <FileCode className="mb-2 h-8 w-8 text-primary" />
              <span className="text-xs font-medium text-primary">app.ts</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Arrow */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.3 }}>
          <ArrowRight className="h-8 w-8 text-muted-foreground" />
        </motion.div>

        {/* Git Repository Drop Zone */}
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
          className="relative flex h-28 w-28 flex-col items-center justify-center rounded-xl border-2 border-border/50 bg-card/60 backdrop-blur-sm"
        >
          <GitBranch className="mb-2 h-8 w-8 text-orange-400" />
          <span className="text-xs font-medium text-foreground">Git Repo</span>

          {/* Drop hint */}
          {isDragging && !isOverDropZone && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -bottom-6 text-xs text-muted-foreground"
            >
              Drop here
            </motion.span>
          )}

          {/* Show dropped file */}
          <AnimatePresence>
            {isDropped && (
              <motion.div
                initial={{ opacity: 0, scale: 0, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20"
              >
                <FileCode className="h-5 w-5 text-primary" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Git Push Animation */}
      <AnimatePresence>
        {isDropped && !showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="h-4 w-4 rounded-full border-2 border-green-400 border-t-transparent"
            />
            <span className="font-mono text-sm text-green-400">git push origin main...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 rounded-lg border border-green-500/50 bg-green-500/20 px-6 py-3"
          >
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
              <Check className="h-5 w-5 text-green-400" />
            </motion.div>
            <span className="font-medium text-green-400">Code committed successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
