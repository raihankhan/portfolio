"use client"

import { motion } from "framer-motion"
import { Joystick, Bug, Bird, Grid3X3, Container, Server, Zap, Workflow } from "lucide-react"
import { GameCard } from "@/components/game-console/game-card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

const games = [
  {
    title: "Snake",
    tagline: "Classic snake game with a modern twist",
    href: "/arcade/snake",
    icon: Bug,
  },
  {
    title: "Flappy Bird",
    tagline: "Tap to fly through the obstacles",
    href: "/arcade/flappy",
    icon: Bird,
  },
  {
    title: "Tic-Tac-Toe",
    tagline: "Challenge the AI or a friend",
    href: "/arcade/tictactoe",
    icon: Grid3X3,
  },
  {
    title: "Pod Eviction Survival",
    tagline: "Dodge Kubernetes eviction events",
    href: "/arcade/pod-eviction-survival",
    icon: Container,
  },
  {
    title: "Cluster Autoscaler Rampage",
    tagline: "Scale nodes to handle incoming jobs",
    href: "/arcade/autoscaler-rampage",
    icon: Server,
  },
  {
    title: "Node Drain Rush",
    tagline: "Evict pods before the timer runs out",
    href: "/arcade/node-drain-rush",
    icon: Zap,
  },
  {
    title: "DevOps Adventure: GitOps",
    tagline: "Master the complete DevOps pipeline",
    href: "/arcade/devops-adventure-gitops",
    icon: Workflow,
  },
]

export default function ArcadePage() {
  return (
    <div className="relative min-h-screen px-6 py-24">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link href="/">
            <motion.div
              className="inline-flex items-center gap-2 rounded-lg border border-border/50 bg-card/60 px-4 py-2 text-sm text-muted-foreground backdrop-blur-xl transition-colors hover:bg-card hover:text-foreground"
              whileHover={{ scale: 1.02, x: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Portfolio
            </motion.div>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <motion.div
            className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          >
            <Joystick className="h-8 w-8" />
          </motion.div>
          <h1 className="mb-3 text-4xl font-bold text-foreground">Game Arcade</h1>
          <p className="text-lg text-muted-foreground">Take a break and enjoy some classic games</p>
        </motion.div>

        {/* Games Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game, index) => (
            <GameCard
              key={game.title}
              title={game.title}
              tagline={game.tagline}
              href={game.href}
              icon={game.icon}
              index={index}
            />
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          Use keyboard controls or touch for mobile devices
        </motion.p>
      </div>
    </div>
  )
}
