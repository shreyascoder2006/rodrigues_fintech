import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Wallet, Compass, Receipt, Menu } from 'lucide-react'
import { cn } from '@/lib/cn'

export function MobileNav({ onMenu }: { onMenu: () => void }) {
  const items = [
    { to: '/', icon: LayoutDashboard, label: 'Overview', end: true },
    { to: '/portfolio', icon: Wallet, label: 'Portfolio' },
    { to: '/explore', icon: Compass, label: 'Explore' },
    { to: '/transactions', icon: Receipt, label: 'Activity' },
  ]
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 md:hidden">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[10px] font-medium',
              isActive ? 'text-[var(--color-emerald)]' : 'text-[var(--color-text-muted)]',
            )
          }
        >
          <item.icon size={18} />
          {item.label}
        </NavLink>
      ))}
      <button onClick={onMenu} className="flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[10px] font-medium text-[var(--color-text-muted)]">
        <Menu size={18} />
        More
      </button>
    </nav>
  )
}
