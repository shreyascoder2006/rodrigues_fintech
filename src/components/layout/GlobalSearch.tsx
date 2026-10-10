import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { usePortfolioStore } from '@/store/portfolioStore'
import { EXPLORE_INSTRUMENTS } from '@/data/seedData'
import { assetClassToSlug } from '@/lib/navigation'

export function GlobalSearch() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const navigate = useNavigate()
  const holdings = usePortfolioStore((s) => s.holdings)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    if (query.trim().length < 2) return { holdings: [], instruments: [] }
    const q = query.toLowerCase()
    return {
      holdings: holdings.filter((h) => h.instrumentName.toLowerCase().includes(q)).slice(0, 4),
      instruments: EXPLORE_INSTRUMENTS.filter((i) => i.name.toLowerCase().includes(q)).slice(0, 4),
    }
  }, [query, holdings])

  const hasResults = results.holdings.length > 0 || results.instruments.length > 0

  return (
    <div className="relative w-full max-w-sm">
      <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border-light)] bg-[var(--color-bg)] px-3 py-2">
        <Search size={15} className="text-[var(--color-text-muted)]" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search holdings, instruments..."
          className="w-full bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
            <X size={14} />
          </button>
        )}
      </div>
      {focused && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-80 overflow-y-auto rounded-xl border border-[var(--color-border-light)] bg-[var(--color-surface-raised)] shadow-xl animate-fade-in">
          {!hasResults && <p className="px-4 py-3 text-xs text-[var(--color-text-muted)]">No matches found.</p>}
          {results.holdings.length > 0 && (
            <div className="px-2 py-2">
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Your Holdings</p>
              {results.holdings.map((h) => (
                <button
                  key={h.id}
                  onClick={() => {
                    navigate(`/portfolio/asset/${assetClassToSlug(h.assetClass)}`)
                    setQuery('')
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]"
                >
                  <span>{h.instrumentName}</span>
                  <span className="text-xs text-[var(--color-text-muted)]">{h.assetClass}</span>
                </button>
              ))}
            </div>
          )}
          {results.instruments.length > 0 && (
            <div className="px-2 py-2">
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Explore</p>
              {results.instruments.map((i) => (
                <button
                  key={i.id}
                  onClick={() => {
                    navigate(`/explore/${i.id}`)
                    setQuery('')
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]"
                >
                  <span>{i.name}</span>
                  <span className="text-xs text-[var(--color-text-muted)]">{i.category}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
