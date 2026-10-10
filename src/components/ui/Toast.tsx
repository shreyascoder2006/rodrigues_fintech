import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/cn'

type ToastTone = 'success' | 'info' | 'warning'
interface ToastItem { id: string; message: string; tone: ToastTone }

interface ToastContextValue {
  show: (message: string, tone?: ToastTone) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const toneIcon: Record<ToastTone, ReactNode> = {
  success: <CheckCircle2 size={16} className="text-[var(--color-emerald)]" />,
  info: <Info size={16} className="text-[var(--color-blue)]" />,
  warning: <AlertTriangle size={16} className="text-[var(--color-amber)]" />,
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const show = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    setToasts((t) => [...t, { id, message, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800)
  }, [])

  const dismiss = (id: string) => setToasts((t) => t.filter((x) => x.id !== id))

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {createPortal(
        <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={cn(
                'flex items-center gap-2.5 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-surface-raised)] px-4 py-3 text-sm text-[var(--color-text-primary)] shadow-xl animate-fade-in min-w-[260px] max-w-sm',
              )}
            >
              {toneIcon[t.tone]}
              <span className="flex-1">{t.message}</span>
              <button onClick={() => dismiss(t.id)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
