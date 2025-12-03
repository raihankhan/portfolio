"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { AnimatedBackground } from "@/components/animated-background"
import { Dock } from "@/components/dock/dock"
import { DevOpsStatus } from "@/components/devops-status"
import { BugWalk } from "@/components/bug-walk"
import { ArrowRight, Terminal, Cloud, GitBranch, Server } from "lucide-react"

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

export default function HomePage() {
  return (
    <>
      <AnimatedBackground />
      <Dock />

      <main className="min-h-screen px-6 pb-32 pt-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="py-12 md:py-24"
          >
            <div className="flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <DevOpsStatus />
              </motion.div>

              <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
                <span className="block">Raihan Khan</span>
                <span className="block mt-2 gradient-text">Senior DevOps Engineer</span>
              </h1>

              <BugWalk />

              <p className="max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
                I build reliable, scalable cloud infrastructure and developer platforms. Specializing in Kubernetes,
                CI/CD automation, and infrastructure as code to help teams ship faster and safer.
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
