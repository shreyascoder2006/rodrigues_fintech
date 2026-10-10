import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, Eye, EyeOff, LogOut, Settings as SettingsIcon, User } from 'lucide-react'
import { usePortfolioStore } from '@/store/portfolioStore'
import { generateInsights } from '@/lib/insights'
import { DEMO_USER } from '@/data/seedData'
import { relativeTime } from '@/lib/date'
import { GlobalSearch } from '@/components/layout/GlobalSearch'

export function Topbar() {
  const navigate = useNavigate()
  const { accounts, holdings, transactions, settings, toggleShowBalances, dismissedInsightIds, readInsightIds } = usePortfolioStore((s) => s)
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const lastSynced = useMemo(() => {
    const times = accounts.map((a) => new Date(a.lastSyncedAt).getTime())
    return new Date(Math.max(...times)).toISOString()
  }, [accounts])

  const insights = useMemo(
    () => generateInsights(holdings, accounts, transactions, settings.allocationTargets).filter((i) => !dismissedInsightIds.includes(i.id)),
    [holdings, accounts, transactions, settings.allocationTargets, dismissedInsightIds],
  )
  const unread = insights.filter((i) => !readInsightIds.includes(i.id))

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <header className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3">
      <div>
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">{greeting}, {DEMO_USER.name}</p>
        <p className="text-[11px] text-[var(--color-text-muted)]">Last synced {relativeTime(lastSynced)}</p>
      </div>

      <div className="hidden flex-1 justify-center md:flex">
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleShowBalances}
          title={settings.showBalances ? 'Hide balances' : 'Show balances'}
          className="rounded-lg p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]"
        >
          {settings.showBalances ? <Eye size={17} /> : <EyeOff size={17} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative rounded-lg p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]"
          >
            <Bell size={17} />
            {unread.length > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-rose)] text-[9px] font-bold text-white">
                {unread.length}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full z-30 mt-2 w-80 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-surface-raised)] shadow-xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">Insights & Alerts</p>
                <span className="text-xs text-[var(--color-text-muted)]">{unread.length} new</span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {insights.slice(0, 5).map((i) => (
                  <div key={i.id} className="border-b border-[var(--color-border)] px-4 py-3 last:border-0">
                    <p className="text-sm text-[var(--color-text-primary)]">{i.title}</p>
                    <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">{i.description}</p>
                  </div>
                ))}
                {insights.length === 0 && <p className="px-4 py-6 text-center text-xs text-[var(--color-text-muted)]">No alerts right now.</p>}
              </div>
              <button
                onClick={() => {
                  navigate('/insights')
                  setNotifOpen(false)
                }}
                className="w-full rounded-b-xl px-4 py-2.5 text-center text-xs font-medium text-[var(--color-emerald)] hover:bg-[var(--color-surface)]"
              >
                View all insights
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[var(--color-surface-raised)]"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-violet)]/20 text-xs font-semibold text-[var(--color-violet)]">
              {DEMO_USER.name.charAt(0)}
            </div>
            <ChevronDown size={14} className="text-[var(--color-text-muted)]" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-full z-30 mt-2 w-56 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-surface-raised)] py-1.5 shadow-xl animate-fade-in">
              <div className="border-b border-[var(--color-border)] px-4 py-3">
                <p className="text-sm font-medium text-[var(--color-text-primary)]">{DEMO_USER.name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{DEMO_USER.email}</p>
              </div>
              <button
                onClick={() => {
                  navigate('/settings')
                  setProfileOpen(false)
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]"
              >
                <SettingsIcon size={15} /> Settings
              </button>
              <button
                onClick={() => {
                  navigate('/')
                  setProfileOpen(false)
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]"
              >
                <User size={15} /> Overview
              </button>
              <div className="my-1 border-t border-[var(--color-border)]" />
              <button className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-[var(--color-text-muted)] opacity-60 cursor-not-allowed" disabled>
                <LogOut size={15} /> Sign out (demo)
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
