import { useNavigate } from 'react-router-dom'
import { Star } from 'lucide-react'
import type { ExploreInstrument } from '@/types'
import { Badge, ReturnBadge } from '@/components/ui/Badge'
import { Sparkline } from '@/components/charts/Sparkline'
import { colorForAssetClass } from '@/lib/colors'
import { formatINR } from '@/lib/currency'
import { usePortfolioStore } from '@/store/portfolioStore'
import { cn } from '@/lib/cn'

export function InstrumentCard({ instrument }: { instrument: ExploreInstrument }) {
  const navigate = useNavigate()
  const watchlist = usePortfolioStore((s) => s.watchlist)
  const addWatchlistItem = usePortfolioStore((s) => s.addWatchlistItem)
  const removeWatchlistItem = usePortfolioStore((s) => s.removeWatchlistItem)
  const isWatched = watchlist.some((w) => w.instrumentId === instrument.id)
  const color = colorForAssetClass(instrument.category)

  return (
    <div
      onClick={() => navigate(`/explore/${instrument.id}`)}
      className="cursor-pointer rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-border-light)] hover:bg-[var(--color-surface-raised)]"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">{instrument.name}</p>
          <p className="text-xs text-[var(--color-text-muted)]">{instrument.subtitle}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (isWatched) removeWatchlistItem(instrument.id)
            else addWatchlistItem({ instrumentId: instrument.id, instrumentName: instrument.name, assetClass: instrument.category, illustrativePrice: instrument.illustrativePrice })
          }}
          className={cn('rounded-lg p-1.5', isWatched ? 'text-[var(--color-amber)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-amber)]')}
        >
          <Star size={16} fill={isWatched ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="mt-2 h-12">
        <Sparkline data={instrument.history} color={color} />
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className="num-tabular text-sm font-semibold">{formatINR(instrument.illustrativePrice, { compact: instrument.illustrativePrice > 100000 })}</span>
        <ReturnBadge value={instrument.change1y} />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge tone="neutral">{instrument.category}</Badge>
        <Badge tone={instrument.risk === 'Low' ? 'gain' : instrument.risk === 'Very High' ? 'loss' : 'amber'}>{instrument.risk} risk</Badge>
      </div>
    </div>
  )
}
