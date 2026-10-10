import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Label, Input, FieldError } from '@/components/ui/Field'
import { usePortfolioStore } from '@/store/portfolioStore'
import { useToast } from '@/components/ui/Toast'
import type { Goal } from '@/types'

const emptyForm = { name: '', targetAmount: '', currentAmount: '', monthlyContribution: '', targetDate: '', assumedAnnualReturn: '10' }

export function GoalFormModal({ open, onClose, editingGoal }: { open: boolean; onClose: () => void; editingGoal?: Goal | null }) {
  const addGoal = usePortfolioStore((s) => s.addGoal)
  const updateGoal = usePortfolioStore((s) => s.updateGoal)
  const { show } = useToast()
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editingGoal) {
      setForm({
        name: editingGoal.name,
        targetAmount: String(editingGoal.targetAmount),
        currentAmount: String(editingGoal.currentAmount),
        monthlyContribution: String(editingGoal.monthlyContribution),
        targetDate: editingGoal.targetDate.slice(0, 10),
        assumedAnnualReturn: String(editingGoal.assumedAnnualReturn),
      })
    } else {
      setForm(emptyForm)
    }
    setErrors({})
  }, [editingGoal, open])

  function validate() {
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = 'Goal name is required.'
    if (!form.targetAmount || Number(form.targetAmount) <= 0) next.targetAmount = 'Enter a valid target amount.'
    if (!form.targetDate) next.targetDate = 'Pick a target date.'
    else if (new Date(form.targetDate) <= new Date()) next.targetDate = 'Target date must be in the future.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    const payload = {
      name: form.name.trim(),
      targetAmount: Number(form.targetAmount),
      currentAmount: Number(form.currentAmount) || 0,
      monthlyContribution: Number(form.monthlyContribution) || 0,
      targetDate: new Date(form.targetDate).toISOString(),
      assumedAnnualReturn: Number(form.assumedAnnualReturn) || 0,
    }
    if (editingGoal) {
      updateGoal(editingGoal.id, payload)
      show('Goal updated.')
    } else {
      addGoal(payload)
      show('Goal created.')
    }
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editingGoal ? 'Edit Goal' : 'Create a Goal'} size="sm">
      <div className="space-y-4">
        <div>
          <Label>Goal name</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Retirement Corpus" />
          <FieldError>{errors.name}</FieldError>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Target amount (₹)</Label>
            <Input type="number" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} />
            <FieldError>{errors.targetAmount}</FieldError>
          </div>
          <div>
            <Label>Current savings (₹)</Label>
            <Input type="number" value={form.currentAmount} onChange={(e) => setForm({ ...form, currentAmount: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Monthly contribution (₹)</Label>
            <Input type="number" value={form.monthlyContribution} onChange={(e) => setForm({ ...form, monthlyContribution: e.target.value })} />
          </div>
          <div>
            <Label>Assumed annual return (%)</Label>
            <Input type="number" value={form.assumedAnnualReturn} onChange={(e) => setForm({ ...form, assumedAnnualReturn: e.target.value })} />
          </div>
        </div>
        <div>
          <Label>Target date</Label>
          <Input type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} />
          <FieldError>{errors.targetDate}</FieldError>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>{editingGoal ? 'Save Changes' : 'Create Goal'}</Button>
      </div>
    </Modal>
  )
}
