'use client'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

interface KpiCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: { value: number; label: string }
  color?: string
}

export function KpiCard({ title, value, icon, trend, color }: KpiCardProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [animDone, setAnimDone] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const numVal = typeof value === 'number' ? value : parseInt(String(value)) || 0

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animDone) {
        setAnimDone(true)
        const duration = 800
        const steps = 30
        const stepTime = duration / steps
        let current = 0
        const increment = numVal / steps
        const timer = setInterval(() => {
          current += increment
          if (current >= numVal) {
            setDisplayValue(numVal)
            clearInterval(timer)
          } else {
            setDisplayValue(Math.round(current))
          }
        }, stepTime)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [numVal, animDone])

  return (
    <Card className="card-hover">
      <CardContent className="p-5">
        <div ref={ref} className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-5 w-5 text-primary shrink-0">{icon}</div>
            <p className="text-sm font-medium text-muted-foreground leading-5">{title}</p>
          </div>
          <p className="text-2xl font-bold" style={color ? { color } : undefined}>
            {typeof value === 'number' ? displayValue.toLocaleString() : value}
          </p>
          {trend && (
            <div className="flex items-center gap-1 text-xs">
              {trend.value >= 0
                ? <TrendingUp className="h-3 w-3 text-success" />
                : <TrendingDown className="h-3 w-3 text-danger" />}
              <span className={trend.value >= 0 ? 'text-success' : 'text-danger'}>
                {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}