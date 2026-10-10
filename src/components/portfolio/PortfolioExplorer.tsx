import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import type { AssetClass, Holding, PlatformId } from '@/types'
import { usePortfolioStore } from '@/store/portfolioStore'
import { enabledHoldings, filterByAccount, filterByAssetClass, summarize } from '@/lib/calculations'
import { Select } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { PortfolioSummaryCards } from '@/components/portfolio/PortfolioSummaryCards'
import { HoldingsTable } from '@/components/holdings/HoldingsTable'
import { HoldingFormModal } from '@/components/holdings/HoldingFormModal'
import { HoldingDetailDrawer } from '@/components/holdings/HoldingDetailDrawer'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'
import { ASSET_CLASSES } from '@/lib/navigation'

export function PortfolioExplorer({
  title,
  subtitle,
  initialAccountId = 'all',
  initialAssetClass = 'all',
}: {
  title: string
  subtitle?: string
  initialAccountId?: PlatformId | 'all'
  initialAssetClass?: AssetClass | 'all'
}) {
  const accounts = usePortfolioStore((s) => s.accounts)
  const allHoldings = usePortfolioStore((s) => s.holdings)
  const deleteHolding = usePortfolioStore((s) => s.deleteHolding)
  const { show } = useToast()

  const [accountFilter, setAccountFilter] = useState<PlatformId | 'all'>(initialAccountId)
  const [assetTab, setAssetTab] = useState<AssetClass | 'all'>(initialAssetClass)
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingHolding, setEditingHolding] = useState<Holding | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Holding | null>(null)

  const available = useMemo(() => enabledHoldings(allHoldings, accounts), [allHoldings, accounts])
  const scoped = useMemo(
    () => filterByAssetClass(filterByAccount(available, accountFilter), assetTab),
    [available, accountFilter, assetTab],
  )
  const summary = useMemo(() => summarize(scoped), [scoped])

  const tabCounts = useMemo(() => {
    const byAccount = filterByAccount(available, accountFilter)
    return ASSET_CLASSES.reduce<Record<string, number>>((acc, ac) => {
      acc[ac] = filterByAssetClass(byAccount, ac).length
      return acc
    }, {})
  }, [available, accountFilter])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">{subtitle}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={accountFilter} onChange={(e) => setAccountFilter(e.target.value as PlatformId | 'all')} className="w-auto">
            <option value="all">All Platforms</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id} disabled={!a.isEnabled}>
                {a.platformName}{!a.isEnabled ? ' (disconnected)' : ''}
              </option>
            ))}
          </Select>
          <Button
            variant="primary"
            icon={<Plus size={15} />}
            onClick={() => {
              setEditingHolding(null)
              setFormOpen(true)
            }}
          >
            Add Investment
          </Button>
        </div>
      </div>

      <PortfolioSummaryCards summary={summary} holdingsCount={scoped.length} />

      <Tabs
        tabs={[
          { value: 'all', label: 'All Holdings', count: filterByAccount(available, accountFilter).length },
          ...ASSET_CLASSES.filter((a) => tabCounts[a] > 0 || a === assetTab).map((a) => ({ value: a, label: a, count: tabCounts[a] })),
        ]}
        active={assetTab}
        onChange={setAssetTab}
      />

      <HoldingsTable
        holdings={scoped}
        accounts={accounts}
        onRowClick={setSelectedHolding}
        onEdit={(h) => {
          setEditingHolding(h)
          setFormOpen(true)
        }}
        onDelete={(h) => setDeleteTarget(h)}
      />

      <HoldingFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditingHolding(null)
        }}
        editingHolding={editingHolding}
      />

      <HoldingDetailDrawer
        holding={selectedHolding}
        onClose={() => setSelectedHolding(null)}
        onEdit={(h) => {
          setSelectedHolding(null)
          setEditingHolding(h)
          setFormOpen(true)
        }}
        onDelete={(h) => {
          setSelectedHolding(null)
          setDeleteTarget(h)
        }}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteHolding(deleteTarget.id)
            show('Holding removed from your portfolio.', 'info')
          }
        }}
        title="Delete holding"
        description={`Remove "${deleteTarget?.instrumentName}" from your tracked portfolio? This cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  )
}
