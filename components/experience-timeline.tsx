"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Briefcase, MapPin, ExternalLink, CheckCircle2 } from "lucide-react"
import { TechBadge } from "./tech-badge"
import type { Experience } from "@/lib/data"

interface TimelineItemProps {
  experience: Experience
  index: number
  isLast: boolean
}

function TimelineItem({ experience, index, isLast }: TimelineItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const x = useTransform(scrollYProgress, [0, 0.5], [-50, 0])

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })
  }

  return (
    <motion.div ref={ref} style={{ opacity, x }} className="relative pl-8 md:pl-12">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[11px] top-8 h-full w-px bg-gradient-to-b from-primary/50 to-border md:left-[15px]" />
      )}

      {/* Timeline dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.2, type: "spring" }}
        className="absolute left-0 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 ring-4 ring-background md:h-8 md:w-8"
      >
        <Briefcase className="h-3 w-3 text-primary md:h-4 md:w-4" />
      </motion.div>

      {/* Content */}
      <div className="rounded-xl glass p-6 mb-8 transition-all glass-hover">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-2">
              {formatDate(experience.startDate)} — {experience.endDate ? formatDate(experience.endDate) : "Present"}
            </span>
            <h3 className="text-xl font-semibold text-foreground">{experience.role}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-muted-foreground">
              {experience.companyUrl ? (
                <a
                  href={experience.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  {experience.company}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span>{experience.company}</span>
              )}
              <span className="text-muted-foreground/50">•</span>
              <span className="inline-flex items-center gap-1 text-sm">
                <MapPin className="h-3 w-3" />
                {experience.location}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground mb-4">{experience.description}</p>

        {/* Achievements */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-foreground mb-2">Key Achievements</h4>
          <ul className="space-y-2">
            {experience.achievements.map((achievement, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                {achievement}
              </li>
            ))}
          </ul>
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2">
          {experience.technologies.map((tech) => (
            <TechBadge key={tech} name={tech} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

interface ExperienceTimelineProps {
  experiences: Experience[]
}

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  return (
    <div className="relative">
      {experiences.map((experience, index) => (
        <TimelineItem
          key={experience.id}
          experience={experience}
          index={index}
          isLast={index === experiences.length - 1}
        />
      ))}
    </div>
  )
}
