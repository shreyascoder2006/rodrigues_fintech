import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Wallet,
  LineChart,
  Receipt,
  Compass,
  Scale,
  Target,
  Bell,
  FileText,
  Link2,
  Settings,
  ChevronDown,
  ChevronRight,
  Star,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePortfolioStore } from '@/store/portfolioStore'
import { ASSET_CLASSES, assetClassToSlug } from '@/lib/navigation'
import { colorForAssetClass } from '@/lib/colors'

function NavItem({ to, icon, label, end, collapsed }: { to: string; icon: React.ReactNode; label: string; end?: boolean; collapsed?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-[var(--color-emerald)]/12 text-[var(--color-emerald)]'
            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]',
        )
      }
      title={collapsed ? label : undefined}
    >
      <span className="flex-shrink-0">{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  )
}

function SubLink({ to, label, dot }: { to: string; label: string; dot?: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[13px] transition-colors',
          isActive
            ? 'bg-[var(--color-surface-raised)] text-[var(--color-text-primary)]'
            : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]',
        )
      }
    >
      {dot && <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ backgroundColor: dot }} />}
      <span className="truncate">{label}</span>
    </NavLink>
  )
}

function Section({
  icon,
  label,
  defaultOpen,
  children,
  collapsed,
}: {
  icon: React.ReactNode
  label: string
  defaultOpen?: boolean
  children: React.ReactNode
  collapsed?: boolean
}) {
  const [open, setOpen] = useState(!!defaultOpen)
  if (collapsed) return null
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]"
      >
        <span className="flex items-center gap-3">
          {icon}
          {label}
        </span>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {open && <div className="ml-3 mt-0.5 flex flex-col gap-0.5 border-l border-[var(--color-border)] pl-3">{children}</div>}
    </div>
  )
}

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const accounts = usePortfolioStore((s) => s.accounts)

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-200',
        collapsed ? 'w-[72px]' : 'w-[264px]',
      )}
    >
      <div className={cn('flex items-center gap-2.5 px-4 py-5', collapsed && 'justify-center px-0')}>
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--color-emerald)] text-sm font-bold text-[#07140f]">F1</div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold leading-tight text-[var(--color-text-primary)]">FolioOne</p>
            <p className="text-[10px] leading-tight text-[var(--color-text-muted)]">Your Wealth, Unified.</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <div className="flex flex-col gap-0.5">
          <NavItem to="/" end icon={<LayoutDashboard size={17} />} label="Overview" collapsed={collapsed} />

          <Section icon={<Wallet size={17} />} label="My Portfolio" defaultOpen collapsed={collapsed}>
            <SubLink to="/portfolio" label="All Platforms" />
            {accounts.map((a) => (
              <SubLink key={a.id} to={`/portfolio/account/${a.id}`} label={a.platformName} />
            ))}
          </Section>

          <Section icon={<Layers size={17} />} label="Asset Classes" collapsed={collapsed}>
            {ASSET_CLASSES.filter((a) => a !== 'Other').map((ac) => (
              <SubLink key={ac} to={`/portfolio/asset/${assetClassToSlug(ac)}`} label={ac} dot={colorForAssetClass(ac)} />
            ))}
          </Section>

          {collapsed && <NavItem to="/portfolio" icon={<Wallet size={17} />} label="My Portfolio" collapsed />}

          <NavItem to="/analytics" icon={<LineChart size={17} />} label="Performance & Analytics" collapsed={collapsed} />
          <NavItem to="/transactions" icon={<Receipt size={17} />} label="Transactions" collapsed={collapsed} />
          <NavItem to="/explore" icon={<Compass size={17} />} label="Explore Investments" collapsed={collapsed} />
          <NavItem to="/watchlist" icon={<Star size={17} />} label="Watchlist" collapsed={collapsed} />
          <NavItem to="/compare" icon={<Scale size={17} />} label="Compare & Learn" collapsed={collapsed} />
          <NavItem to="/goals" icon={<Target size={17} />} label="Goals & Planner" collapsed={collapsed} />
          <NavItem to="/insights" icon={<Bell size={17} />} label="Insights & Alerts" collapsed={collapsed} />
          <NavItem to="/reports" icon={<FileText size={17} />} label="Reports & Tax" collapsed={collapsed} />
          <NavItem to="/accounts" icon={<Link2 size={17} />} label="Linked Accounts" collapsed={collapsed} />
          <NavItem to="/settings" icon={<Settings size={17} />} label="Settings" collapsed={collapsed} />
        </div>
      </nav>

      <div className="border-t border-[var(--color-border)] p-3">
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]"
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          {!collapsed && 'Collapse'}
        </button>
        {!collapsed && <p className="mt-2 text-center text-[10px] text-[var(--color-text-muted)]">Demo Mode — Sample Data</p>}
      </div>
    </aside>
  )
}
