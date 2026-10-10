import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { AllocationSlice } from '@/lib/calculations'
import { colorForIndex } from '@/lib/colors'
import { formatINR } from '@/lib/currency'

export function AllocationBarChart({
  data,
  onBarClick,
  height = 220,
}: {
  data: AllocationSlice[]
  onBarClick?: (label: string) => void
  height?: number
}) {
  if (data.length === 0) {
    return <div className="flex h-[220px] items-center justify-center text-sm text-[var(--color-text-muted)]">No data</div>
  }
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="label"
          width={120}
          tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-border-light)', borderRadius: 10, fontSize: 12 }}
          formatter={(value) => [formatINR(Number(value ?? 0), { compact: true }), 'Value']}
        />
        <Bar
          dataKey="value"
          radius={[0, 6, 6, 0]}
          onClick={(entry) => onBarClick?.((entry as unknown as AllocationSlice).label)}
          className="cursor-pointer"
          barSize={16}
        >
          {data.map((slice, i) => (
            <Cell key={slice.label} fill={colorForIndex(i)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
