import { NextResponse } from 'next/server'
import { upstashExec } from '@/lib/upstash'

export async function GET() {
  const today = new Date().toISOString().slice(0, 10)

  const totalRes = await upstashExec('GET', 'total:clicks')
  const todayRes = await upstashExec('GET', `daily:${today}`)

  const days: { date: string; clicks: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const val = await upstashExec('GET', `daily:${key}`)
    days.push({ date: key, clicks: val.result ? parseInt(val.result) : 0 })
  }

  const topRes = await upstashExec('ZREVRANGE', 'top:links', '0', '4', 'WITHSCORES')
  const topLinks: { slug: string; clicks: number; productName?: string; targetUrl?: string }[] = []
  if (topRes.result) {
    for (let i = 0; i < topRes.result.length; i += 2) {
      const slug = topRes.result[i]
      const clicks = parseInt(topRes.result[i + 1])
      const linkRes = await upstashExec('GET', `link:${slug}`)
      let productName = ''
      let targetUrl = ''
      if (linkRes.result) {
        const data = JSON.parse(linkRes.result)
        productName = data.productName
        targetUrl = data.targetUrl
      }
      topLinks.push({ slug, clicks, productName, targetUrl })
    }
  }

  return NextResponse.json({
    totalClicks: totalRes.result ? parseInt(totalRes.result) : 0,
    todayClicks: todayRes.result ? parseInt(todayRes.result) : 0,
    dailyTimeline: days,
    topLinks,
  })
}
