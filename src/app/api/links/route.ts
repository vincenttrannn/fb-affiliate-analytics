import { NextResponse } from 'next/server'
import { upstashExec } from '@/lib/upstash'

export async function POST(request: Request) {
  const apiKey = request.headers.get('x-api-key')
  if (apiKey !== process.env.REDIRECT_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { targetUrl, productName, offerType, category } = body

  if (!targetUrl) {
    return NextResponse.json({ error: 'targetUrl required' }, { status: 400 })
  }

  const slug = crypto.randomUUID().replace(/-/g, '').slice(0, 8)

  await upstashExec('SET', `link:${slug}`, JSON.stringify({
    targetUrl,
    productName: productName || '',
    offerType: offerType || '',
    category: category || '',
    createdAt: new Date().toISOString(),
  }))

  return NextResponse.json({
    slug,
    redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://fb-affiliate-analytics.vercel.app'}/l/${slug}`,
  })
}
