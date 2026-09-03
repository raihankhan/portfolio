"use client"

import { motion, useReducedMotion } from "framer-motion"
import Link from "next/link"
import { Dock } from "@/components/dock/dock"
import { DevOpsStatus } from "@/components/devops-status"
import { Clause } from "@/components/text-wipe"
import dynamic from "next/dynamic"
import { ArrowRight, Terminal, Cloud, GitBranch, Server } from "lucide-react"

const SplineRobot = dynamic(() => import("@/components/spline-robot").then((mod) => mod.SplineRobot), {
  ssr: false,
})

const skills = [
  { icon: <Cloud className="h-5 w-5" />, name: "Cloud Infrastructure", description: "AWS, GCP, Azure" },
  { icon: <Server className="h-5 w-5" />, name: "Kubernetes", description: "EKS, GKE, AKS" },
  { icon: <GitBranch className="h-5 w-5" />, name: "CI/CD", description: "GitHub Actions, ArgoCD" },
  { icon: <Terminal className="h-5 w-5" />, name: "IaC", description: "Terraform, Pulumi" },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

// TechToken — operative tech terms inside the hero description get a
// 1px gradient underline that draws in after the surrounding clause
// has settled. Same easing as the wipe primitives above.
const tokenUnderline = {
    hidden: { scaleX: 0 },
    show: { scaleX: 1 },
}

const tokenUnderlineTransition = (delay: number) => ({
    duration: 0.42,
    delay,
    ease: [0.16, 1, 0.3, 1] as const,
})

function TechToken({ children, delay, skip }: { children: React.ReactNode; delay: number; skip?: boolean }) {
    if (skip) {
        return (
            <span className="relative inline-block whitespace-nowrap font-medium text-foreground/90">
                <span>{children}</span>
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-[-2px] h-px bg-gradient-to-r from-primary/0 via-primary to-secondary/0"
                />
            </span>
        )
    }
    return (
        <span className="relative inline-block whitespace-nowrap font-medium text-foreground/90">
            <span>{children}</span>
            <motion.span
                aria-hidden="true"
                initial="hidden"
                animate="show"
                variants={tokenUnderline}
                transition={tokenUnderlineTransition(delay)}
                className="pointer-events-none absolute inset-x-0 bottom-[-2px] h-px origin-left bg-gradient-to-r from-primary/0 via-primary to-secondary/0"
            />
        </span>
    )
}

export default function HomePage() {
  const reduceMotion = useReducedMotion()

  return (
    <>
      <Dock />

      <main className="min-h-screen px-6 pb-32 pt-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="py-12 md:py-20"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col gap-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <DevOpsStatus />
                </motion.div>

                <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                  <span className="block">Raihan Khan</span>
                  <span className="block mt-2 gradient-text">Senior DevOps Engineer</span>
                </h1>

                {/* Description — three sequential clause-wipes with token
                    underlines drawn after each clause settles. */}
                <p className="max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
                  <Clause delay={0.35} skip={reduceMotion ?? false} className="inline">
                    I build reliable, scalable cloud infrastructure and developer platforms.{" "}
                  </Clause>
                  <Clause delay={0.55} skip={reduceMotion ?? false} className="inline">
                    Specializing in{" "}
                    <TechToken delay={1.0} skip={reduceMotion ?? false}>Kubernetes</TechToken>,{" "}
                    <TechToken delay={1.12} skip={reduceMotion ?? false}>CI/CD</TechToken> automation, and{" "}
                    <TechToken delay={1.24} skip={reduceMotion ?? false}>infrastructure as code</TechToken>{" "}
                  </Clause>
                  <Clause delay={0.85} skip={reduceMotion ?? false} className="inline">
                    to help teams ship faster and safer.
                  </Clause>
                </p>

                <div className="flex flex-wrap gap-4 mt-4">
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    View Projects
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-lg glass px-6 py-3 text-sm font-medium text-foreground transition-colors glass-hover"
                  >
                    Get in Touch
                  </Link>
                </div>
              </div>

              <div className="hidden lg:block relative h-[500px]">
                <SplineRobot />
              </div>
            </div>
          </motion.section>

          {/* Skills Grid */}
          <motion.section variants={container} initial="hidden" animate="show" className="py-12">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-8">Core Expertise</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {skills.map((skill) => (
                <motion.div
                  key={skill.name}
                  variants={item}
                  className="group rounded-xl glass p-6 transition-all glass-hover"
                >
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">{skill.icon}</div>
                  <h3 className="font-semibold text-foreground">{skill.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{skill.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Quick Links */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="py-12"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Link href="/blog" className="group">
                <div className="rounded-xl glass p-6 transition-all glass-hover h-full">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">Blog</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Technical articles on DevOps, Kubernetes, and cloud infrastructure.
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm text-primary">
                    Read articles <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>

              <Link href="/notes" className="group">
                <div className="rounded-xl glass p-6 transition-all glass-hover h-full">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">Notes</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Quick references and cheatsheets for Kubernetes, Go, and more.
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm text-primary">
                    Browse notes <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>

              <Link href="/experience" className="group">
                <div className="rounded-xl glass p-6 transition-all glass-hover h-full">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    Experience
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    My professional journey in DevOps and platform engineering.
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm text-primary">
                    View timeline <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            </div>
          </motion.section>
        </div>
      </main>
    </>
  )
}
