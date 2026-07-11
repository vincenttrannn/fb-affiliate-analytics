'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from 'recharts'

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#f97316', '#fbbf24', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6']

const renderPieLabel = (entry: any) => {
  const { percent } = entry
  if (percent < 0.05) return ''
  return `${(percent * 100).toFixed(0)}%`
}

export function PieChartCard({ data, dataKey, nameKey, title, height = 300, onSliceClick }: {
  data: any[]; dataKey: string; nameKey: string; title?: string; height?: number; onSliceClick?: (name: string) => void
}) {
  return (
    <div>
      {title && <h4 className="text-sm font-medium text-muted-foreground mb-3">{title}</h4>}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={data} dataKey={dataKey} nameKey={nameKey} cx="50%" cy="50%" outerRadius={90}
            label={renderPieLabel} labelLine={false}
            style={{ cursor: onSliceClick ? 'pointer' : undefined }}
            onClick={onSliceClick ? (entry: any) => onSliceClick(entry[nameKey]) : undefined}
            isAnimationActive={true} animationBegin={100} animationDuration={700} animationEasing="ease-out">
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
          <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8}
            formatter={(value: string) => <span className="text-xs text-muted-foreground">{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function BarChartCard({ data, dataKey, nameKey, title, color = '#6366f1', height = 300 }: {
  data: any[]; dataKey: string; nameKey: string; title?: string; color?: string; height?: number
}) {
  return (
    <div>
      {title && <h4 className="text-sm font-medium text-muted-foreground mb-3">{title}</h4>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <XAxis dataKey={nameKey} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
          <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={600} animationEasing="ease-out" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function AreaChartCard({ data, dataKey, nameKey, title, height = 200, onHover }: {
  data: any[]; dataKey: string; nameKey: string; title?: string; height?: number; onHover?: (activeIndex: number | null) => void
}) {
  const handleMouseMove = onHover ? (state: any) => {
    if (state?.activeTooltipIndex !== undefined) {
      onHover(state.activeTooltipIndex)
    }
  } : undefined
  const handleMouseLeave = onHover ? () => onHover(null) : undefined
  return (
    <div>
      {title && <h4 className="text-sm font-medium text-muted-foreground mb-3">{title}</h4>}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
          <XAxis dataKey={nameKey} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
          <Area type="monotone" dataKey={dataKey} stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2}
            isAnimationActive={true} animationDuration={600} animationEasing="ease-out" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export { COLORS }
