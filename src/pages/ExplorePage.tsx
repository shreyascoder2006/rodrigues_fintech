import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { EXPLORE_INSTRUMENTS } from '@/data/seedData'
import { InstrumentCard } from '@/components/explore/InstrumentCard'
import { Input } from '@/components/ui/Field'
import { Switch } from '@/components/ui/Field'
import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/cn'
import type { AssetClass } from '@/types'

const CATEGORIES: { label: AssetClass | 'All'; blurb: string }[] = [
  { label: 'All', blurb: 'Explore every supported investment category in one place.' },
  { label: 'REITs', blurb: 'Income-generating real estate, owned through listed trust units.' },
  { label: 'InvITs', blurb: 'Infrastructure assets like roads and power lines, pooled into tradeable units.' },
  { label: 'Bonds', blurb: 'Lend to governments or companies for predictable, fixed income.' },
  { label: 'Crypto', blurb: 'Decentralized digital assets — highly volatile, speculative exposure.' },
  { label: 'Gold', blurb: 'Gold-linked instruments without the hassle of physical storage.' },
  { label: 'Fixed Deposits', blurb: 'Guaranteed-rate bank deposits for capital preservation.' },
  { label: 'Stocks', blurb: 'Direct ownership in listed companies.' },
  { label: 'Mutual Funds', blurb: 'Professionally managed, pooled investment vehicles.' },
  { label: 'ETFs', blurb: 'Low-cost, exchange-traded baskets that track an index or sector.' },
]

export default function ExplorePage() {
  const [category, setCategory] = useState<AssetClass | 'All'>('All')
  const [search, setSearch] = useState('')
  const [beginnerMode, setBeginnerMode] = useState(false)

  const filtered = useMemo(() => {
    return EXPLORE_INSTRUMENTS.filter((i) => {
      if (category !== 'All' && i.category !== category) return false
      if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false
      if (beginnerMode && !['Low', 'Moderate'].includes(i.risk)) return false
      return true
    })
  }, [category, search, beginnerMode])

  const activeBlurb = CATEGORIES.find((c) => c.label === category)?.blurb

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Explore Investments</h1>
        <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">Discover and understand investments beyond conventional stocks and mutual funds.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c.label}
            onClick={() => setCategory(c.label)}
            className={cn(
              'flex-shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
              category === c.label
                ? 'border-[var(--color-emerald)] bg-[var(--color-emerald)]/10 text-[var(--color-emerald)]'
                : 'border-[var(--color-border-light)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)]',
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {activeBlurb && <p className="text-sm text-[var(--color-text-secondary)]">{activeBlurb}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search instruments..." className="pl-8" />
        </div>
        <Switch checked={beginnerMode} onChange={setBeginnerMode} label="Help me understand this investment (lower risk only)" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No instruments match your filters" description="Try a different category or clear your search." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((i) => (
            <InstrumentCard key={i.id} instrument={i} />
          ))}
        </div>
      )}
    </div>
  )
}
