import { useNavigate } from 'react-router-dom'
import { RefreshCw, Unplug, Eye } from 'lucide-react'
import type { PlatformAccount } from '@/types'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatINR } from '@/lib/currency'
import { relativeTime } from '@/lib/date'
import { usePortfolioStore } from '@/store/portfolioStore'
import { useToast } from '@/components/ui/Toast'
import { summarize } from '@/lib/calculations'

export function AccountCard({ account, onDisconnect }: { account: PlatformAccount; onDisconnect: (account: PlatformAccount) => void }) {
  const navigate = useNavigate()
  const holdings = usePortfolioStore((s) => s.holdings.filter((h) => h.accountId === account.id))
  const syncAccount = usePortfolioStore((s) => s.syncAccount)
  const { show } = useToast()
  const summary = summarize(holdings)

  return (
    <Card>
      <CardBody className="pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold"
              style={{ backgroundColor: `color-mix(in srgb, var(--color-${account.colorToken}, var(--color-slate)) 18%, transparent)`, color: `var(--color-${account.colorToken}, var(--color-slate))` }}
            >
              {account.initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">{account.platformName}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{account.accountType}</p>
            </div>
          </div>
          <Badge tone={account.isEnabled ? 'gain' : 'neutral'}>{account.isEnabled ? 'Connected' : 'Disconnected'}</Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Holdings</p>
            <p className="text-sm font-medium">{holdings.length}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Tracked Value</p>
            <p className="text-sm font-medium num-tabular">{formatINR(summary.totalCurrentValue, { compact: true })}</p>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-[var(--color-text-muted)]">Last synced {relativeTime(account.lastSyncedAt)} · Demo Data</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" icon={<Eye size={13} />} onClick={() => navigate(`/portfolio/account/${account.id}`)}>
            View Portfolio
          </Button>
          <Button
            size="sm"
            variant="secondary"
            icon={<RefreshCw size={13} />}
            onClick={() => {
              syncAccount(account.id)
              show(`${account.platformName} demo data refreshed.`)
            }}
          >
            Sync
          </Button>
          {account.isEnabled && (
            <Button size="sm" variant="danger" icon={<Unplug size={13} />} onClick={() => onDisconnect(account)}>
              Disconnect
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  )
}
