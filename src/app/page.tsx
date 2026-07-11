import { getState, getProducts, getClickReport, getConversionReport } from '@/lib/data'
import OverviewClient from '@/components/overview-client'

export default function OverviewPage() {
  const state = getState()
  const products = getProducts()
  const clickReport = getClickReport()
  const conversionReport = getConversionReport()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Affiliate automation performance at a glance</p>
      </div>
      <OverviewClient
        state={state} products={products}
        clickReport={clickReport} conversionReport={conversionReport} />
    </div>
  )
}