import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { AllocationSlice } from '@/lib/calculations'
import { colorForIndex } from '@/lib/colors'
import { formatINR } from '@/lib/currency'

export function DonutAllocation({
  data,
  onSliceClick,
  getColor,
  height = 220,
}: {
  data: AllocationSlice[]
  onSliceClick?: (label: string) => void
  getColor?: (label: string, index: number) => string
  height?: number
}) {
  if (data.length === 0) {
    return <div className="flex h-[220px] items-center justify-center text-sm text-[var(--color-text-muted)]">No allocation data</div>
  }
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius="62%"
          outerRadius="95%"
          paddingAngle={2}
          cornerRadius={4}
          onClick={(entry) => onSliceClick?.((entry as unknown as AllocationSlice).label)}
        >
          {data.map((slice, i) => (
            <Cell
              key={slice.label}
              fill={getColor ? getColor(slice.label, i) : colorForIndex(i)}
              className="cursor-pointer outline-none"
              stroke="var(--color-surface)"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-border-light)', borderRadius: 10, fontSize: 12 }}
          formatter={(value, _name, item) => [formatINR(Number(value ?? 0), { compact: true }), (item?.payload as unknown as AllocationSlice)?.label]}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
