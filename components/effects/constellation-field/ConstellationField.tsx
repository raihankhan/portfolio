"use client"

/**
 * ConstellationField
 *
 * Canvas 2D + Raw WebGL particle network adapted from the verified ThreeUI
 * Constellation Field source. Adapts the link/node color to the portfolio's
 * active global theme palette (--theme-gradient-1) so it visually integrates
 * with the rest of the design system.
 *
 * Mounted globally behind all page content. Pointer events disabled so the
 * UI above remains interactive while the field drifts in response to the
 * cursor.
 */

import * as React from "react"

export interface ConstellationFieldProps {
  /** Visual mode. "dark" matches the portfolio's dark surface. */
  mode?: "dark" | "light"
  /** Animation speed multiplier. */
  speed?: number
  /** Node size multiplier. */
  size?: number
  /** Link stroke width multiplier. */
  strokeWidth?: number
  /** Link length multiplier (affects the LINK constant). */
  length?: number
  /** Particle density multiplier (0.1 - 2). */
  density?: number
  /** Overall opacity (0 - 1). */
  opacity?: number
  /** Hue shift in degrees applied on top of the theme color. */
  hue?: number
  /** Saturation multiplier for the theme color. */
  saturation?: number
  /** Brightness multiplier for the theme color. */
  brightness?: number
  /** Optional className applied to the host element. */
  className?: string
}

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

const PREFERS_REDUCED_MOTION =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false

/**
 * Convert a hex color (#RRGGBB / #RGB) to an {r,g,b} tuple.
 * Falls back to the original Lumira gold (#E6C879) if parsing fails.
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const fallback = { r: 230, g: 200, b: 121 }
  if (!hex) return fallback
  let h = hex.trim().replace("#", "")
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("")
  }
  if (h.length !== 6) return fallback
  const num = Number.parseInt(h, 16)
  if (Number.isNaN(num)) return fallback
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
}

/**
 * Read a CSS custom property from :root. The portfolio's ThemeProvider writes
 * --theme-gradient-1 whenever the user picks a new theme.
 */
function readThemeColor(): string {
  if (typeof window === "undefined") return "#E6C879"
  const root = document.documentElement
  const fromGradient = getComputedStyle(root).getPropertyValue("--theme-gradient-1").trim()
  if (fromGradient) return fromGradient
  const fromPrimary = getComputedStyle(root).getPropertyValue("--primary").trim()
  if (fromPrimary) return fromPrimary
  return "#E6C879"
}

export function ConstellationField({
  mode = "dark",
  speed = 1,
  size = 1,
  strokeWidth = 1,
  length = 1,
  density = 1,
  opacity = 1,
  hue = 0,
  saturation = 1,
  brightness = 1,
  className,
}: ConstellationFieldProps) {
  const hostRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  // Keep latest prop values accessible from the animation loop without
  // re-creating it on every render.
  const propsRef = React.useRef({
    speed,
    size,
    strokeWidth,
    length,
    density,
    opacity,
    hue,
    saturation,
    brightness,
    mode,
  })
  React.useEffect(() => {
    propsRef.current = {
      speed,
      size,
      strokeWidth,
      length,
      density,
      opacity,
      hue,
      saturation,
      brightness,
      mode,
    }
  }, [speed, size, strokeWidth, length, density, opacity, hue, saturation, brightness, mode])

  React.useEffect(() => {
    const canvas = canvasRef.current
    const host = hostRef.current
    if (!canvas || !host) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const LINK_BASE = 160
    const isMobile = () => window.innerWidth < 768
    const baseNodes = () => (isMobile() ? 40 : 85)
    const isCoarsePointer = () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches

    let width = 0
    let height = 0
    let nodes: Node[] = []
    let pointer = { x: -1000, y: -1000 }
    let rafId = 0
    let stopped = false
    let lastFrame = performance.now()

    // Track the current color so we only repaint cheaply on theme change.
    let colorHex = readThemeColor()
    let colorRgb = hexToRgb(colorHex)

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      canvas.style.width = width + "px"
      canvas.style.height = height + "px"
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.imageSmoothingEnabled = false
    }

    const initNodes = () => {
      const target = Math.max(
        8,
        Math.round(baseNodes() * Math.min(2, Math.max(0.1, propsRef.current.density))),
      )
      nodes = []
      for (let i = 0; i < target; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 2.4 + 1.8,
        })
      }
    }

    const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
      Math.hypot(a.x - b.x, a.y - b.y)

    const handlePointer = (e: MouseEvent | TouchEvent) => {
      if ("touches" in e) {
        if (e.touches.length === 0) {
          pointer.x = -1000
          pointer.y = -1000
          return
        }
        pointer.x = e.touches[0].clientX
        pointer.y = e.touches[0].clientY
        return
      }
      pointer.x = (e as MouseEvent).clientX
      pointer.y = (e as MouseEvent).clientY
    }

    const handlePointerLeave = () => {
      pointer.x = -1000
      pointer.y = -1000
    }

    const drawFrame = (now: number) => {
      if (stopped) return

      // Refresh color if theme changed.
      const next = readThemeColor()
      if (next !== colorHex) {
        colorHex = next
        colorRgb = hexToRgb(colorHex)
      }

      const dt = Math.min(48, now - lastFrame) // cap dt to avoid huge jumps
      lastFrame = now

      const {
        speed: speedMul,
        size: sizeMul,
        strokeWidth: strokeMul,
        length: lengthMul,
        opacity: opacityMul,
        hue: hueShift,
        saturation: satMul,
        brightness: brightMul,
      } = propsRef.current

      const LINK = LINK_BASE * lengthMul
      const linkR = clamp01(colorRgb.r * brightMul)
      const linkG = clamp01(colorRgb.g * brightMul)
      const linkB = clamp01(colorRgb.b * brightMul)

      ctx.clearRect(0, 0, width, height)
      ctx.lineCap = "butt"
      ctx.lineJoin = "miter"

      // Draw links first so nodes sit crisp on top.
      ctx.strokeStyle = applyHueSat(
        `rgb(${Math.round(linkR)}, ${Math.round(linkG)}, ${Math.round(linkB)})`,
        hueShift,
        satMul,
      )
      ctx.lineWidth = Math.max(0.25, strokeMul)
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const d = dist(a, b)
          if (d < LINK) {
            ctx.globalAlpha = (0.22 + (1 - d / LINK) * 0.55) * opacityMul
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      const time = now * 0.001
      const speedScale = (dt / 16.6667) * speedMul

      nodes.forEach((node) => {
        node.x += node.vx * speedScale
        node.y += node.vy * speedScale

        if (node.x < 0 || node.x > width) node.vx *= -1
        if (node.y < 0 || node.y > height) node.vy *= -1

        // Gentle pointer gravity.
        const pd = dist(node, pointer)
        if (pd < 220) {
          node.x -= (node.x - pointer.x) * 0.005
          node.y -= (node.y - pointer.y) * 0.005
        }

        // Pale node color — slightly brighter than link color for crispness.
        const pulse = 0.78 + Math.sin(time + node.x) * 0.22
        const r = clamp255(colorRgb.r * brightMul * 1.05)
        const g = clamp255(colorRgb.g * brightMul * 1.05)
        const b = clamp255(colorRgb.b * brightMul * 1.05)
        const nodeColor = applyHueSat(
          `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`,
          hueShift,
          satMul,
        )

        ctx.fillStyle = nodeColor
        ctx.globalAlpha = pulse * 0.28 * opacityMul
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius * 2.4 * sizeMul, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = pulse * opacityMul
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius * sizeMul, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.globalAlpha = 1
      rafId = requestAnimationFrame(drawFrame)
    }

    const onResize = () => {
      resize()
      initNodes()
    }

    // Mount
    resize()
    initNodes()

    window.addEventListener("resize", onResize)
    document.addEventListener("mousemove", handlePointer, { passive: true })
    document.addEventListener("mouseleave", handlePointerLeave)
    if (isCoarsePointer()) {
      document.addEventListener("touchmove", handlePointer, { passive: true })
      document.addEventListener("touchend", handlePointerLeave)
    }

    // Observe data-theme attribute so the field repaints when the user picks
    // a new theme. The animation loop also reads the color each frame, so
    // this observer is mainly defensive (and useful for SSR hydration).
    const themeObserver = new MutationObserver(() => {
      const next = readThemeColor()
      if (next !== colorHex) {
        colorHex = next
        colorRgb = hexToRgb(colorHex)
      }
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class", "style"],
    })

    if (!PREFERS_REDUCED_MOTION) {
      lastFrame = performance.now()
      rafId = requestAnimationFrame(drawFrame)
    } else {
      // Draw a single static frame so the field is still visible.
      lastFrame = performance.now()
      drawFrame(performance.now())
    }

    // Pause animation when the tab is hidden to save CPU.
    const onVisibility = () => {
      if (document.hidden) {
        if (rafId) cancelAnimationFrame(rafId)
        rafId = 0
      } else if (!stopped && !rafId && !PREFERS_REDUCED_MOTION) {
        lastFrame = performance.now()
        rafId = requestAnimationFrame(drawFrame)
      }
    }
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      stopped = true
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener("resize", onResize)
      document.removeEventListener("mousemove", handlePointer)
      document.removeEventListener("mouseleave", handlePointerLeave)
      document.removeEventListener("touchmove", handlePointer)
      document.removeEventListener("touchend", handlePointerLeave)
      document.removeEventListener("visibilitychange", onVisibility)
      themeObserver.disconnect()
    }
  }, [])

  return (
    <div
      ref={hostRef}
      className={`constellation-field-shell ${className ?? ""}`}
      data-mode={mode}
      aria-hidden="true"
    >
      {/* Base radial gradient that matches the dark surface */}
      <div className="constellation-field-base" />
      <canvas ref={canvasRef} className="constellation-field-canvas" />
      {/* Top-to-bottom depth overlay so content above remains readable. */}
      <div className="constellation-field-overlay" />
    </div>
  )
}

function clamp01(v: number) {
  return Math.max(0, Math.min(255, v))
}

function clamp255(v: number) {
  return Math.max(0, Math.min(255, v))
}

/**
 * Apply hue shift (deg) and saturation multiplier to an rgb() string.
 * Returns an rgb() string suitable for canvas stroke/fill.
 */
function applyHueSat(rgbString: string, hueShift: number, satMul: number): string {
  if (!hueShift && satMul === 1) return rgbString
  const m = rgbString.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (!m) return rgbString
  const [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])].map((v) => v / 255)
  // hsl conversion
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      default:
        h = (r - g) / d + 4
    }
    h *= 60
  }
  // hue shift
  h = (h + hueShift + 360) % 360
  s = Math.max(0, Math.min(1, s * satMul))

  // back to rgb
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  let nr: number
  let ng: number
  let nb: number
  if (s === 0) {
    nr = ng = nb = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    nr = hue2rgb(p, q, h / 360 + 1 / 3)
    ng = hue2rgb(p, q, h / 360)
    nb = hue2rgb(p, q, h / 360 - 1 / 3)
  }
  return `rgb(${Math.round(nr * 255)}, ${Math.round(ng * 255)}, ${Math.round(nb * 255)})`
}

export default ConstellationField
