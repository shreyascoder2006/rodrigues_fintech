import type { Holding, PlatformAccount, AssetClass, PlatformId, Transaction } from '@/types'

export interface PortfolioSummary {
  totalInvested: number
  totalCurrentValue: number
  totalProfitLoss: number
  totalReturnPercentage: number
}

export function summarize(holdings: Holding[]): PortfolioSummary {
  const totalInvested = holdings.reduce((s, h) => s + h.investedAmount, 0)
  const totalCurrentValue = holdings.reduce((s, h) => s + h.currentValue, 0)
  const totalProfitLoss = totalCurrentValue - totalInvested
  const totalReturnPercentage = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0
  return { totalInvested, totalCurrentValue, totalProfitLoss, totalReturnPercentage }
}

export function enabledHoldings(holdings: Holding[], accounts: PlatformAccount[]): Holding[] {
  const enabledIds = new Set(accounts.filter((a) => a.isEnabled).map((a) => a.id))
  return holdings.filter((h) => enabledIds.has(h.accountId))
}

export function filterByAccount(holdings: Holding[], accountId: PlatformId | 'all'): Holding[] {
  if (accountId === 'all') return holdings
  return holdings.filter((h) => h.accountId === accountId)
}

export function filterByAssetClass(holdings: Holding[], assetClass: AssetClass | 'all'): Holding[] {
  if (assetClass === 'all') return holdings
  return holdings.filter((h) => h.assetClass === assetClass)
}

export interface AllocationSlice {
  label: string
  value: number
  percentage: number
}

export function allocationByAssetClass(holdings: Holding[]): AllocationSlice[] {
  const map = new Map<string, number>()
  let total = 0
  for (const h of holdings) {
    map.set(h.assetClass, (map.get(h.assetClass) ?? 0) + h.currentValue)
    total += h.currentValue
  }
  return Array.from(map.entries())
    .map(([label, value]) => ({ label, value, percentage: total > 0 ? (value / total) * 100 : 0 }))
    .sort((a, b) => b.value - a.value)
}

export function allocationByAccount(holdings: Holding[], accounts: PlatformAccount[]): AllocationSlice[] {
  const map = new Map<string, number>()
  let total = 0
  for (const h of holdings) {
    map.set(h.accountId, (map.get(h.accountId) ?? 0) + h.currentValue)
    total += h.currentValue
  }
  return Array.from(map.entries())
    .map(([accountId, value]) => {
      const acc = accounts.find((a) => a.id === accountId)
      return { label: acc?.platformName ?? accountId, value, percentage: total > 0 ? (value / total) * 100 : 0 }
    })
    .sort((a, b) => b.value - a.value)
}

export function topMovers(holdings: Holding[], count = 5) {
  const withReturn = holdings.map((h) => ({
    holding: h,
    returnPct: h.investedAmount > 0 ? ((h.currentValue - h.investedAmount) / h.investedAmount) * 100 : 0,
    absolute: h.currentValue - h.investedAmount,
  }))
  const gainers = [...withReturn].sort((a, b) => b.returnPct - a.returnPct).slice(0, count)
  const losers = [...withReturn].sort((a, b) => a.returnPct - b.returnPct).slice(0, count)
  return { gainers, losers }
}

export function totalIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => ['Dividend', 'Interest', 'Distribution'].includes(t.transactionType))
    .reduce((s, t) => s + t.amount, 0)
}

export function incomeBySource(transactions: Transaction[]) {
  const map = new Map<string, number>()
  for (const t of transactions) {
    if (['Dividend', 'Interest', 'Distribution'].includes(t.transactionType)) {
      map.set(t.transactionType, (map.get(t.transactionType) ?? 0) + t.amount)
    }
  }
  return Array.from(map.entries()).map(([label, value]) => ({ label, value }))
}

export function concentrationByInstrument(holdings: Holding[], count = 5): AllocationSlice[] {
  const total = holdings.reduce((s, h) => s + h.currentValue, 0)
  return [...holdings]
    .sort((a, b) => b.currentValue - a.currentValue)
    .slice(0, count)
    .map((h) => ({ label: h.instrumentName, value: h.currentValue, percentage: total > 0 ? (h.currentValue / total) * 100 : 0 }))
}

/**
 * Future value with monthly contributions made at the start of each month (annuity-due),
 * compounded monthly at the given annual rate.
 */
export function projectGoalFutureValue(
  currentAmount: number,
  monthlyContribution: number,
  annualReturnPct: number,
  months: number,
): number {
  const r = annualReturnPct / 100 / 12
  if (months <= 0) return currentAmount
  const fvCurrent = currentAmount * Math.pow(1 + r, months)
  const fvContributions =
    r === 0
      ? monthlyContribution * months
      : monthlyContribution * (((Math.pow(1 + r, months) - 1) / r) * (1 + r))
  return fvCurrent + fvContributions
}
