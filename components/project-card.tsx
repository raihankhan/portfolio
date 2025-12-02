"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, Github, FileText } from "lucide-react"
import { TechBadge } from "./tech-badge"
import type { Project } from "@/lib/data"

interface ProjectCardProps {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/projects/${project.id}`}>
        <div className="rounded-xl glass overflow-hidden transition-all duration-300 glass-hover">
          {/* Project Image */}
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            {project.featured && (
              <span className="absolute top-4 right-4 rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground">
                Featured
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </div>
            <p className="mt-2 text-muted-foreground line-clamp-2">{project.description}</p>

            {/* Technologies */}
            <div className="mt-4 flex flex-wrap gap-2">
              {project.technologies.slice(0, 4).map((tech) => (
                <TechBadge key={tech} name={tech} />
              ))}
              {project.technologies.length > 4 && (
                <span className="text-xs text-muted-foreground self-center">
                  +{project.technologies.length - 4} more
                </span>
              )}
            </div>

            {/* Links */}
            <div className="mt-4 flex gap-3">
              {project.links.github && (
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <Github className="h-4 w-4" />
                  GitHub
                </span>
              )}
              {project.links.docs && (
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  Docs
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
