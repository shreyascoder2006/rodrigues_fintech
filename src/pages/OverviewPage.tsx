import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, TrendingDown, TrendingUp } from 'lucide-react'
import { usePortfolioStore } from '@/store/portfolioStore'
import {
  enabledHoldings,
  allocationByAssetClass,
  allocationByAccount,
  summarize,
  topMovers,
  totalIncome,
} from '@/lib/calculations'
import { generateInsights } from '@/lib/insights'
import { PORTFOLIO_HISTORY } from '@/data/seedData'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ReturnBadge } from '@/components/ui/Badge'
import { PortfolioAreaChart } from '@/components/charts/PortfolioAreaChart'
import { DonutAllocation } from '@/components/charts/DonutAllocation'
import { AllocationBarChart } from '@/components/charts/AllocationBarChart'
import { formatINR, maskValue } from '@/lib/currency'
import { formatDate } from '@/lib/date'
import { colorForAssetClass } from '@/lib/colors'
import { assetClassToSlug } from '@/lib/navigation'
import type { PlatformId } from '@/types'

const PERIODS: Array<'1M' | '3M' | '6M' | '1Y' | 'ALL'> = ['1M', '3M', '6M', '1Y', 'ALL']

export default function OverviewPage() {
  const navigate = useNavigate()
  const { accounts, holdings, transactions, settings } = usePortfolioStore((s) => s)
  const [period, setPeriod] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('3M')

  const scoped = useMemo(() => enabledHoldings(holdings, accounts), [holdings, accounts])
  const summary = useMemo(() => summarize(scoped), [scoped])
  const allocation = useMemo(() => allocationByAssetClass(scoped), [scoped])
  const platformAllocation = useMemo(() => allocationByAccount(scoped, accounts), [scoped, accounts])
  const { gainers, losers } = useMemo(() => topMovers(scoped, 3), [scoped])
  const income = useMemo(() => totalIncome(transactions), [transactions])
  const insights = useMemo(() => generateInsights(scoped, accounts, transactions, settings.allocationTargets).slice(0, 3), [scoped, accounts, transactions, settings.allocationTargets])

  const history = PORTFOLIO_HISTORY[period]
  const todayChange = history.length >= 2 ? history[history.length - 1].value - history[history.length - 2].value : 0

  const fmt = (v: number) => (settings.showBalances ? formatINR(v) : maskValue(formatINR(v)))

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardBody className="pt-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">Total Portfolio Value</p>
                <p className="mt-1 text-3xl font-bold num-tabular text-[var(--color-text-primary)]">{fmt(summary.totalCurrentValue)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <ReturnBadge value={summary.totalReturnPercentage} />
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {fmt(summary.totalProfitLoss)} overall · {todayChange >= 0 ? '+' : ''}{fmt(todayChange)} this period
                  </span>
                </div>
              </div>
              <div className="flex gap-1 rounded-lg border border-[var(--color-border-light)] p-1">
                {PERIODS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                      period === p ? 'bg-[var(--color-emerald)] text-[#07140f]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <PortfolioAreaChart data={history} />
            </div>
          </CardBody>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardBody className="pt-5">
              <p className="text-xs text-[var(--color-text-muted)]">Total Invested</p>
              <p className="mt-1 text-xl font-semibold num-tabular">{fmt(summary.totalInvested)}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="pt-5">
              <p className="text-xs text-[var(--color-text-muted)]">Income Received (illustrative)</p>
              <p className="mt-1 text-xl font-semibold num-tabular text-[var(--color-gain)]">{fmt(income)}</p>
              <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">From dividends, distributions & interest</p>
            </CardBody>
          </Card>
          <Card interactive onClick={() => navigate('/accounts')}>
            <CardBody className="pt-5">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[var(--color-text-muted)]">Connected Accounts</p>
                <ArrowRight size={14} className="text-[var(--color-text-muted)]" />
              </div>
              <p className="mt-1 text-xl font-semibold">{accounts.filter((a) => a.isEnabled).length} / {accounts.length}</p>
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
            <button onClick={() => navigate('/portfolio')} className="text-xs font-medium text-[var(--color-emerald)] hover:underline">View all holdings</button>
          </CardHeader>
          <CardBody>
            <DonutAllocation
              data={allocation}
              getColor={(label) => colorForAssetClass(label)}
              onSliceClick={(label) => navigate(`/portfolio/asset/${assetClassToSlug(label)}`)}
            />
            <div className="mt-3 grid grid-cols-2 gap-2">
              {allocation.map((a) => (
                <button
                  key={a.label}
                  onClick={() => navigate(`/portfolio/asset/${assetClassToSlug(a.label)}`)}
                  className="flex items-center justify-between rounded-lg px-2 py-1.5 text-xs hover:bg-[var(--color-surface-raised)]"
                >
                  <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colorForAssetClass(a.label) }} />
                    {a.label}
                  </span>
                  <span className="font-medium text-[var(--color-text-primary)]">{a.percentage.toFixed(1)}%</span>
                </button>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Allocation</CardTitle>
            <button onClick={() => navigate('/accounts')} className="text-xs font-medium text-[var(--color-emerald)] hover:underline">Manage accounts</button>
          </CardHeader>
          <CardBody>
            <AllocationBarChart
              data={platformAllocation}
              onBarClick={(label) => {
                const acc = accounts.find((a) => a.platformName === label)
                if (acc) navigate(`/portfolio/account/${acc.id}`)
              }}
            />
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Top Gainers</CardTitle></CardHeader>
          <CardBody className="space-y-2">
            {gainers.map((g) => (
              <div key={g.holding.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-[var(--color-gain)]" />
                  <span className="text-sm">{g.holding.instrumentName}</span>
                </div>
                <ReturnBadge value={g.returnPct} />
              </div>
            ))}
          </CardBody>
        </Card>
        <Card>
          <CardHeader><CardTitle>Top Losers</CardTitle></CardHeader>
          <CardBody className="space-y-2">
            {losers.filter((l) => l.returnPct < 0).length === 0 && <p className="text-xs text-[var(--color-text-muted)]">No losing positions right now.</p>}
            {losers.filter((l) => l.returnPct < 0).map((l) => (
              <div key={l.holding.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown size={14} className="text-[var(--color-loss)]" />
                  <span className="text-sm">{l.holding.instrumentName}</span>
                </div>
                <ReturnBadge value={l.returnPct} />
              </div>
            ))}
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Insights</CardTitle>
            <button onClick={() => navigate('/insights')} className="text-xs font-medium text-[var(--color-emerald)] hover:underline">View all</button>
          </CardHeader>
          <CardBody className="space-y-3">
            {insights.map((i) => (
              <button key={i.id} onClick={() => navigate('/insights')} className="block w-full text-left">
                <p className="text-sm text-[var(--color-text-primary)]">{i.title}</p>
                <p className="text-xs text-[var(--color-text-muted)] line-clamp-2">{i.description}</p>
              </button>
            ))}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <button onClick={() => navigate('/transactions')} className="text-xs font-medium text-[var(--color-emerald)] hover:underline">View all transactions</button>
        </CardHeader>
        <CardBody className="space-y-0 divide-y divide-[var(--color-border)]">
          {transactions.slice(0, 5).map((t) => (
            <div key={t.id} className="flex items-center justify-between py-2.5 first:pt-0">
              <div>
                <p className="text-sm text-[var(--color-text-primary)]">{t.instrumentName}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{t.transactionType} · {formatDate(t.transactionDate)}</p>
              </div>
              <p className="num-tabular text-sm font-medium">{fmt(t.amount)}</p>
            </div>
          ))}
        </CardBody>
      </Card>

      <div className="flex justify-center">
        <Button variant="secondary" onClick={() => navigate('/portfolio')}>View Full Consolidated Portfolio</Button>
      </div>
    </div>
  )
}
