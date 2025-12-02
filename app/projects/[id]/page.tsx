import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { projects } from "@/lib/data"
import { ProjectPageClient } from "./project-page-client"

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }))
}

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const project = projects.find((p) => p.id === id)

  if (!project) {
    return { title: "Project Not Found" }
  }

  return {
    title: `${project.title} | Raihan Khan`,
    description: project.description,
  }
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params
  const project = projects.find((p) => p.id === id)

  if (!project) {
    notFound()
  }

  return <ProjectPageClient project={project} />
}
