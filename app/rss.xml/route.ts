import { generateRSSFeed } from "@/lib/seo"

export const dynamic = "force-static"
export const revalidate = 86400 // Revalidate daily

export async function GET() {
  const feed = generateRSSFeed()

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}