import type { ReactNode } from 'react'

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--color-border-light)] px-6 py-14 text-center">
      {icon && <div className="text-[var(--color-text-muted)]">{icon}</div>}
      <div>
        <p className="text-sm font-medium text-[var(--color-text-primary)]">{title}</p>
        {description && <p className="mt-1 max-w-sm text-xs text-[var(--color-text-secondary)]">{description}</p>}
      </div>
      {action}
    </div>
  )
}
