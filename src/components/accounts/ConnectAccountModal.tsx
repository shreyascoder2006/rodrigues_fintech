import { useState } from 'react'
import { ShieldCheck, CheckCircle2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { usePortfolioStore } from '@/store/portfolioStore'
import { CONNECTABLE_CATALOG } from '@/data/seedData'
import { useToast } from '@/components/ui/Toast'

export function ConnectAccountModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [step, setStep] = useState<'select' | 'confirm' | 'success'>('select')
  const connectNewAccount = usePortfolioStore((s) => s.connectNewAccount)
  const accounts = usePortfolioStore((s) => s.accounts)
  const { show } = useToast()

  const linkedIds = new Set(accounts.map((a) => a.id))
  const options = CONNECTABLE_CATALOG.filter((c) => !linkedIds.has(c.id) || !accounts.find((a) => a.id === c.id)?.isEnabled)
  const selected = CONNECTABLE_CATALOG.find((c) => c.id === selectedId)

  function reset() {
    setSelectedId(null)
    setStep('select')
  }

  function handleClose() {
    reset()
    onClose()
  }

  function handleConnect() {
    if (!selectedId) return
    connectNewAccount(selectedId)
    setStep('success')
    show('Demo account connected successfully.')
  }

  return (
    <Modal open={open} onClose={handleClose} title="Connect Account" description="This prototype simulates platform connections. No real brokerage credentials are ever required." size="md">
      {step === 'select' && (
        <div className="space-y-3">
          {options.length === 0 && (
            <p className="rounded-xl border border-dashed border-[var(--color-border-light)] p-4 text-center text-sm text-[var(--color-text-muted)]">
              All demo platforms in the catalog are already connected. You can still add individual investments manually from any portfolio view.
            </p>
          )}
          {options.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
                selectedId === c.id ? 'border-[var(--color-emerald)] bg-[var(--color-emerald)]/5' : 'border-[var(--color-border-light)] hover:bg-[var(--color-surface-raised)]'
              }`}
            >
              <div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">{c.platformName}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{c.accountType}</p>
              </div>
              <Badge tone="neutral">{c.category}</Badge>
            </button>
          ))}
          <div className="mt-5 flex items-start gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-xs text-[var(--color-text-secondary)]">
            <ShieldCheck size={16} className="mt-0.5 flex-shrink-0 text-[var(--color-emerald)]" />
            <span>No passwords, OTPs, or brokerage credentials are collected. This connects a simulated demo account with illustrative sample holdings only.</span>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={handleClose}>Cancel</Button>
            <Button variant="primary" disabled={!selectedId} onClick={() => setStep('confirm')}>Continue</Button>
          </div>
        </div>
      )}

      {step === 'confirm' && selected && (
        <div className="space-y-4">
          <p className="text-sm text-[var(--color-text-secondary)]">
            You're about to connect a <strong className="text-[var(--color-text-primary)]">simulated demo account</strong> for{' '}
            <strong className="text-[var(--color-text-primary)]">{selected.platformName}</strong>. This will add {selected.sampleHoldings.length} sample holding
            {selected.sampleHoldings.length > 1 ? 's' : ''} to your consolidated portfolio.
          </p>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-xs text-[var(--color-text-secondary)]">
            This prototype uses simulated connections and does not connect to any real financial account.
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setStep('select')}>Back</Button>
            <Button variant="primary" onClick={handleConnect}>Connect Demo Account</Button>
          </div>
        </div>
      )}

      {step === 'success' && selected && (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <CheckCircle2 size={40} className="text-[var(--color-emerald)]" />
          <p className="text-sm font-medium text-[var(--color-text-primary)]">{selected.platformName} connected</p>
          <p className="max-w-xs text-xs text-[var(--color-text-secondary)]">Your consolidated portfolio has been updated with its sample holdings.</p>
          <Button variant="primary" onClick={handleClose}>Done</Button>
        </div>
      )}
    </Modal>
  )
}
