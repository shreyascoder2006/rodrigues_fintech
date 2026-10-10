import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { usePortfolioStore } from '@/store/portfolioStore'
import {
  enabledHoldings,
  allocationByAssetClass,
  allocationByAccount,
  concentrationByInstrument,
  topMovers,
  incomeBySource,
  summarize,
} from '@/lib/calculations'
import { PORTFOLIO_HISTORY } from '@/data/seedData'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { ReturnBadge } from '@/components/ui/Badge'
import { PortfolioAreaChart } from '@/components/charts/PortfolioAreaChart'
import { AllocationBarChart } from '@/components/charts/AllocationBarChart'
import { formatINR } from '@/lib/currency'

const PERIODS: Array<'1M' | '3M' | '6M' | '1Y' | 'ALL'> = ['1M', '3M', '6M', '1Y', 'ALL']

export default function AnalyticsPage() {
  const { accounts, holdings, transactions } = usePortfolioStore((s) => s)
  const [period, setPeriod] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('6M')

  const scoped = useMemo(() => enabledHoldings(holdings, accounts), [holdings, accounts])
  const summary = useMemo(() => summarize(scoped), [scoped])
  const assetAllocation = useMemo(() => allocationByAssetClass(scoped), [scoped])
  const platformAllocation = useMemo(() => allocationByAccount(scoped, accounts), [scoped, accounts])
  const concentration = useMemo(() => concentrationByInstrument(scoped, 6), [scoped])
  const { gainers, losers } = useMemo(() => topMovers(scoped, 5), [scoped])
  const income = useMemo(() => incomeBySource(transactions), [transactions])

  const investedVsCurrent = assetAllocation.map((a) => {
    const invested = scoped.filter((h) => h.assetClass === a.label).reduce((s, h) => s + h.investedAmount, 0)
    return { label: a.label, invested, current: a.value }
  })

  const allMovers = [...gainers, ...losers.filter((l) => !gainers.some((g) => g.holding.id === l.holding.id))]

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Performance & Analytics</h1>
        <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">Returns, allocation shifts, and concentration across your tracked portfolio.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Value Trend</CardTitle>
          <div className="flex gap-1 rounded-lg border border-[var(--color-border-light)] p-1">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium ${period === p ? 'bg-[var(--color-emerald)] text-[#07140f]' : 'text-[var(--color-text-muted)]'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardBody>
          <PortfolioAreaChart data={PORTFOLIO_HISTORY[period]} />
          <p className="mt-2 text-[11px] text-[var(--color-text-muted)]">Illustrative time series derived from current holdings — not a verified historical record.</p>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Invested vs Current Value by Asset Class</CardTitle></CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={investedVsCurrent}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-border-light)', borderRadius: 10, fontSize: 12 }}
                  formatter={(v) => formatINR(Number(v ?? 0), { compact: true })}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="invested" name="Invested" fill="var(--color-slate)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="current" name="Current Value" fill="var(--color-emerald)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle>Platform-Level Value</CardTitle></CardHeader>
          <CardBody>
            <AllocationBarChart data={platformAllocation} height={240} />
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Portfolio Concentration (Top Holdings)</CardTitle></CardHeader>
          <CardBody className="space-y-2.5">
            {concentration.map((c) => (
              <div key={c.label} className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">{c.label}</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[var(--color-border)]">
                    <div className="h-full rounded-full bg-[var(--color-violet)]" style={{ width: `${Math.min(c.percentage, 100)}%` }} />
                  </div>
                  <span className="w-12 text-right num-tabular text-xs font-medium">{c.percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
            {summary.totalCurrentValue > 0 && concentration[0] && concentration[0].percentage > 25 && (
              <p className="mt-2 text-xs text-[var(--color-amber)]">Your largest holding represents a significant share of the portfolio — consider your concentration risk.</p>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle>Income by Source</CardTitle></CardHeader>
          <CardBody className="space-y-2.5">
            {income.length === 0 && <p className="text-xs text-[var(--color-text-muted)]">No income transactions recorded yet.</p>}
            {income.map((i) => (
              <div key={i.label} className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">{i.label}</span>
                <span className="num-tabular font-medium">{formatINR(i.value)}</span>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Return Contribution by Holding</CardTitle></CardHeader>
        <CardBody className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-left text-xs text-[var(--color-text-muted)]">
                <th className="py-2 font-medium">Instrument</th>
                <th className="py-2 font-medium text-right">Absolute P&L</th>
                <th className="py-2 font-medium text-right">Return</th>
              </tr>
            </thead>
            <tbody>
              {allMovers.map((m) => (
                <tr key={m.holding.id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="py-2.5">{m.holding.instrumentName}</td>
                  <td className={`py-2.5 text-right num-tabular ${m.absolute >= 0 ? 'text-[var(--color-gain)]' : 'text-[var(--color-loss)]'}`}>{formatINR(m.absolute)}</td>
                  <td className="py-2.5 text-right"><ReturnBadge value={m.returnPct} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  )
}
