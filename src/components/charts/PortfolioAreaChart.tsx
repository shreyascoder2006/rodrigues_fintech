import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { PortfolioSnapshot } from '@/types'
import { formatINR } from '@/lib/currency'
import { formatDate } from '@/lib/date'

export function PortfolioAreaChart({ data, height = 260, color = 'var(--color-emerald)' }: { data: PortfolioSnapshot[]; height?: number; color?: string }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" tick={false} axisLine={false} tickLine={false} />
        <YAxis hide domain={['dataMin - 5000', 'dataMax + 5000']} />
        <Tooltip
          contentStyle={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-border-light)', borderRadius: 10, fontSize: 12 }}
          labelFormatter={(label) => formatDate(label as string)}
          formatter={(value) => [formatINR(Number(value ?? 0)), 'Value']}
        />
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill="url(#portfolioGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
