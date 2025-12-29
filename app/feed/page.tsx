"use client"

import { motion } from "framer-motion"
import { feedPosts } from "@/lib/data"
import { FeedCard } from "@/components/feed/feed-card"
import { AnimatedBackground } from "@/components/animated-background"
import { Dock } from "@/components/dock/dock"

export default function FeedPage() {
    return (
        <>
            <AnimatedBackground />
            <Dock />

            <main className="min-h-screen px-6 pb-32 pt-24 md:px-12 lg:px-24">
                <div className="mx-auto max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 text-center"
                    >
                        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                            Feed
                        </h1>
                        <p className="text-muted-foreground">
                            Updates, thoughts, and technical content.
                        </p>
                    </motion.div>

                    {/* Posts Feed */}
                    <div className="space-y-4">
                        {feedPosts.map((post, index) => (
                            <FeedCard key={post.id} post={post} index={index} />
                        ))}
                    </div>
                </div>
            </main>
        </>
    )
}
