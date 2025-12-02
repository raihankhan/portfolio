import { notes } from "@/lib/data"
import { notFound } from "next/navigation"
import { NotePageClient } from "./note-page-client"

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const note = notes.find((n) => n.slug === slug)

  if (!note) {
    notFound()
  }

  return <NotePageClient note={note} />
}
