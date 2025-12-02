"use client"

import { motion } from "framer-motion"
import { AnimatedBackground } from "@/components/animated-background"
import { Dock } from "@/components/dock/dock"
import { SectionHeader } from "@/components/section-header"
import { ExperienceTimeline } from "@/components/experience-timeline"
import { experiences } from "@/lib/data"
import { Download } from "lucide-react"

export default function ExperiencePage() {
  return (
    <>
      <AnimatedBackground />
      <Dock />

      <main className="min-h-screen px-6 pb-32 pt-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-4 mb-12 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              title="Experience"
              description="My professional journey in DevOps, platform engineering, and cloud infrastructure."
            />
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              href="#"
              className="inline-flex items-center gap-2 rounded-lg glass px-4 py-2 text-sm font-medium text-foreground transition-colors glass-hover whitespace-nowrap self-start sm:self-auto"
            >
              <Download className="h-4 w-4" />
              Download CV
            </motion.a>
          </div>

          <ExperienceTimeline experiences={experiences} />

          {/* Skills Summary */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-semibold text-foreground mb-6">Skills Overview</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl glass p-6">
                <h3 className="font-semibold text-foreground mb-3">Cloud Platforms</h3>
                <div className="flex flex-wrap gap-2">
                  {["AWS", "GCP", "Azure", "DigitalOcean"].map((skill) => (
                    <span key={skill} className="text-sm text-muted-foreground">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl glass p-6">
                <h3 className="font-semibold text-foreground mb-3">Container & Orchestration</h3>
                <div className="flex flex-wrap gap-2">
                  {["Docker", "Kubernetes", "EKS", "GKE", "Helm"].map((skill) => (
                    <span key={skill} className="text-sm text-muted-foreground">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl glass p-6">
                <h3 className="font-semibold text-foreground mb-3">Infrastructure as Code</h3>
                <div className="flex flex-wrap gap-2">
                  {["Terraform", "Pulumi", "Ansible", "CloudFormation"].map((skill) => (
                    <span key={skill} className="text-sm text-muted-foreground">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl glass p-6">
                <h3 className="font-semibold text-foreground mb-3">CI/CD</h3>
                <div className="flex flex-wrap gap-2">
                  {["GitHub Actions", "ArgoCD", "Jenkins", "GitLab CI"].map((skill) => (
                    <span key={skill} className="text-sm text-muted-foreground">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl glass p-6">
                <h3 className="font-semibold text-foreground mb-3">Monitoring & Observability</h3>
                <div className="flex flex-wrap gap-2">
                  {["Prometheus", "Grafana", "Datadog", "ELK Stack"].map((skill) => (
                    <span key={skill} className="text-sm text-muted-foreground">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl glass p-6">
                <h3 className="font-semibold text-foreground mb-3">Programming</h3>
                <div className="flex flex-wrap gap-2">
                  {["Go", "Python", "Bash", "TypeScript"].map((skill) => (
                    <span key={skill} className="text-sm text-muted-foreground">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </>
  )
}
