import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'neutral' | 'gain' | 'loss' | 'emerald' | 'violet' | 'blue' | 'amber' | 'rose'

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)] border-[var(--color-border-light)]',
  gain: 'bg-[var(--color-gain)]/10 text-[var(--color-gain)] border-[var(--color-gain)]/25',
  loss: 'bg-[var(--color-loss)]/10 text-[var(--color-loss)] border-[var(--color-loss)]/25',
  emerald: 'bg-[var(--color-emerald)]/10 text-[var(--color-emerald)] border-[var(--color-emerald)]/25',
  violet: 'bg-[var(--color-violet)]/10 text-[var(--color-violet)] border-[var(--color-violet)]/25',
  blue: 'bg-[var(--color-blue)]/10 text-[var(--color-blue)] border-[var(--color-blue)]/25',
  amber: 'bg-[var(--color-amber)]/10 text-[var(--color-amber)] border-[var(--color-amber)]/25',
  rose: 'bg-[var(--color-rose)]/10 text-[var(--color-rose)] border-[var(--color-rose)]/25',
}

export function Badge({ children, tone = 'neutral', className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium', toneClasses[tone], className)}>
      {children}
    </span>
  )
}

export function ReturnBadge({ value }: { value: number }) {
  const tone: Tone = value >= 0 ? 'gain' : 'loss'
  return <Badge tone={tone}>{value >= 0 ? '+' : ''}{value.toFixed(2)}%</Badge>
}
