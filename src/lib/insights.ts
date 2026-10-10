import type { Holding, PlatformAccount, Transaction, AllocationTargets, Insight } from '@/types'
import { allocationByAssetClass, summarize } from '@/lib/calculations'
import { formatPercent } from '@/lib/currency'

export function generateInsights(
  holdings: Holding[],
  accounts: PlatformAccount[],
  transactions: Transaction[],
  targets: AllocationTargets,
): Insight[] {
  const insights: Insight[] = []
  const allocation = allocationByAssetClass(holdings)
  const summary = summarize(holdings)
  const now = new Date().toISOString()

  const equitySlice = allocation.find((a) => ['Stocks', 'Mutual Funds', 'ETFs'].includes(a.label))
  const equityPct = allocation
    .filter((a) => ['Stocks', 'Mutual Funds', 'ETFs'].includes(a.label))
    .reduce((s, a) => s + a.percentage, 0)
  if (equityPct > 0) {
    insights.push({
      id: 'insight-equity-share',
      title: 'Equity concentration',
      description: `Equities (stocks, mutual funds & ETFs) account for ${equityPct.toFixed(0)}% of your tracked portfolio.`,
      severity: equityPct > 70 ? 'warning' : 'info',
      isRead: false,
      createdAt: now,
    })
  }
  void equitySlice

  for (const [assetClass, target] of Object.entries(targets)) {
    if (target == null) continue
    const current = allocation.find((a) => a.label === assetClass)?.percentage ?? 0
    const diff = target - current
    if (Math.abs(diff) >= 3) {
      insights.push({
        id: `insight-target-${assetClass}`,
        title: `${assetClass} allocation ${diff > 0 ? 'below' : 'above'} target`,
        description: `Your target for ${assetClass} is ${target}%; your current allocation is ${current.toFixed(1)}%.`,
        severity: 'warning',
        relatedAssetClass: assetClass as Insight['relatedAssetClass'],
        isRead: false,
        createdAt: now,
      })
    }
  }

  const platformCount = new Set(holdings.map((h) => h.accountId)).size
  if (platformCount > 0) {
    insights.push({
      id: 'insight-platform-spread',
      title: 'Platform spread',
      description: `Your tracked investments span ${platformCount} platform${platformCount > 1 ? 's' : ''}.`,
      severity: 'info',
      isRead: false,
      createdAt: now,
    })
  }

  const cryptoPct = allocation.find((a) => a.label === 'Crypto')?.percentage ?? 0
  if (cryptoPct > 0) {
    insights.push({
      id: 'insight-crypto-share',
      title: 'Crypto exposure',
      description: `Your crypto holdings account for ${cryptoPct.toFixed(1)}% of portfolio value — a high-volatility asset class.`,
      severity: cryptoPct > 10 ? 'warning' : 'info',
      relatedAssetClass: 'Crypto',
      isRead: false,
      createdAt: now,
    })
  }

  const recentDividend = transactions.find((t) => t.transactionType === 'Dividend')
  if (recentDividend) {
    insights.push({
      id: 'insight-dividend-activity',
      title: 'Dividend recorded',
      description: `A dividend transaction of ₹${recentDividend.amount.toLocaleString('en-IN')} was recorded for ${recentDividend.instrumentName}.`,
      severity: 'positive',
      isRead: false,
      createdAt: now,
    })
  }

  if (summary.totalReturnPercentage !== 0) {
    insights.push({
      id: 'insight-overall-return',
      title: 'Overall portfolio return',
      description: `Your consolidated portfolio return stands at ${formatPercent(summary.totalReturnPercentage)} across ${holdings.length} tracked holdings.`,
      severity: summary.totalReturnPercentage >= 0 ? 'positive' : 'warning',
      isRead: false,
      createdAt: now,
    })
  }

  const disabledAccounts = accounts.filter((a) => !a.isEnabled)
  if (disabledAccounts.length > 0) {
    insights.push({
      id: 'insight-disabled-accounts',
      title: 'Disconnected accounts excluded',
      description: `${disabledAccounts.map((a) => a.platformName).join(', ')} ${disabledAccounts.length > 1 ? 'are' : 'is'} disconnected and excluded from your consolidated totals.`,
      severity: 'info',
      isRead: false,
      createdAt: now,
    })
  }

  return insights
}
