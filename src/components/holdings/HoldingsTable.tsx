import { useMemo, useState } from 'react'
import { ArrowUpDown, LayoutGrid, List, Search, Pencil, Trash2 } from 'lucide-react'
import type { Holding, PlatformAccount } from '@/types'
import { Input, Select } from '@/components/ui/Field'
import { Badge, ReturnBadge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatINR, formatNumber, maskValue } from '@/lib/currency'
import { cn } from '@/lib/cn'
import { usePortfolioStore } from '@/store/portfolioStore'

type SortKey = 'instrumentName' | 'investedAmount' | 'currentValue' | 'returnPct'
type GainLossFilter = 'all' | 'gain' | 'loss'

export function HoldingsTable({
  holdings,
  accounts,
  onRowClick,
  onEdit,
  onDelete,
}: {
  holdings: Holding[]
  accounts: PlatformAccount[]
  onRowClick: (h: Holding) => void
  onEdit: (h: Holding) => void
  onDelete: (h: Holding) => void
}) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('currentValue')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [view, setView] = useState<'table' | 'card'>('table')
  const [glFilter, setGlFilter] = useState<GainLossFilter>('all')
  const showBalances = usePortfolioStore((s) => s.settings.showBalances)

  const accountName = (id: string) => accounts.find((a) => a.id === id)?.platformName ?? id

  const processed = useMemo(() => {
    let rows = holdings.map((h) => ({
      holding: h,
      returnPct: h.investedAmount > 0 ? ((h.currentValue - h.investedAmount) / h.investedAmount) * 100 : 0,
    }))
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter((r) => r.holding.instrumentName.toLowerCase().includes(q) || (r.holding.symbol ?? '').toLowerCase().includes(q))
    }
    if (glFilter === 'gain') rows = rows.filter((r) => r.returnPct >= 0)
    if (glFilter === 'loss') rows = rows.filter((r) => r.returnPct < 0)
    rows.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'instrumentName') cmp = a.holding.instrumentName.localeCompare(b.holding.instrumentName)
      else if (sortKey === 'returnPct') cmp = a.returnPct - b.returnPct
      else cmp = a.holding[sortKey] - b.holding[sortKey]
      return sortDir === 'asc' ? cmp : -cmp
    })
    return rows
  }, [holdings, search, sortKey, sortDir, glFilter])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const fmt = (v: number, compact = false) => (showBalances ? formatINR(v, { compact }) : maskValue(formatINR(v, { compact })))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search holdings..." className="pl-8" />
        </div>
        <Select value={glFilter} onChange={(e) => setGlFilter(e.target.value as GainLossFilter)} className="w-auto">
          <option value="all">All P&L</option>
          <option value="gain">Gainers</option>
          <option value="loss">Losers</option>
        </Select>
        <Select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)} className="w-auto">
          <option value="currentValue">Sort: Current Value</option>
          <option value="investedAmount">Sort: Invested</option>
          <option value="returnPct">Sort: Return %</option>
          <option value="instrumentName">Sort: Name</option>
        </Select>
        <div className="flex gap-1 rounded-lg border border-[var(--color-border-light)] p-1">
          <button onClick={() => setView('table')} className={cn('rounded-md p-1.5', view === 'table' ? 'bg-[var(--color-emerald)] text-[#07140f]' : 'text-[var(--color-text-muted)]')}>
            <List size={14} />
          </button>
          <button onClick={() => setView('card')} className={cn('rounded-md p-1.5', view === 'card' ? 'bg-[var(--color-emerald)] text-[#07140f]' : 'text-[var(--color-text-muted)]')}>
            <LayoutGrid size={14} />
          </button>
        </div>
      </div>

      {processed.length === 0 && (
        <EmptyState title="No holdings match your filters" description="Try clearing the search or switching the P&L filter." />
      )}

      {processed.length > 0 && view === 'table' && (
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] text-left text-xs text-[var(--color-text-muted)]">
                <th className="px-4 py-3 font-medium">
                  <button className="flex items-center gap-1" onClick={() => toggleSort('instrumentName')}>Instrument <ArrowUpDown size={11} /></button>
                </th>
                <th className="px-4 py-3 font-medium">Platform</th>
                <th className="px-4 py-3 font-medium text-right">Qty</th>
                <th className="px-4 py-3 font-medium text-right">
                  <button className="flex items-center gap-1 ml-auto" onClick={() => toggleSort('investedAmount')}>Invested <ArrowUpDown size={11} /></button>
                </th>
                <th className="px-4 py-3 font-medium text-right">
                  <button className="flex items-center gap-1 ml-auto" onClick={() => toggleSort('currentValue')}>Current Value <ArrowUpDown size={11} /></button>
                </th>
                <th className="px-4 py-3 font-medium text-right">P&L</th>
                <th className="px-4 py-3 font-medium text-right">
                  <button className="flex items-center gap-1 ml-auto" onClick={() => toggleSort('returnPct')}>Return <ArrowUpDown size={11} /></button>
                </th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {processed.map(({ holding: h, returnPct }) => (
                <tr
                  key={h.id}
                  onClick={() => onRowClick(h)}
                  className="cursor-pointer border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-raised)]"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--color-text-primary)]">{h.instrumentName}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{h.assetClass}{h.symbol ? ` · ${h.symbol}` : ''}</p>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">{accountName(h.accountId)}</td>
                  <td className="px-4 py-3 text-right num-tabular text-[var(--color-text-secondary)]">{formatNumber(h.quantity)}</td>
                  <td className="px-4 py-3 text-right num-tabular">{fmt(h.investedAmount)}</td>
                  <td className="px-4 py-3 text-right num-tabular font-medium">{fmt(h.currentValue)}</td>
                  <td className={cn('px-4 py-3 text-right num-tabular', h.currentValue - h.investedAmount >= 0 ? 'text-[var(--color-gain)]' : 'text-[var(--color-loss)]')}>
                    {fmt(h.currentValue - h.investedAmount)}
                  </td>
                  <td className="px-4 py-3 text-right"><ReturnBadge value={returnPct} /></td>
                  <td className="px-4 py-3 text-right">
                    {h.isManual && (
                      <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => onEdit(h)} className="rounded-md p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-border)] hover:text-[var(--color-text-primary)]">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => onDelete(h)} className="rounded-md p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-rose)]/10 hover:text-[var(--color-rose)]">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {processed.length > 0 && view === 'card' && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {processed.map(({ holding: h, returnPct }) => (
            <div
              key={h.id}
              onClick={() => onRowClick(h)}
              className="cursor-pointer rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 hover:border-[var(--color-border-light)] hover:bg-[var(--color-surface-raised)]"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-[var(--color-text-primary)]">{h.instrumentName}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{accountName(h.accountId)}</p>
                </div>
                <Badge tone="neutral">{h.assetClass}</Badge>
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Current Value</p>
                  <p className="text-base font-semibold num-tabular">{fmt(h.currentValue)}</p>
                </div>
                <ReturnBadge value={returnPct} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
