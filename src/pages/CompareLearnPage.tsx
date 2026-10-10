import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, X } from 'lucide-react'
import { ASSET_CLASSES } from '@/lib/navigation'
import { COMPARISON_DIMENSIONS, COMPARISON_PROFILES } from '@/lib/comparisonProfiles'
import { EXPLORE_INSTRUMENTS, GLOSSARY, LESSONS } from '@/data/seedData'
import { Select } from '@/components/ui/Field'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LessonCard } from '@/components/learn/LessonCard'
import { usePortfolioStore } from '@/store/portfolioStore'
import type { AssetClass } from '@/types'

const COMPARABLE_CLASSES = ASSET_CLASSES.filter((a) => a !== 'Other')

export default function CompareLearnPage() {
  const [searchParams] = useSearchParams()
  const presetInstrument = EXPLORE_INSTRUMENTS.find((i) => i.id === searchParams.get('a'))

  const [slots, setSlots] = useState<AssetClass[]>([presetInstrument?.category ?? 'Stocks', 'Bonds'])
  const [glossaryQuery, setGlossaryQuery] = useState('')
  const completedLessonIds = usePortfolioStore((s) => s.completedLessonIds)

  const filteredGlossary = useMemo(
    () => GLOSSARY.filter((g) => g.term.toLowerCase().includes(glossaryQuery.toLowerCase())),
    [glossaryQuery],
  )

  function updateSlot(index: number, value: AssetClass) {
    setSlots((s) => s.map((v, i) => (i === index ? value : v)))
  }

  function addSlot() {
    if (slots.length >= 3) return
    const next = COMPARABLE_CLASSES.find((c) => !slots.includes(c)) ?? COMPARABLE_CLASSES[0]
    setSlots((s) => [...s, next])
  }

  function removeSlot(index: number) {
    if (slots.length <= 2) return
    setSlots((s) => s.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Compare & Learn</h1>
        <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">Compare investment categories side by side, and learn the fundamentals at your own pace.</p>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Side-by-Side Comparison</h2>
          {slots.length < 3 && <Button size="sm" variant="secondary" icon={<Plus size={13} />} onClick={addSlot}>Add a third category</Button>}
        </div>

        <div className={`grid grid-cols-1 gap-3 ${slots.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
          {slots.map((slot, i) => (
            <div key={i} className="flex items-center gap-2">
              <Select value={slot} onChange={(e) => updateSlot(i, e.target.value as AssetClass)} className="flex-1">
                {COMPARABLE_CLASSES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
              {slots.length > 2 && (
                <button onClick={() => removeSlot(i)} className="rounded-lg p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)]">
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] text-left text-xs text-[var(--color-text-muted)]">
                <th className="w-44 px-4 py-3 font-medium">Dimension</th>
                {slots.map((s, i) => (
                  <th key={i} className="px-4 py-3 font-medium text-[var(--color-text-primary)]">{s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_DIMENSIONS.map((dim) => (
                <tr key={dim.key} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="px-4 py-3 align-top text-xs font-medium text-[var(--color-text-muted)]">{dim.label}</td>
                  {slots.map((s, i) => (
                    <td key={i} className="px-4 py-3 align-top text-[var(--color-text-secondary)]">{COMPARISON_PROFILES[s][dim.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-[var(--color-text-muted)]">Comparisons are general educational information, not personalized advice. Always consider your own risk tolerance and goals.</p>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Short Lessons</h2>
          <span className="text-xs text-[var(--color-text-muted)]">{completedLessonIds.length} / {LESSONS.length} completed</span>
        </div>
        <div className="flex flex-col gap-2.5">
          {LESSONS.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Glossary</h2>
        <input
          value={glossaryQuery}
          onChange={(e) => setGlossaryQuery(e.target.value)}
          placeholder="Search a term..."
          className="w-full max-w-sm rounded-lg border border-[var(--color-border-light)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-emerald)]"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGlossary.map((g) => (
            <Card key={g.term}>
              <CardBody className="pt-4">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">{g.term}</p>
                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{g.definition}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
