import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Scale, Star, BookOpen } from 'lucide-react'
import { EXPLORE_INSTRUMENTS } from '@/data/seedData'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge, ReturnBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PortfolioAreaChart } from '@/components/charts/PortfolioAreaChart'
import { formatINR } from '@/lib/currency'
import { colorForAssetClass } from '@/lib/colors'
import { usePortfolioStore } from '@/store/portfolioStore'
import { useToast } from '@/components/ui/Toast'

export default function InvestmentDetailPage() {
  const { instrumentId } = useParams<{ instrumentId: string }>()
  const navigate = useNavigate()
  const instrument = EXPLORE_INSTRUMENTS.find((i) => i.id === instrumentId)
  const watchlist = usePortfolioStore((s) => s.watchlist)
  const addWatchlistItem = usePortfolioStore((s) => s.addWatchlistItem)
  const removeWatchlistItem = usePortfolioStore((s) => s.removeWatchlistItem)
  const { show } = useToast()

  if (!instrument) return <Navigate to="/explore" replace />

  const isWatched = watchlist.some((w) => w.instrumentId === instrument.id)
  const color = colorForAssetClass(instrument.category)

  return (
    <div className="flex flex-col gap-5">
      <button onClick={() => navigate('/explore')} className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
        <ArrowLeft size={14} /> Back to Explore
      </button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[var(--color-text-primary)]">{instrument.name}</h1>
            <Badge tone="neutral">{instrument.category}</Badge>
          </div>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{instrument.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={<Star size={15} fill={isWatched ? 'currentColor' : 'none'} className={isWatched ? 'text-[var(--color-amber)]' : ''} />}
            onClick={() => {
              if (isWatched) {
                removeWatchlistItem(instrument.id)
                show('Removed from watchlist.', 'info')
              } else {
                addWatchlistItem({ instrumentId: instrument.id, instrumentName: instrument.name, assetClass: instrument.category, illustrativePrice: instrument.illustrativePrice })
                show('Added to watchlist.')
              }
            }}
          >
            {isWatched ? 'Watchlisted' : 'Add to Watchlist'}
          </Button>
          <Button variant="secondary" icon={<Scale size={15} />} onClick={() => navigate(`/compare?a=${instrument.id}`)}>Compare</Button>
          <Button variant="primary" icon={<BookOpen size={15} />} onClick={() => navigate('/compare')}>Learn How This Works</Button>
        </div>
      </div>

      <Card>
        <CardBody className="pt-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Illustrative Price / NAV</p>
              <p className="mt-1 text-2xl font-bold num-tabular">{formatINR(instrument.illustrativePrice)}</p>
            </div>
            <ReturnBadge value={instrument.change1y} />
          </div>
          <div className="mt-4">
            <PortfolioAreaChart data={instrument.history} color={color} height={220} />
          </div>
          <p className="mt-2 text-[11px] text-[var(--color-text-muted)]">Illustrative historical performance — for educational purposes only, not live market data.</p>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardBody className="pt-5">
            <h3 className="text-sm font-semibold">How it works</h3>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{instrument.summary}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="pt-5">
            <h3 className="text-sm font-semibold">Key characteristics</h3>
            <div className="mt-3 space-y-2 text-sm">
              {Object.entries(instrument.details).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <span className="text-[var(--color-text-muted)]">{k}</span>
                  <span className="text-right">{v}</span>
                </div>
              ))}
              <div className="flex justify-between gap-3"><span className="text-[var(--color-text-muted)]">Risk level</span><span>{instrument.risk}</span></div>
              <div className="flex justify-between gap-3"><span className="text-[var(--color-text-muted)]">Liquidity</span><span>{instrument.liquidity}</span></div>
              <div className="flex justify-between gap-3"><span className="text-[var(--color-text-muted)]">Suggested horizon</span><span>{instrument.horizon}</span></div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardBody className="pt-5">
            <h3 className="text-sm font-semibold text-[var(--color-gain)]">Advantages</h3>
            <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-secondary)]">
              {instrument.pros.map((p) => (
                <li key={p} className="flex gap-2"><span className="text-[var(--color-gain)]">+</span>{p}</li>
              ))}
            </ul>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="pt-5">
            <h3 className="text-sm font-semibold text-[var(--color-loss)]">Risk factors & trade-offs</h3>
            <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-secondary)]">
              {instrument.cons.map((c) => (
                <li key={c} className="flex gap-2"><span className="text-[var(--color-loss)]">−</span>{c}</li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <p className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-xs text-[var(--color-text-muted)]">
        This is educational information for a demo prototype, not personalized investment advice. Suggested horizons and risk ratings are general guidance, not a recommendation to buy or sell.
      </p>
    </div>
  )
}
