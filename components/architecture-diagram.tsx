"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ZoomIn, ZoomOut, Maximize2, X, ExternalLink } from "lucide-react"
import type { ArchitectureDiagram as DiagramType } from "@/lib/data"

interface ArchitectureDiagramProps {
  diagram: DiagramType
  className?: string
}

export function ArchitectureDiagram({ diagram, className = "" }: ArchitectureDiagramProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(diagram.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [diagram.content])

  // Handle escape key for fullscreen
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isFullscreen])

  // Prevent body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isFullscreen])

  const renderMermaidDiagram = () => {
    // Simple text-based Mermaid rendering for SSR/compatibility
    // In production, you'd use @kevingivens/mermaid or mermaid.js
    const lines = diagram.content.split("\n")
    const nodes: Record<string, { type: string; label: string; connections: string[] }> = {}
    const connections: { from: string; to: string; label?: string }[] = []

    lines.forEach((line) => {
      const trimmed = line.trim()
      if (trimmed.startsWith("subgraph")) {
        // Skip subgraph definitions for now
        return
      }
      if (trimmed === "end" || !trimmed) {
        return
      }

      // Match node definitions like: Node[("Label")] or Node[("Label")]
      const nodeMatch = trimmed.match(/^([A-Za-z0-9]+)\[\("(.+?)"\)\]/)
      if (nodeMatch) {
        const [, id, label] = nodeMatch
        nodes[id] = { type: "default", label, connections: [] }
      }

      // Match connections like: A --> B or A -->|label| B
      const connMatch = trimmed.match(/^([A-Za-z0-9]+)\s*-->(?:\|([^|]+)\|)?\s*([A-Za-z0-9]+)/)
      if (connMatch) {
        const [, from, label, to] = connMatch
        connections.push({ from, to, label })
        if (nodes[from]) {
          nodes[from].connections.push(to)
        }
      }
    })

    return { nodes, connections }
  }

  const { nodes, connections } = diagram.type === "mermaid" ? renderMermaidDiagram() : { nodes: {}, connections: [] }

  return (
    <>
      <motion.div
        className={`relative rounded-xl overflow-hidden glass ${className}`}
        layoutId={`diagram-${diagram.caption || "default"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Architecture Diagram
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-1.5 rounded-md hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
              title={isZoomed ? "Zoom out" : "Zoom in"}
            >
              {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsFullscreen(true)}
              className="p-1.5 rounded-md hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Diagram Content */}
        <div
          className={`p-4 overflow-auto ${isZoomed ? "scale-110 origin-top-left" : ""} transition-transform`}
          style={{ minHeight: "250px" }}
        >
          {diagram.type === "mermaid" && (
            <div className="flex flex-col gap-6">
              {/* Nodes and connections visualization */}
              <div className="relative min-h-[200px]">
                <svg
                  className="w-full h-full absolute inset-0"
                  style={{ minHeight: "200px" }}
                  viewBox="0 0 800 250"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon
                        points="0 0, 10 3.5, 0 7"
                        fill="oklch(0.55 0.02 260 / 0.6)"
                      />
                    </marker>
                    <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>

                  {/* Render connections */}
                  {connections.map((conn, i) => {
                    const fromNode = Object.entries(nodes).find(([key]) =>
                      key.toLowerCase().includes(conn.from.toLowerCase())
                    )
                    const toNode = Object.entries(nodes).find(([key]) =>
                      key.toLowerCase().includes(conn.to.toLowerCase())
                    )
                    if (!fromNode || !toNode) return null

                    const fromIdx = Object.keys(nodes).indexOf(fromNode[0])
                    const toIdx = Object.keys(nodes).indexOf(toNode[0])

                    const x1 = 80 + fromIdx * 150
                    const y1 = 50
                    const x2 = 80 + toIdx * 150
                    const y2 = 150

                    return (
                      <g key={i}>
                        <line
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="oklch(0.55 0.02 260 / 0.4)"
                          strokeWidth="2"
                          markerEnd="url(#arrowhead)"
                        />
                        {conn.label && (
                          <text
                            x={(x1 + x2) / 2}
                            y={(y1 + y2) / 2}
                            textAnchor="middle"
                            className="fill-muted-foreground"
                            fontSize="10"
                          >
                            {conn.label}
                          </text>
                        )}
                      </g>
                    )
                  })}

                  {/* Render nodes */}
                  {Object.entries(nodes).map(([key, node], i) => {
                    const x = 80 + i * 150
                    return (
                      <g key={key} transform={`translate(${x - 60}, 0)`}>
                        {/* Node rectangle */}
                        <rect
                          x="0"
                          y={node.connections.length > 0 ? 25 : 75}
                          width="120"
                          height="50"
                          rx="8"
                          fill="url(#nodeGradient)"
                          stroke="var(--primary)"
                          strokeWidth="1"
                          strokeOpacity="0.5"
                        />
                        {/* Node icon placeholder */}
                        <rect
                          x="8"
                          y={node.connections.length > 0 ? 33 : 83}
                          width="34"
                          height="34"
                          rx="6"
                          fill="var(--primary)"
                          fillOpacity="0.2"
                        />
                        {/* Node label */}
                        <text
                          x="50"
                          y={node.connections.length > 0 ? 58 : 108}
                          textAnchor="middle"
                          className="fill-foreground"
                          fontSize="11"
                          fontWeight="500"
                        >
                          {node.label.length > 12 ? node.label.slice(0, 12) + "..." : node.label}
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </div>

              {/* Mermaid source code */}
              <details className="group">
                <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <span>View Mermaid source</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-muted/50 text-[10px] font-mono">
                    click to expand
                  </kbd>
                </summary>
                <div className="mt-2 relative">
                  <pre className="p-3 rounded-lg bg-muted/30 text-xs font-mono overflow-x-auto">
                    <code className="text-muted-foreground">{diagram.content}</code>
                  </pre>
                  <button
                    onClick={copyToClipboard}
                    className="absolute top-2 right-2 p-1.5 rounded-md bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-xs"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </details>
            </div>
          )}

          {diagram.type === "image" && (
            <div className="relative">
              <img
                src={diagram.content}
                alt={diagram.caption || "Architecture diagram"}
                className="w-full h-auto rounded-lg"
              />
              <a
                href={diagram.content}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-2 right-2 p-2 rounded-lg bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        {/* Caption */}
        {diagram.caption && (
          <div className="px-4 py-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground italic">{diagram.caption}</p>
          </div>
        )}
      </motion.div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              layoutId={`diagram-${diagram.caption || "default"}`}
              className="w-full max-w-6xl max-h-[90vh] rounded-xl overflow-hidden glass"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fullscreen header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                <span className="text-sm font-medium text-muted-foreground">
                  {diagram.caption || "Architecture Diagram"}
                </span>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Fullscreen content */}
              <div className="p-6 overflow-auto max-h-[calc(90vh-60px)]">
                {diagram.type === "mermaid" && (
                  <pre className="text-sm font-mono whitespace-pre-wrap text-foreground">
                    {diagram.content}
                  </pre>
                )}
                {diagram.type === "image" && (
                  <img
                    src={diagram.content}
                    alt={diagram.caption || "Architecture diagram"}
                    className="w-full h-auto"
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}