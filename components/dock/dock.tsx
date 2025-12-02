"use client"

import type React from "react"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FolderKanban, FileText, BookOpen, Briefcase, Mail, Github, Linkedin, Twitter } from "lucide-react"

interface DockItemProps {
  icon: React.ReactNode
  label: string
  href: string
  isExternal?: boolean
  mouseX: any
  isActive?: boolean
}

function DockItem({ icon, label, href, isExternal, mouseX, isActive }: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null)

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const widthSync = useTransform(distance, [-150, 0, 150], [48, 72, 48])
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 })

  const content = (
    <motion.div
      ref={ref}
      style={{ width }}
      className={`group relative flex aspect-square items-center justify-center rounded-xl glass glass-hover transition-colors ${
        isActive ? "bg-primary/20 border-primary/50" : ""
      }`}
    >
      <div className="text-muted-foreground group-hover:text-foreground transition-colors">{icon}</div>
      <span className="absolute -top-10 left-1/2 -translate-x-1/2 rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100 whitespace-nowrap">
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
  return <div className="h-8 w-px bg-border" />
}

export function Dock() {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY)
  const pathname = usePathname()

  const navItems = [
    { icon: <Home className="h-6 w-6" />, label: "Home", href: "/" },
    { icon: <FolderKanban className="h-6 w-6" />, label: "Projects", href: "/projects" },
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

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
    >
      <motion.nav
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
        className="glass flex items-center gap-2 rounded-2xl p-2 shadow-2xl"
      >
        {navItems.map((item) => (
          <DockItem key={item.href} {...item} mouseX={mouseX} isActive={pathname === item.href} />
        ))}
        <DockDivider />
        {socialItems.map((item) => (
          <DockItem key={item.href} {...item} mouseX={mouseX} />
        ))}
      </motion.nav>
    </motion.div>
  )
}
