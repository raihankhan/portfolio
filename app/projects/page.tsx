"use client"

import { AnimatedBackground } from "@/components/animated-background"
import { Dock } from "@/components/dock/dock"
import { SectionHeader } from "@/components/section-header"
import { ProjectCard } from "@/components/project-card"
import { projects } from "@/lib/data"

export default function ProjectsPage() {
  const featuredProjects = projects.filter((p) => p.featured)
  const otherProjects = projects.filter((p) => !p.featured)

  return (
    <>
      <AnimatedBackground />
      <Dock />

      <main className="min-h-screen px-6 pb-32 pt-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SectionHeader
            title="Projects"
            description="A collection of DevOps projects showcasing infrastructure automation, platform engineering, and cloud-native solutions."
          />

          {/* Featured Projects */}
          <section className="mb-16">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-6">Featured Work</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </section>

          {/* Other Projects */}
          {otherProjects.length > 0 && (
            <section>
              <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-6">
                Other Projects
              </h2>
              <div className="grid gap-8 md:grid-cols-2">
                {otherProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index + featuredProjects.length} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  )
}
