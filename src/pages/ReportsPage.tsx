import { useMemo, useState } from 'react'
import { Download, Printer } from 'lucide-react'
import { usePortfolioStore } from '@/store/portfolioStore'
import { enabledHoldings, allocationByAssetClass, allocationByAccount, summarize, filterByAccount, totalIncome } from '@/lib/calculations'
import { Tabs } from '@/components/ui/Tabs'
import { Select } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { formatINR } from '@/lib/currency'
import { formatDate } from '@/lib/date'
import { downloadCsv } from '@/lib/csv'
import type { PlatformId } from '@/types'

type ReportType = 'consolidated' | 'holdings' | 'platform' | 'allocation' | 'transactions' | 'income' | 'gains'

const REPORT_TABS: { value: ReportType; label: string }[] = [
  { value: 'consolidated', label: 'Consolidated' },
  { value: 'holdings', label: 'Holdings' },
  { value: 'platform', label: 'Platform-wise' },
  { value: 'allocation', label: 'Asset Allocation' },
  { value: 'transactions', label: 'Transactions' },
  { value: 'income', label: 'Income Summary' },
  { value: 'gains', label: 'Gains Summary' },
]

export default function ReportsPage() {
  const { accounts, holdings, transactions } = usePortfolioStore((s) => s)
  const [reportType, setReportType] = useState<ReportType>('consolidated')
  const [accountFilter, setAccountFilter] = useState<PlatformId | 'all'>('all')

  const scoped = useMemo(() => filterByAccount(enabledHoldings(holdings, accounts), accountFilter), [holdings, accounts, accountFilter])
  const summary = useMemo(() => summarize(scoped), [scoped])
  const assetAllocation = useMemo(() => allocationByAssetClass(scoped), [scoped])
  const platformAllocation = useMemo(() => allocationByAccount(scoped, accounts), [scoped, accounts])
  const income = useMemo(() => totalIncome(transactions), [transactions])
  const accountName = (id: string) => accounts.find((a) => a.id === id)?.platformName ?? id

  function handleExport() {
    if (reportType === 'holdings') {
      downloadCsv('folioone-holdings-report.csv', scoped.map((h) => ({
        instrument: h.instrumentName, assetClass: h.assetClass, platform: accountName(h.accountId),
        invested: h.investedAmount, currentValue: h.currentValue, pnl: h.currentValue - h.investedAmount,
      })))
    } else if (reportType === 'transactions') {
      downloadCsv('folioone-transactions-report.csv', transactions.map((t) => ({
        date: formatDate(t.transactionDate), instrument: t.instrumentName, type: t.transactionType, platform: accountName(t.accountId), amount: t.amount,
      })))
    } else if (reportType === 'allocation') {
      downloadCsv('folioone-allocation-report.csv', assetAllocation.map((a) => ({ assetClass: a.label, value: a.value, percentage: a.percentage.toFixed(2) })))
    } else if (reportType === 'platform') {
      downloadCsv('folioone-platform-report.csv', platformAllocation.map((a) => ({ platform: a.label, value: a.value, percentage: a.percentage.toFixed(2) })))
    } else {
      downloadCsv('folioone-consolidated-report.csv', [{
        totalInvested: summary.totalInvested, totalCurrentValue: summary.totalCurrentValue,
        totalProfitLoss: summary.totalProfitLoss, returnPct: summary.totalReturnPercentage.toFixed(2), incomeReceived: income,
      }])
    }
  }

  return (
    <div className="flex flex-col gap-5 print:gap-3">
      <div className="flex flex-wrap items-start justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Reports & Tax</h1>
          <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">Illustrative reports generated from your tracked portfolio and transaction data.</p>
        </div>
        <div className="flex gap-2">
          <Select value={accountFilter} onChange={(e) => setAccountFilter(e.target.value as PlatformId | 'all')} className="w-auto">
            <option value="all">All Platforms</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>{a.platformName}</option>
            ))}
          </Select>
          <Button variant="secondary" icon={<Printer size={15} />} onClick={() => window.print()}>Print</Button>
          <Button variant="primary" icon={<Download size={15} />} onClick={handleExport}>Export CSV</Button>
        </div>
      </div>

      <div className="print:hidden">
        <Tabs tabs={REPORT_TABS} active={reportType} onChange={setReportType} />
      </div>

      <div className="rounded-xl border border-[var(--color-amber)]/30 bg-[var(--color-amber)]/5 px-4 py-2.5 text-xs text-[var(--color-amber)] print:border-black/20 print:bg-transparent print:text-black">
        Illustrative report for demonstration purposes only. Not a valid tax return or legally accurate tax calculation.
      </div>

      <Card className="print:border-0 print:shadow-none">
        <CardBody className="pt-5">
          <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
            {REPORT_TABS.find((t) => t.value === reportType)?.label} Report
          </h2>
          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">Generated {formatDate(new Date().toISOString())} · Scope: {accountFilter === 'all' ? 'All Platforms' : accountName(accountFilter)}</p>

          {reportType === 'consolidated' && (
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              <Stat label="Total Invested" value={formatINR(summary.totalInvested)} />
              <Stat label="Current Value" value={formatINR(summary.totalCurrentValue)} />
              <Stat label="Unrealized P&L" value={formatINR(summary.totalProfitLoss)} />
              <Stat label="Return" value={`${summary.totalReturnPercentage.toFixed(2)}%`} />
              <Stat label="Income Received" value={formatINR(income)} />
              <Stat label="Holdings Tracked" value={String(scoped.length)} />
            </div>
          )}

          {reportType === 'holdings' && (
            <ReportTable
              headers={['Instrument', 'Asset Class', 'Platform', 'Invested', 'Current Value', 'P&L']}
              rows={scoped.map((h) => [h.instrumentName, h.assetClass, accountName(h.accountId), formatINR(h.investedAmount), formatINR(h.currentValue), formatINR(h.currentValue - h.investedAmount)])}
            />
          )}

          {reportType === 'platform' && (
            <ReportTable headers={['Platform', 'Value', '% of Portfolio']} rows={platformAllocation.map((a) => [a.label, formatINR(a.value), `${a.percentage.toFixed(1)}%`])} />
          )}

          {reportType === 'allocation' && (
            <ReportTable headers={['Asset Class', 'Value', '% of Portfolio']} rows={assetAllocation.map((a) => [a.label, formatINR(a.value), `${a.percentage.toFixed(1)}%`])} />
          )}

          {reportType === 'transactions' && (
            <ReportTable
              headers={['Date', 'Instrument', 'Type', 'Platform', 'Amount']}
              rows={transactions.map((t) => [formatDate(t.transactionDate), t.instrumentName, t.transactionType, accountName(t.accountId), formatINR(t.amount)])}
            />
          )}

          {reportType === 'income' && (
            <ReportTable
              headers={['Date', 'Instrument', 'Type', 'Amount']}
              rows={transactions.filter((t) => ['Dividend', 'Interest', 'Distribution'].includes(t.transactionType)).map((t) => [formatDate(t.transactionDate), t.instrumentName, t.transactionType, formatINR(t.amount)])}
            />
          )}

          {reportType === 'gains' && (
            <ReportTable
              headers={['Instrument', 'Invested', 'Current Value', 'Unrealized Gain/Loss']}
              rows={scoped.map((h) => [h.instrumentName, formatINR(h.investedAmount), formatINR(h.currentValue), formatINR(h.currentValue - h.investedAmount)])}
            />
          )}
        </CardBody>
      </Card>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-1 text-base font-semibold num-tabular">{value}</p>
    </div>
  )
}

function ReportTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] text-left text-xs text-[var(--color-text-muted)]">
            {headers.map((h) => (
              <th key={h} className="py-2 pr-4 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[var(--color-border)] last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="py-2 pr-4">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
