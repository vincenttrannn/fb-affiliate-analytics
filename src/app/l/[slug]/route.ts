import { NextResponse } from 'next/server'
import { upstashExec } from '@/lib/upstash'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const result = await upstashExec('GET', `link:${slug}`)
  if (!result.result) {
    return new Response('Not found', { status: 404 })
  }

  const linkData = JSON.parse(result.result)
  const today = new Date().toISOString().slice(0, 10)

  Promise.allSettled([
    upstashExec('INCR', `stats:${slug}`),
    upstashExec('INCR', `daily:${today}`),
    upstashExec('ZINCRBY', 'top:links', '1', slug),
  ])

  return NextResponse.redirect(linkData.targetUrl, 302)
}
