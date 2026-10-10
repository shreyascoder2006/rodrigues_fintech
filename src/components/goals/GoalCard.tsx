import { useMemo, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import type { Goal } from '@/types'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SliderField } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { formatINR } from '@/lib/currency'
import { formatDate, monthsBetween } from '@/lib/date'
import { projectGoalFutureValue } from '@/lib/calculations'
import { usePortfolioStore } from '@/store/portfolioStore'
import { useToast } from '@/components/ui/Toast'

export function GoalCard({ goal, onEdit, onDelete }: { goal: Goal; onEdit: (g: Goal) => void; onDelete: (g: Goal) => void }) {
  const updateGoal = usePortfolioStore((s) => s.updateGoal)
  const { show } = useToast()
  const [monthlyContribution, setMonthlyContribution] = useState(goal.monthlyContribution)
  const [assumedAnnualReturn, setAssumedAnnualReturn] = useState(goal.assumedAnnualReturn)
  const [dirty, setDirty] = useState(false)

  const months = Math.max(monthsBetween(new Date(), new Date(goal.targetDate)), 1)
  const projectedValue = useMemo(
    () => projectGoalFutureValue(goal.currentAmount, monthlyContribution, assumedAnnualReturn, months),
    [goal.currentAmount, monthlyContribution, assumedAnnualReturn, months],
  )
  const diff = projectedValue - goal.targetAmount
  const progressPct = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)

  function handleSave() {
    updateGoal(goal.id, { monthlyContribution, assumedAnnualReturn })
    setDirty(false)
    show('Goal projection saved.')
  }

  return (
    <Card>
      <CardBody className="pt-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">{goal.name}</p>
            <p className="text-xs text-[var(--color-text-muted)]">Target {formatDate(goal.targetDate)} · {formatINR(goal.targetAmount, { compact: true })}</p>
          </div>
          <div className="flex gap-1">
            <button onClick={() => onEdit(goal)} className="rounded-md p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]">
              <Pencil size={13} />
            </button>
            <button onClick={() => onDelete(goal)} className="rounded-md p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-rose)]/10 hover:text-[var(--color-rose)]">
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
          <div className="h-full rounded-full bg-[var(--color-emerald)]" style={{ width: `${progressPct}%` }} />
        </div>
        <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">{formatINR(goal.currentAmount, { compact: true })} saved · {progressPct.toFixed(0)}% of target</p>

        <div className="mt-4 space-y-3">
          <SliderField
            label="Monthly contribution"
            value={monthlyContribution}
            min={0}
            max={100000}
            step={500}
            onChange={(v) => {
              setMonthlyContribution(v)
              setDirty(true)
            }}
            formatValue={(v) => formatINR(v, { compact: true })}
          />
          <SliderField
            label="Assumed annual return"
            value={assumedAnnualReturn}
            min={1}
            max={20}
            step={0.5}
            onChange={(v) => {
              setAssumedAnnualReturn(v)
              setDirty(true)
            }}
            formatValue={(v) => `${v}%`}
          />
        </div>

        <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--color-text-muted)]">Projected value by {formatDate(goal.targetDate)}</span>
            <Badge tone={diff >= 0 ? 'gain' : 'loss'}>{diff >= 0 ? 'Surplus' : 'Shortfall'}</Badge>
          </div>
          <p className="mt-1 text-lg font-semibold num-tabular">{formatINR(projectedValue, { compact: true })}</p>
          <p className={`mt-0.5 text-xs num-tabular ${diff >= 0 ? 'text-[var(--color-gain)]' : 'text-[var(--color-loss)]'}`}>
            {diff >= 0 ? '+' : ''}{formatINR(diff, { compact: true })} vs target
          </p>
        </div>

        {dirty && (
          <Button variant="primary" size="sm" className="mt-3 w-full" onClick={handleSave}>Save Projection Inputs</Button>
        )}
      </CardBody>
    </Card>
  )
}
