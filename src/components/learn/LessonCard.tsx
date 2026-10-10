import { useState } from 'react'
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import type { Lesson } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { usePortfolioStore } from '@/store/portfolioStore'
import { cn } from '@/lib/cn'

export function LessonCard({ lesson }: { lesson: Lesson }) {
  const [open, setOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const completedLessonIds = usePortfolioStore((s) => s.completedLessonIds)
  const completeLesson = usePortfolioStore((s) => s.completeLesson)
  const isComplete = completedLessonIds.includes(lesson.id)

  function handleSubmitQuiz() {
    if (selectedOption === null) return
    setSubmitted(true)
    if (selectedOption === lesson.quiz.correctIndex) {
      completeLesson(lesson.id)
    }
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left">
        <div className="flex items-center gap-2.5">
          {isComplete ? <CheckCircle2 size={16} className="text-[var(--color-emerald)]" /> : <span className="h-4 w-4 rounded-full border border-[var(--color-border-light)]" />}
          <div>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">{lesson.title}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{lesson.summary}</p>
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-[var(--color-text-muted)]" /> : <ChevronDown size={16} className="text-[var(--color-text-muted)]" />}
      </button>
      {open && (
        <div className="space-y-4 border-t border-[var(--color-border)] px-4 py-4">
          <p className="text-sm text-[var(--color-text-secondary)]">{lesson.content}</p>
          <div className="rounded-lg bg-[var(--color-bg)] p-3 text-xs text-[var(--color-text-secondary)]">
            <span className="font-semibold text-[var(--color-text-primary)]">Example: </span>
            {lesson.example}
          </div>

          <div className="rounded-xl border border-[var(--color-border-light)] p-3">
            <p className="text-xs font-semibold text-[var(--color-text-primary)]">Quick check</p>
            <p className="mt-1.5 text-sm text-[var(--color-text-secondary)]">{lesson.quiz.question}</p>
            <div className="mt-2 space-y-1.5">
              {lesson.quiz.options.map((opt, idx) => {
                const isCorrect = idx === lesson.quiz.correctIndex
                const isSelected = idx === selectedOption
                return (
                  <button
                    key={opt}
                    onClick={() => !submitted && setSelectedOption(idx)}
                    className={cn(
                      'block w-full rounded-lg border px-3 py-2 text-left text-xs transition-colors',
                      submitted && isCorrect && 'border-[var(--color-emerald)] bg-[var(--color-emerald)]/10 text-[var(--color-emerald)]',
                      submitted && isSelected && !isCorrect && 'border-[var(--color-rose)] bg-[var(--color-rose)]/10 text-[var(--color-rose)]',
                      !submitted && isSelected && 'border-[var(--color-emerald)] bg-[var(--color-emerald)]/5',
                      !submitted && !isSelected && 'border-[var(--color-border-light)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)]',
                    )}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
            {!submitted ? (
              <Button size="sm" variant="primary" className="mt-3" disabled={selectedOption === null} onClick={handleSubmitQuiz}>
                Submit Answer
              </Button>
            ) : (
              <div className="mt-3 flex items-center gap-2">
                <Badge tone={selectedOption === lesson.quiz.correctIndex ? 'gain' : 'loss'}>
                  {selectedOption === lesson.quiz.correctIndex ? 'Correct!' : 'Not quite — review the explanation above.'}
                </Badge>
                {selectedOption !== lesson.quiz.correctIndex && (
                  <button
                    onClick={() => {
                      setSubmitted(false)
                      setSelectedOption(null)
                    }}
                    className="text-xs text-[var(--color-emerald)] hover:underline"
                  >
                    Try again
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
