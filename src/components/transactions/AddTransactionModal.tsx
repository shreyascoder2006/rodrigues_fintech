import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Label, Select, Input, FieldError } from '@/components/ui/Field'
import { usePortfolioStore } from '@/store/portfolioStore'
import { useToast } from '@/components/ui/Toast'
import type { TransactionType } from '@/types'

const TYPES: TransactionType[] = ['Buy', 'Sell', 'Dividend', 'Interest', 'Distribution', 'Deposit', 'Redemption']

export function AddTransactionModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const holdings = usePortfolioStore((s) => s.holdings)
  const addTransaction = usePortfolioStore((s) => s.addTransaction)
  const { show } = useToast()
  const [holdingId, setHoldingId] = useState(holdings[0]?.id ?? '')
  const [type, setType] = useState<TransactionType>('Buy')
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    const holding = holdings.find((h) => h.id === holdingId)
    if (!holding) {
      setError('Select a holding.')
      return
    }
    if (!amount || Number(amount) <= 0) {
      setError('Enter a valid amount.')
      return
    }
    addTransaction({
      accountId: holding.accountId,
      holdingId: holding.id,
      instrumentName: holding.instrumentName,
      assetClass: holding.assetClass,
      transactionType: type,
      amount: Number(amount),
      transactionDate: new Date().toISOString(),
      status: 'Completed',
      notes: notes || undefined,
    })
    show('Transaction recorded as a demo activity entry.')
    setAmount('')
    setNotes('')
    setError('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Record a Transaction" description="Adds a demo activity record. Holding totals are not automatically recalculated from this entry." size="sm">
      <div className="space-y-4">
        <div>
          <Label>Holding</Label>
          <Select value={holdingId} onChange={(e) => setHoldingId(e.target.value)}>
            {holdings.map((h) => (
              <option key={h.id} value={h.id}>{h.instrumentName}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Transaction type</Label>
          <Select value={type} onChange={(e) => setType(e.target.value as TransactionType)}>
            {TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Amount (₹)</Label>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
          <FieldError>{error}</FieldError>
        </div>
        <div>
          <Label>Notes (optional)</Label>
          <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add a note" />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Add Transaction</Button>
      </div>
    </Modal>
  )
}
