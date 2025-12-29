import { feedPosts } from "@/lib/data"
import { FeedCard } from "@/components/feed/feed-card"
import { AnimatedBackground } from "@/components/animated-background"
import { Dock } from "@/components/dock/dock"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
    return feedPosts.map((post) => ({
        id: post.id,
    }))
}

export default async function FeedPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const post = feedPosts.find((p) => p.id === id)

    if (!post) {
        notFound()
    }

    return (
        <>
            <AnimatedBackground />
            <Dock />

            <main className="min-h-screen px-6 pb-32 pt-24 md:px-12 lg:px-24">
                <div className="mx-auto max-w-2xl">
                    <FeedCard post={post} index={0} />
                </div>
            </main>
        </>
    )
}
