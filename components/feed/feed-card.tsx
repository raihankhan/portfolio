"use client"

import { motion } from "framer-motion"
import { FeedPost } from "@/lib/data"
import { Share2, Twitter, Linkedin, Facebook, Link as LinkIcon, Check } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import { useState } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface FeedCardProps {
    post: FeedPost
    index: number
}

export function FeedCard({ post, index }: FeedCardProps) {
    const [copied, setCopied] = useState(false)
    const postUrl = `https://raihankhan.dev/feed/${post.id}`

    const handleCopyLink = () => {
        navigator.clipboard.writeText(postUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="w-full max-w-2xl mx-auto mb-8"
        >
            <div className="glass rounded-xl p-6 transition-all hover:bg-muted/50">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                        {/* Placeholder Avatar */}
                        <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-bold">
                            RK
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">Raihan Khan</h3>
                            <span className="text-xs text-muted-foreground">•</span>
                            <time className="text-sm text-muted-foreground">
                                {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
                            </time>
                        </div>
                        <p className="text-xs text-muted-foreground">Senior DevOps Engineer</p>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                        {post.content}
                    </p>

                    {/* Media */}
                    {post.media?.type === "iframe" && (
                        <div className="relative w-full overflow-hidden rounded-lg border bg-muted">
                            <div className={post.media.aspectRatio || "aspect-video"}>
                                <iframe
                                    src={post.media.src}
                                    className="absolute inset-0 h-full w-full border-0"
                                    allow="clipboard-write; autoplay; fullscreen"
                                    allowFullScreen
                                    style={{ border: "none" }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end mt-6 pt-4 border-t border-border/50">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group">
                                <Share2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                <span>Share</span>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
                                <div className="flex items-center gap-2">
                                    {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
                                    <span>{copied ? "Copied!" : "Copy Link"}</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <a
                                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.content.substring(0, 100) + "...")}&url=${encodeURIComponent(postUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <Twitter className="h-4 w-4" />
                                    <span>Twitter</span>
                                </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <a
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <Linkedin className="h-4 w-4" />
                                    <span>LinkedIn</span>
                                </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <Facebook className="h-4 w-4" />
                                    <span>Facebook</span>
                                </a>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </motion.article>
    )
}
