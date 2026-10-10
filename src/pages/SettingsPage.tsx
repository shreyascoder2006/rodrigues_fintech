import { useState } from 'react'
import { RotateCcw, ShieldCheck } from 'lucide-react'
import { usePortfolioStore } from '@/store/portfolioStore'
import { Card, CardBody } from '@/components/ui/Card'
import { Switch } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'
import { DEMO_USER } from '@/data/seedData'

export default function SettingsPage() {
  const { settings, toggleShowBalances, setNotificationsEnabled, setTheme, resetDemoData } = usePortfolioStore((s) => s)
  const [resetOpen, setResetOpen] = useState(false)
  const { show } = useToast()

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Settings</h1>
        <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">Manage preferences and demo data for this prototype.</p>
      </div>

      <Card>
        <CardBody className="pt-5 space-y-4">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Profile</h3>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-violet)]/20 text-base font-semibold text-[var(--color-violet)]">
              {DEMO_USER.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">{DEMO_USER.name}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{DEMO_USER.email}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="pt-5 space-y-4">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Preferences</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-primary)]">Show portfolio values</p>
              <p className="text-xs text-[var(--color-text-muted)]">Toggle to mask all amounts across the app.</p>
            </div>
            <Switch checked={settings.showBalances} onChange={toggleShowBalances} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-primary)]">Notification preferences</p>
              <p className="text-xs text-[var(--color-text-muted)]">Receive insight & alert badges in the top bar.</p>
            </div>
            <Switch checked={settings.notificationsEnabled} onChange={setNotificationsEnabled} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-primary)]">Dark theme</p>
              <p className="text-xs text-[var(--color-text-muted)]">FolioOne's premium dark interface (recommended).</p>
            </div>
            <Switch checked={settings.theme === 'dark'} onChange={(v) => setTheme(v ? 'dark' : 'light')} />
          </div>
          <div>
            <p className="text-sm text-[var(--color-text-primary)]">Currency</p>
            <p className="text-xs text-[var(--color-text-muted)]">Indian Rupee (₹) — lakh / crore formatting. Only currency supported in this prototype.</p>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="pt-5 space-y-3">
          <div className="flex items-start gap-2.5">
            <ShieldCheck size={16} className="mt-0.5 text-[var(--color-emerald)]" />
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Privacy & Demo Mode</h3>
              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                FolioOne is a frontend-only prototype. All holdings, platforms, and transactions are simulated and stored only in your browser's local storage —
                nothing is sent to a server, and no real brokerage, banking, or depository accounts are ever connected.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="pt-5 space-y-3">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Demo Data</h3>
          <p className="text-xs text-[var(--color-text-secondary)]">Restore the original seeded sample portfolio, accounts, transactions, and goals. Any manual changes you've made will be cleared.</p>
          <Button variant="danger" icon={<RotateCcw size={14} />} onClick={() => setResetOpen(true)}>Reset Demo Data</Button>
        </CardBody>
      </Card>

      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={() => {
          resetDemoData()
          show('Demo data has been reset to the original sample portfolio.', 'info')
        }}
        title="Reset demo data?"
        description="This restores the original sample portfolio and discards any holdings, goals, or watchlist changes you've made in this browser."
        confirmLabel="Reset"
        danger
      />
    </div>
  )
}
