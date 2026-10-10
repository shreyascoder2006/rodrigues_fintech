import { useMemo, useState } from 'react'
import { Download, Plus, Search } from 'lucide-react'
import { usePortfolioStore } from '@/store/portfolioStore'
import { Input, Select } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Drawer } from '@/components/ui/Drawer'
import { AddTransactionModal } from '@/components/transactions/AddTransactionModal'
import { formatINR } from '@/lib/currency'
import { formatDate, formatDateTime } from '@/lib/date'
import { downloadCsv } from '@/lib/csv'
import { ASSET_CLASSES } from '@/lib/navigation'
import type { Transaction, TransactionType } from '@/types'

const TYPES: TransactionType[] = ['Buy', 'Sell', 'Dividend', 'Interest', 'Distribution', 'Deposit', 'Redemption']

export default function TransactionsPage() {
  const { transactions, accounts } = usePortfolioStore((s) => s)
  const [search, setSearch] = useState('')
  const [platform, setPlatform] = useState('all')
  const [assetClass, setAssetClass] = useState('all')
  const [type, setType] = useState('all')
  const [selected, setSelected] = useState<Transaction | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (search && !t.instrumentName.toLowerCase().includes(search.toLowerCase())) return false
      if (platform !== 'all' && t.accountId !== platform) return false
      if (assetClass !== 'all' && t.assetClass !== assetClass) return false
      if (type !== 'all' && t.transactionType !== type) return false
      return true
    })
  }, [transactions, search, platform, assetClass, type])

  function accountName(id: string) {
    return accounts.find((a) => a.id === id)?.platformName ?? id
  }

  function handleExport() {
    downloadCsv(
      'folioone-transactions.csv',
      filtered.map((t) => ({
        date: formatDate(t.transactionDate),
        instrument: t.instrumentName,
        type: t.transactionType,
        platform: accountName(t.accountId),
        assetClass: t.assetClass,
        amount: t.amount,
        status: t.status,
      })),
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Transactions</h1>
          <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">A unified activity feed across every connected platform.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={<Download size={15} />} onClick={handleExport}>Export CSV</Button>
          <Button variant="primary" icon={<Plus size={15} />} onClick={() => setAddOpen(true)}>Add Transaction</Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search transactions..." className="pl-8" />
        </div>
        <Select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-auto">
          <option value="all">All Platforms</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>{a.platformName}</option>
          ))}
        </Select>
        <Select value={assetClass} onChange={(e) => setAssetClass(e.target.value)} className="w-auto">
          <option value="all">All Asset Classes</option>
          {ASSET_CLASSES.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </Select>
        <Select value={type} onChange={(e) => setType(e.target.value)} className="w-auto">
          <option value="all">All Types</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No transactions found" description="Try adjusting your filters." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] text-left text-xs text-[var(--color-text-muted)]">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Instrument</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Platform</th>
                <th className="px-4 py-3 font-medium text-right">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} onClick={() => setSelected(t)} className="cursor-pointer border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-raised)]">
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">{formatDate(t.transactionDate)}</td>
                  <td className="px-4 py-3 font-medium text-[var(--color-text-primary)]">{t.instrumentName}</td>
                  <td className="px-4 py-3"><Badge tone="neutral">{t.transactionType}</Badge></td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">{accountName(t.accountId)}</td>
                  <td className="px-4 py-3 text-right num-tabular font-medium">{formatINR(t.amount)}</td>
                  <td className="px-4 py-3"><Badge tone={t.status === 'Completed' ? 'gain' : 'amber'}>{t.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.instrumentName ?? ''} subtitle={selected?.transactionType}>
        {selected && (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-[var(--color-text-muted)]">Amount</span><span className="font-semibold">{formatINR(selected.amount)}</span></div>
            <div className="flex justify-between"><span className="text-[var(--color-text-muted)]">Platform</span><span>{accountName(selected.accountId)}</span></div>
            <div className="flex justify-between"><span className="text-[var(--color-text-muted)]">Asset class</span><span>{selected.assetClass}</span></div>
            <div className="flex justify-between"><span className="text-[var(--color-text-muted)]">Date</span><span>{formatDateTime(selected.transactionDate)}</span></div>
            <div className="flex justify-between"><span className="text-[var(--color-text-muted)]">Status</span><span>{selected.status}</span></div>
            {selected.quantity && <div className="flex justify-between"><span className="text-[var(--color-text-muted)]">Quantity</span><span>{selected.quantity}</span></div>}
            {selected.notes && <div className="rounded-lg bg-[var(--color-bg)] p-3 text-xs text-[var(--color-text-secondary)]">{selected.notes}</div>}
          </div>
        )}
      </Drawer>

      <AddTransactionModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}
