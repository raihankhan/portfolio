"use client"

import type React from "react"

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FolderKanban, FileText, BookOpen, Briefcase, Mail, Github, Linkedin, Twitter, Rss } from "lucide-react"

import "./dock-glow.css"

interface DockItemProps {
  icon: React.ReactNode
  label: string
  href: string
  isExternal?: boolean
  mouseX: any
  isActive?: boolean
  /** Index of this item inside the dock; used to stagger the entrance. */
  index: number
  /** Whether the OS has reduced-motion turned on. */
  reduceMotion: boolean
}

function DockItem({ icon, label, href, isExternal, mouseX, isActive, index, reduceMotion }: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prevActiveRef = useRef(isActive)

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const widthSync = useTransform(distance, [-150, 0, 150], [48, 72, 48])
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 })

  // One-shot settle pulse: triggered when this item becomes the active route.
  // The pulse fires on route change, not on every render of an already-active item.
  const [pulseKey, setPulseKey] = useState(0)
  useEffect(() => {
    if (isActive && !prevActiveRef.current) {
      setPulseKey((k) => k + 1)
    }
    prevActiveRef.current = isActive
  }, [isActive])

  const content = (
    <motion.div
      ref={ref}
      style={{ width }}
      // Stagger entrance: 35ms per item, 220ms travel, settled by ~700ms after mount.
      // Cubic-bezier(0.16, 1, 0.3, 1) is the project's authored deceleration.
      initial={reduceMotion ? false : { y: 18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        delay: 0.18 + index * 0.035,
        duration: 0.42,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileTap={reduceMotion ? undefined : { scale: 0.94 }}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      className={`group relative flex aspect-square items-center justify-center rounded-xl glass glass-hover dock-item ${isActive ? "dock-item--active" : ""}`}
    >
      {/* Active-route indicator dot: a small theme-tinted pip that breathes on settle. */}
      {isActive && (
        <motion.span
          key={`pip-${pulseKey}`}
          aria-hidden
          className="dock-item__pip"
          initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      )}
      <div className="dock-item__icon text-muted-foreground group-hover:text-foreground transition-colors">
        {icon}
      </div>
      <span className="dock-item__tooltip absolute -top-10 left-1/2 -translate-x-1/2 rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground opacity-0 shadow-lg whitespace-nowrap">
        {label}
      </span>
    </motion.div>
  )

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  return <Link href={href}>{content}</Link>
}

function DockDivider() {
  return (
    <motion.div
      aria-hidden
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      transition={{ delay: 0.45, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{ originY: 0.5 }}
      className="h-8 w-px bg-border"
    />
  )
}

export function Dock() {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY)
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()

  const navItems = [
    { icon: <Home className="h-6 w-6" />, label: "Home", href: "/" },
    { icon: <FolderKanban className="h-6 w-6" />, label: "Projects", href: "/projects" },
    { icon: <Rss className="h-6 w-6" />, label: "Feed", href: "/feed" },
    { icon: <FileText className="h-6 w-6" />, label: "Blog", href: "/blog" },
    { icon: <BookOpen className="h-6 w-6" />, label: "Notes", href: "/notes" },
    { icon: <Briefcase className="h-6 w-6" />, label: "Experience", href: "/experience" },
    { icon: <Mail className="h-6 w-6" />, label: "Contact", href: "/contact" },
  ]

  const socialItems = [
    { icon: <Github className="h-5 w-5" />, label: "GitHub", href: "https://github.com", isExternal: true },
    { icon: <Linkedin className="h-5 w-5" />, label: "LinkedIn", href: "https://linkedin.com", isExternal: true },
    { icon: <Twitter className="h-5 w-5" />, label: "Twitter", href: "https://twitter.com", isExternal: true },
  ]

  // Whole-dock container: keep the existing translate-up entrance, but tighten
  // it (the staggered items now carry their own entrance; the shell just slides
  // up the rack as a whole).
  return (
    <motion.div
      initial={reduceMotion ? false : { y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, type: "spring", stiffness: 160, damping: 22, mass: 0.7 }}
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
    >
      <motion.nav
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
        className="dock-glow relative glass flex items-center gap-2 rounded-2xl p-2 shadow-2xl"
      >
        {navItems.map((item, i) => (
          <DockItem
            key={item.href}
            {...item}
            mouseX={mouseX}
            isActive={pathname === item.href}
            index={i}
            reduceMotion={!!reduceMotion}
          />
        ))}
        <DockDivider />
        {socialItems.map((item, i) => (
          <DockItem
            key={item.href}
            {...item}
            mouseX={mouseX}
            index={navItems.length + 1 + i}
            reduceMotion={!!reduceMotion}
          />
        ))}
      </motion.nav>
    </motion.div>
  )
}
