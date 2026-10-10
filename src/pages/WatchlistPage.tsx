import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Star, Trash2 } from 'lucide-react'
import { usePortfolioStore } from '@/store/portfolioStore'
import { Input } from '@/components/ui/Field'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatINR } from '@/lib/currency'
import { formatDate } from '@/lib/date'

export default function WatchlistPage() {
  const watchlist = usePortfolioStore((s) => s.watchlist)
  const removeWatchlistItem = usePortfolioStore((s) => s.removeWatchlistItem)
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () => watchlist.filter((w) => w.instrumentName.toLowerCase().includes(search.toLowerCase())),
    [watchlist, search],
  )

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Watchlist</h1>
        <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">Instruments you're keeping an eye on from Explore Investments.</p>
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search your watchlist..." className="pl-8" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Star size={28} />}
          title="Your watchlist is empty"
          description="Add instruments from the Explore Investments page to track them here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((w) => (
            <div
              key={w.id}
              onClick={() => navigate(`/explore/${w.instrumentId}`)}
              className="cursor-pointer rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 hover:border-[var(--color-border-light)] hover:bg-[var(--color-surface-raised)]"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">{w.instrumentName}</p>
                  <Badge tone="neutral" className="mt-1.5">{w.assetClass}</Badge>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeWatchlistItem(w.instrumentId)
                  }}
                  className="rounded-md p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-rose)]/10 hover:text-[var(--color-rose)]"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <p className="mt-3 num-tabular text-sm font-medium">{formatINR(w.illustrativePrice)}</p>
              <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">Added {formatDate(w.addedAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
