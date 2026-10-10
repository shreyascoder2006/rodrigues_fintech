import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Label, Input, Select, FieldError } from '@/components/ui/Field'
import { usePortfolioStore } from '@/store/portfolioStore'
import { useToast } from '@/components/ui/Toast'
import type { AssetClass, Holding, PlatformId } from '@/types'
import { ASSET_CLASSES } from '@/lib/navigation'
import { isoToday } from '@/lib/date'

interface HoldingFormModalProps {
  open: boolean
  onClose: () => void
  editingHolding?: Holding | null
}

const emptyForm = {
  instrumentName: '',
  assetClass: 'Stocks' as AssetClass,
  accountId: 'manual' as PlatformId,
  quantity: '',
  investedAmount: '',
  currentValue: '',
}

export function HoldingFormModal({ open, onClose, editingHolding }: HoldingFormModalProps) {
  const accounts = usePortfolioStore((s) => s.accounts)
  const addHolding = usePortfolioStore((s) => s.addHolding)
  const updateHolding = usePortfolioStore((s) => s.updateHolding)
  const { show } = useToast()
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editingHolding) {
      setForm({
        instrumentName: editingHolding.instrumentName,
        assetClass: editingHolding.assetClass,
        accountId: editingHolding.accountId,
        quantity: String(editingHolding.quantity),
        investedAmount: String(editingHolding.investedAmount),
        currentValue: String(editingHolding.currentValue),
      })
    } else {
      setForm(emptyForm)
    }
    setErrors({})
  }, [editingHolding, open])

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!form.instrumentName.trim()) next.instrumentName = 'Instrument name is required.'
    if (!form.investedAmount || Number(form.investedAmount) <= 0) next.investedAmount = 'Enter a valid invested amount.'
    if (!form.currentValue || Number(form.currentValue) < 0) next.currentValue = 'Enter a valid current value.'
    if (!form.quantity || Number(form.quantity) <= 0) next.quantity = 'Enter a valid quantity.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    const payload = {
      instrumentName: form.instrumentName.trim(),
      assetClass: form.assetClass,
      accountId: form.accountId,
      quantity: Number(form.quantity),
      investedAmount: Number(form.investedAmount),
      currentValue: Number(form.currentValue),
      currency: 'INR' as const,
      purchaseDate: editingHolding?.purchaseDate ?? isoToday(),
      isManual: true,
    }
    if (editingHolding) {
      updateHolding(editingHolding.id, payload)
      show('Holding updated successfully.')
    } else {
      addHolding(payload)
      show('Manual investment added to your portfolio.')
    }
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editingHolding ? 'Edit Holding' : 'Add Manual Investment'} description="Track an investment that isn't linked to a platform.">
      <div className="grid gap-4">
        <div>
          <Label>Instrument name</Label>
          <Input
            value={form.instrumentName}
            onChange={(e) => setForm({ ...form, instrumentName: e.target.value })}
            placeholder="e.g. Physical Gold, ABC Pvt Ltd Shares"
          />
          <FieldError>{errors.instrumentName}</FieldError>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Asset class</Label>
            <Select value={form.assetClass} onChange={(e) => setForm({ ...form, assetClass: e.target.value as AssetClass })}>
              {ASSET_CLASSES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Account</Label>
            <Select value={form.accountId} onChange={(e) => setForm({ ...form, accountId: e.target.value as PlatformId })}>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.platformName}</option>
              ))}
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Quantity / Units</Label>
            <Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="0" />
            <FieldError>{errors.quantity}</FieldError>
          </div>
          <div>
            <Label>Invested amount (₹)</Label>
            <Input type="number" value={form.investedAmount} onChange={(e) => setForm({ ...form, investedAmount: e.target.value })} placeholder="0" />
            <FieldError>{errors.investedAmount}</FieldError>
          </div>
          <div>
            <Label>Current value (₹)</Label>
            <Input type="number" value={form.currentValue} onChange={(e) => setForm({ ...form, currentValue: e.target.value })} placeholder="0" />
            <FieldError>{errors.currentValue}</FieldError>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>{editingHolding ? 'Save Changes' : 'Add Investment'}</Button>
      </div>
    </Modal>
  )
}
