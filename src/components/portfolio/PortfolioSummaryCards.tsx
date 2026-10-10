import { Card } from '@/components/ui/Card'
import { ReturnBadge } from '@/components/ui/Badge'
import { formatINR, maskValue } from '@/lib/currency'
import { usePortfolioStore } from '@/store/portfolioStore'
import type { PortfolioSummary } from '@/lib/calculations'

export function PortfolioSummaryCards({ summary, holdingsCount }: { summary: PortfolioSummary; holdingsCount: number }) {
  const showBalances = usePortfolioStore((s) => s.settings.showBalances)
  const fmt = (v: number) => (showBalances ? formatINR(v) : maskValue(formatINR(v)))

  const cards = [
    { label: 'Current Value', value: fmt(summary.totalCurrentValue) },
    { label: 'Total Invested', value: fmt(summary.totalInvested) },
    { label: 'Unrealized P&L', value: fmt(summary.totalProfitLoss), tone: summary.totalProfitLoss >= 0 ? 'gain' : 'loss' },
    { label: 'Return', value: null, badge: summary.totalReturnPercentage },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.label} className="p-4">
          <p className="text-xs text-[var(--color-text-muted)]">{c.label}</p>
          {c.value !== null ? (
            <p
              className={`mt-1.5 text-lg font-semibold num-tabular md:text-xl ${
                c.tone === 'gain' ? 'text-[var(--color-gain)]' : c.tone === 'loss' ? 'text-[var(--color-loss)]' : ''
              }`}
            >
              {c.value}
            </p>
          ) : (
            <div className="mt-1.5"><ReturnBadge value={c.badge!} /></div>
          )}
        </Card>
      ))}
      <p className="col-span-2 -mt-1 text-[11px] text-[var(--color-text-muted)] md:col-span-4">{holdingsCount} holding{holdingsCount === 1 ? '' : 's'} included</p>
    </div>
  )
}
