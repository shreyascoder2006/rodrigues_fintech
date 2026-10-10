import { useState } from 'react'
import { Plus } from 'lucide-react'
import { usePortfolioStore } from '@/store/portfolioStore'
import { GoalCard } from '@/components/goals/GoalCard'
import { GoalFormModal } from '@/components/goals/GoalFormModal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { useToast } from '@/components/ui/Toast'
import type { Goal } from '@/types'

export default function GoalsPage() {
  const goals = usePortfolioStore((s) => s.goals)
  const deleteGoal = usePortfolioStore((s) => s.deleteGoal)
  const [formOpen, setFormOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Goal | null>(null)
  const { show } = useToast()

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Goals & Planner</h1>
          <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">Set a target, adjust assumptions, and see projected outcomes instantly.</p>
        </div>
        <Button
          variant="primary"
          icon={<Plus size={15} />}
          onClick={() => {
            setEditingGoal(null)
            setFormOpen(true)
          }}
        >
          Create Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <EmptyState title="No goals yet" description="Create your first financial goal to start projecting its future value." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              onEdit={(goal) => {
                setEditingGoal(goal)
                setFormOpen(true)
              }}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <p className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-xs text-[var(--color-text-muted)]">
        Projections assume monthly contributions at the start of each month, compounded monthly at your assumed annual return. This is an illustrative forecast, not a guaranteed outcome.
      </p>

      <GoalFormModal open={formOpen} onClose={() => setFormOpen(false)} editingGoal={editingGoal} />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteGoal(deleteTarget.id)
            show('Goal deleted.', 'info')
          }
        }}
        title="Delete goal"
        description={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  )
}
