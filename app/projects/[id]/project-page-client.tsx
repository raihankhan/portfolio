"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ExternalLink, Github, FileText, CheckCircle2, AlertCircle } from "lucide-react"
import { AnimatedBackground } from "@/components/animated-background"
import { Dock } from "@/components/dock/dock"
import { TechBadge } from "@/components/tech-badge"
import type { Project } from "@/lib/data"

interface ProjectPageClientProps {
  project: Project
}

export function ProjectPageClient({ project }: ProjectPageClientProps) {
  return (
    <>
      <AnimatedBackground />
      <Dock />

      <main className="min-h-screen px-6 pb-32 pt-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          {/* Back Link */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              {project.featured && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Featured Project
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">{project.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{project.description}</p>
          </motion.div>

          {/* Project Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative aspect-video rounded-xl overflow-hidden mb-8 glass"
          >
            <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg glass px-4 py-2 text-sm font-medium text-foreground transition-colors glass-hover"
              >
                <Github className="h-4 w-4" />
                View on GitHub
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Live Demo
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {project.links.docs && (
              <a
                href={project.links.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg glass px-4 py-2 text-sm font-medium text-foreground transition-colors glass-hover"
              >
                <FileText className="h-4 w-4" />
                Documentation
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </motion.div>

          {/* Content Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Overview */}
              <section className="rounded-xl glass p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">{project.longDescription}</p>
              </section>

              {/* Challenges */}
              <section className="rounded-xl glass p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  Challenges
                </h2>
                <ul className="space-y-3">
                  {project.challenges.map((challenge, index) => (
                    <li key={index} className="flex gap-3 text-muted-foreground">
                      <span className="text-amber-500 mt-1">•</span>
                      {challenge}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Outcomes */}
              <section className="rounded-xl glass p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  Outcomes
                </h2>
                <ul className="space-y-3">
                  {project.outcomes.map((outcome, index) => (
                    <li key={index} className="flex gap-3 text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-1" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </section>
            </motion.div>

            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* Technologies */}
              <section className="rounded-xl glass p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <TechBadge key={tech} name={tech} />
                  ))}
                </div>
              </section>
            </motion.aside>
          </div>
        </div>
      </main>
    </>
  )
}
