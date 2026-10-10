import { useMemo } from 'react'
import { AlertTriangle, Bell, CheckCircle2, Info, X } from 'lucide-react'
import { usePortfolioStore } from '@/store/portfolioStore'
import { enabledHoldings } from '@/lib/calculations'
import { generateInsights } from '@/lib/insights'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { SliderField } from '@/components/ui/Field'
import type { AllocationTargets } from '@/types'

const TARGET_CLASSES: Array<keyof AllocationTargets> = ['Stocks', 'Mutual Funds', 'Bonds', 'Crypto', 'Gold']

const severityIcon = {
  warning: <AlertTriangle size={16} className="text-[var(--color-amber)]" />,
  info: <Info size={16} className="text-[var(--color-blue)]" />,
  positive: <CheckCircle2 size={16} className="text-[var(--color-emerald)]" />,
}

export default function InsightsPage() {
  const { accounts, holdings, transactions, settings, dismissedInsightIds, readInsightIds, dismissInsight, markInsightRead, setAllocationTarget } =
    usePortfolioStore((s) => s)

  const scoped = useMemo(() => enabledHoldings(holdings, accounts), [holdings, accounts])
  const insights = useMemo(
    () => generateInsights(scoped, accounts, transactions, settings.allocationTargets).filter((i) => !dismissedInsightIds.includes(i.id)),
    [scoped, accounts, transactions, settings.allocationTargets, dismissedInsightIds],
  )

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Insights & Alerts</h1>
        <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">Rule-based observations generated from your actual tracked holdings.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="flex flex-col gap-3 lg:col-span-2">
          {insights.length === 0 ? (
            <EmptyState icon={<Bell size={28} />} title="No active insights" description="As your holdings and allocations change, observations will appear here." />
          ) : (
            insights.map((i) => {
              const isRead = readInsightIds.includes(i.id)
              return (
                <Card key={i.id} className={isRead ? 'opacity-60' : undefined}>
                  <CardBody className="flex items-start justify-between gap-3 pt-4">
                    <div className="flex items-start gap-3">
                      {severityIcon[i.severity]}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-[var(--color-text-primary)]">{i.title}</p>
                          {!isRead && <Badge tone="emerald">New</Badge>}
                        </div>
                        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{i.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 gap-1">
                      {!isRead && (
                        <button onClick={() => markInsightRead(i.id)} className="rounded-md px-2 py-1 text-[11px] text-[var(--color-emerald)] hover:bg-[var(--color-emerald)]/10">
                          Mark read
                        </button>
                      )}
                      <button onClick={() => dismissInsight(i.id)} className="rounded-md p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-border)]">
                        <X size={14} />
                      </button>
                    </div>
                  </CardBody>
                </Card>
              )
            })
          )}
        </div>

        <Card className="h-fit">
          <CardBody className="pt-5">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Allocation Targets</h3>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">Set target weights to trigger drift alerts.</p>
            <div className="mt-4 space-y-4">
              {TARGET_CLASSES.map((ac) => (
                <SliderField
                  key={ac}
                  label={ac}
                  value={settings.allocationTargets[ac] ?? 0}
                  min={0}
                  max={80}
                  step={1}
                  onChange={(v) => setAllocationTarget(ac, v)}
                  formatValue={(v) => `${v}%`}
                />
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
