import { useNavigate } from 'react-router-dom'
import { Drawer } from '@/components/ui/Drawer'
import { Button } from '@/components/ui/Button'
import { ReturnBadge, Badge } from '@/components/ui/Badge'
import { formatINR, formatNumber } from '@/lib/currency'
import { formatDate } from '@/lib/date'
import { usePortfolioStore } from '@/store/portfolioStore'
import type { Holding } from '@/types'

export function HoldingDetailDrawer({
  holding,
  onClose,
  onEdit,
  onDelete,
}: {
  holding: Holding | null
  onClose: () => void
  onEdit: (h: Holding) => void
  onDelete: (h: Holding) => void
}) {
  const navigate = useNavigate()
  const accounts = usePortfolioStore((s) => s.accounts)
  if (!holding) return null
  const account = accounts.find((a) => a.id === holding.accountId)
  const returnPct = holding.investedAmount > 0 ? ((holding.currentValue - holding.investedAmount) / holding.investedAmount) * 100 : 0

  return (
    <Drawer open={!!holding} onClose={onClose} title={holding.instrumentName} subtitle={holding.symbol}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="neutral">{holding.assetClass}</Badge>
        <ReturnBadge value={returnPct} />
        {holding.isManual && <Badge tone="violet">Manual</Badge>}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-[var(--color-text-muted)]">Invested amount</p>
          <p className="mt-1 text-lg font-semibold num-tabular">{formatINR(holding.investedAmount)}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--color-text-muted)]">Current value</p>
          <p className="mt-1 text-lg font-semibold num-tabular">{formatINR(holding.currentValue)}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--color-text-muted)]">Unrealized P&L</p>
          <p className={`mt-1 text-lg font-semibold num-tabular ${holding.currentValue - holding.investedAmount >= 0 ? 'text-[var(--color-gain)]' : 'text-[var(--color-loss)]'}`}>
            {formatINR(holding.currentValue - holding.investedAmount)}
          </p>
        </div>
        <div>
          <p className="text-xs text-[var(--color-text-muted)]">Quantity / Units</p>
          <p className="mt-1 text-lg font-semibold num-tabular">{formatNumber(holding.quantity)}</p>
        </div>
      </div>

      <div className="mt-5 space-y-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-sm">
        <div className="flex justify-between"><span className="text-[var(--color-text-muted)]">Platform</span><span>{account?.platformName}</span></div>
        <div className="flex justify-between"><span className="text-[var(--color-text-muted)]">Purchase date</span><span>{formatDate(holding.purchaseDate)}</span></div>
        <div className="flex justify-between"><span className="text-[var(--color-text-muted)]">Last updated</span><span>{formatDate(holding.lastUpdated)}</span></div>
        {holding.meta?.issuer && <div className="flex justify-between"><span className="text-[var(--color-text-muted)]">Issuer</span><span>{holding.meta.issuer}</span></div>}
        {holding.meta?.couponRate !== undefined && <div className="flex justify-between"><span className="text-[var(--color-text-muted)]">Coupon rate</span><span>{holding.meta.couponRate}%</span></div>}
        {holding.meta?.faceValue !== undefined && <div className="flex justify-between"><span className="text-[var(--color-text-muted)]">Face value</span><span>{formatINR(holding.meta.faceValue)}</span></div>}
        {holding.meta?.maturityDate && <div className="flex justify-between"><span className="text-[var(--color-text-muted)]">Maturity</span><span>{holding.meta.maturityDate}</span></div>}
        {holding.meta?.creditRating && <div className="flex justify-between"><span className="text-[var(--color-text-muted)]">Credit rating</span><span>{holding.meta.creditRating}</span></div>}
        {holding.meta?.interestRate !== undefined && <div className="flex justify-between"><span className="text-[var(--color-text-muted)]">Interest rate</span><span>{holding.meta.interestRate}%</span></div>}
        {holding.meta?.principal !== undefined && <div className="flex justify-between"><span className="text-[var(--color-text-muted)]">Principal</span><span>{formatINR(holding.meta.principal)}</span></div>}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          variant="secondary"
          onClick={() => {
            navigate(`/portfolio/account/${holding.accountId}`)
            onClose()
          }}
        >
          View {account?.platformName}
        </Button>
        {holding.isManual && (
          <>
            <Button variant="secondary" onClick={() => onEdit(holding)}>Edit</Button>
            <Button variant="danger" onClick={() => onDelete(holding)}>Delete</Button>
          </>
        )}
      </div>
    </Drawer>
  )
}
