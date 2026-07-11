'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { KpiCard } from '@/components/kpi-card'
import { BarChartCard, AreaChartCard } from '@/components/charts'
import { Link, Activity, ShoppingCart, DollarSign, TrendingUp, Users } from 'lucide-react'
import type { DashboardState, Product, ClickReport, ConversionReport, ClickStats } from '@/lib/types'

export default function OverviewClient({ state, products, clickReport, conversionReport }: {
  state: DashboardState
  products: Product[]
  clickReport: ClickReport | null
  conversionReport: ConversionReport | null
}) {
  const [stats, setStats] = useState<ClickStats | null>(null)

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => {})
  }, [])

  const totalClicks = stats?.totalClicks ?? 0
  const todayClicks = stats?.todayClicks ?? 0
  const totalOrders = conversionReport?.summary.totalOrders ?? 0
  const totalCommission = conversionReport?.summary.totalCommission ?? 0
  const avgCommission = totalOrders > 0 ? Math.round(totalCommission / totalOrders) : 0
  const groupsReached = state.totalGroups

  const clickTimeline = stats?.dailyTimeline ?? []
  const topLinks = stats?.topLinks ?? []

  const commTimeline = conversionReport?.timeline ?? []
  const topProducts = conversionReport?.topProducts ?? []

  const rawTimeline = state.postedTimeline || []
  const postedTimeline = rawTimeline.length > 0 ? rawTimeline
    : state.postedLinks.map(u => ({ ts: '', url: u }))
  const sortedPosts = [...postedTimeline].sort((a, b) => a.ts.localeCompare(b.ts))
  const bucketSize = Math.max(1, Math.ceil(sortedPosts.length / 30))
  const postActivityBuckets: { label: string; posts: number }[] = []
  for (let i = 0; i < sortedPosts.length; i += bucketSize) {
    const slice = sortedPosts.slice(i, i + bucketSize)
    const label = slice.length > 1
      ? `${slice[0].ts.slice(11, 16)}-${slice[slice.length - 1].ts.slice(11, 16)}`
      : slice[0].ts.slice(11, 16)
    postActivityBuckets.push({ label, posts: slice.length })
  }

  return (
    <>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard title="Total Clicks" value={totalClicks} icon={<Link className="h-4 w-4" />} color="#6366f1"
          trend={clickReport?.change ? { value: clickReport.change.totalClicksPct ?? 0, label: 'vs last report' } : undefined} />
        <KpiCard title="Today Clicks" value={todayClicks} icon={<Activity className="h-4 w-4" />} color="#8b5cf6" />
        <KpiCard title="Orders" value={totalOrders} icon={<ShoppingCart className="h-4 w-4" />} color="#a855f7"
          trend={conversionReport?.change ? { value: conversionReport.change.totalOrdersPct ?? 0, label: 'vs last report' } : undefined} />
        <KpiCard title="Commission Earned" value={totalCommission ? `₫${totalCommission.toLocaleString()}` : 0} icon={<DollarSign className="h-4 w-4" />} color="#ec4899"
          trend={conversionReport?.change ? { value: conversionReport.change.totalCommissionPct ?? 0, label: 'vs last report' } : undefined} />
        <KpiCard title="Avg Commission" value={avgCommission ? `₫${avgCommission.toLocaleString()}` : 0} icon={<TrendingUp className="h-4 w-4" />} color="#f97316" />
        <KpiCard title="Groups Reached" value={groupsReached} icon={<Users className="h-4 w-4" />} color="#22c55e" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="card-hover">
          <CardHeader><CardTitle>Clicks Timeline (7 days)</CardTitle></CardHeader>
          <CardContent>
            {clickTimeline.length > 0
              ? <AreaChartCard data={clickTimeline} dataKey="clicks" nameKey="date" height={280} />
              : <p className="text-sm text-muted-foreground text-center py-12">No click data yet. Start posting redirect links.</p>}
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader><CardTitle>Top Clicked Links</CardTitle></CardHeader>
          <CardContent>
            {topLinks.length > 0
              ? <BarChartCard data={topLinks.map(l => ({ name: l.productName?.slice(0, 30) || l.slug, clicks: l.clicks }))} dataKey="clicks" nameKey="name" color="#8b5cf6" height={280} />
              : <p className="text-sm text-muted-foreground text-center py-12">No clicks recorded yet.</p>}
          </CardContent>
        </Card>
      </div>

      {commTimeline.length > 0 && (
        <Card className="card-hover">
          <CardHeader><CardTitle>Commission Timeline</CardTitle></CardHeader>
          <CardContent>
            <BarChartCard data={commTimeline} dataKey="commission" nameKey="date" color="#ec4899" height={280} />
          </CardContent>
        </Card>
      )}

      {topProducts.length > 0 && (
        <Card className="card-hover">
          <CardHeader><CardTitle>Top Converting Products</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border text-sm">
              {topProducts.map((p, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-3 transition-colors duration-150 hover:bg-muted/30">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-muted-foreground w-5 text-xs font-medium">#{i + 1}</span>
                    <span className="truncate max-w-[280px]">{p.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{p.shop}</span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-xs text-muted-foreground">x{p.qty}</span>
                    <span className="font-semibold text-success">₫{p.commission.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {postActivityBuckets.length > 0 && (
        <Card className="card-hover">
          <CardHeader><CardTitle>Post Activity</CardTitle></CardHeader>
          <CardContent>
            <AreaChartCard data={postActivityBuckets} dataKey="posts" nameKey="label" height={200} />
          </CardContent>
        </Card>
      )}
    </>
  )
}
