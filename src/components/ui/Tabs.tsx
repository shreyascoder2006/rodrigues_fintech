import { cn } from '@/lib/cn'

interface TabsProps<T extends string> {
  tabs: { value: T; label: string; count?: number }[]
  active: T
  onChange: (value: T) => void
  className?: string
}

export function Tabs<T extends string>({ tabs, active, onChange, className }: TabsProps<T>) {
  return (
    <div className={cn('flex gap-1 overflow-x-auto rounded-xl bg-[var(--color-surface)] p-1 border border-[var(--color-border)]', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            'flex-shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap',
            active === tab.value
              ? 'bg-[var(--color-emerald)] text-[#07140f]'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]',
          )}
        >
          {tab.label}
          {tab.count !== undefined && <span className="ml-1.5 opacity-70">{tab.count}</span>}
        </button>
      ))}
    </div>
  )
}
