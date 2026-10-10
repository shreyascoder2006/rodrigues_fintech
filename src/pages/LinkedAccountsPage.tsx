import { useState } from 'react'
import { Plus, Upload } from 'lucide-react'
import { usePortfolioStore } from '@/store/portfolioStore'
import { AccountCard } from '@/components/accounts/AccountCard'
import { ConnectAccountModal } from '@/components/accounts/ConnectAccountModal'
import { CsvImportModal } from '@/components/accounts/CsvImportModal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import type { PlatformAccount } from '@/types'

export default function LinkedAccountsPage() {
  const accounts = usePortfolioStore((s) => s.accounts)
  const disconnectAccount = usePortfolioStore((s) => s.disconnectAccount)
  const [connectOpen, setConnectOpen] = useState(false)
  const [csvOpen, setCsvOpen] = useState(false)
  const [disconnectTarget, setDisconnectTarget] = useState<PlatformAccount | null>(null)
  const { show } = useToast()

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Linked Accounts</h1>
          <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">Manage your simulated platform connections and manually tracked investments.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={<Upload size={15} />} onClick={() => setCsvOpen(true)}>Import CSV</Button>
          <Button variant="primary" icon={<Plus size={15} />} onClick={() => setConnectOpen(true)}>Connect Account</Button>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--color-amber)]/30 bg-[var(--color-amber)]/5 px-4 py-2.5 text-xs text-[var(--color-amber)]">
        Demo Mode — Sample Data. No real brokerage, bank, or depository accounts are connected by this prototype.
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map((a) => (
          <AccountCard key={a.id} account={a} onDisconnect={setDisconnectTarget} />
        ))}
      </div>

      <ConnectAccountModal open={connectOpen} onClose={() => setConnectOpen(false)} />
      <CsvImportModal open={csvOpen} onClose={() => setCsvOpen(false)} />

      <ConfirmDialog
        open={!!disconnectTarget}
        onClose={() => setDisconnectTarget(null)}
        onConfirm={() => {
          if (disconnectTarget) {
            disconnectAccount(disconnectTarget.id)
            show(`${disconnectTarget.platformName} disconnected. Its holdings are excluded from consolidated totals.`, 'info')
          }
        }}
        title="Disconnect account"
        description={`Disconnecting ${disconnectTarget?.platformName} will exclude its holdings from your consolidated portfolio totals. You can reconnect it anytime.`}
        confirmLabel="Disconnect"
        danger
      />
    </div>
  )
}
