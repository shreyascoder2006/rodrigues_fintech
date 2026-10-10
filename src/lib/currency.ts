export function formatINR(value: number, options?: { compact?: boolean; hideDecimals?: boolean }): string {
  if (options?.compact) {
    const abs = Math.abs(value)
    if (abs >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(2)} Cr`
    if (abs >= 1_00_000) return `₹${(value / 1_00_000).toFixed(2)} L`
    if (abs >= 1_000) return `₹${(value / 1_000).toFixed(1)}K`
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: options?.hideDecimals ? 0 : 2,
  }).format(value)
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: decimals }).format(value)
}

export function formatPercent(value: number, decimals = 2): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals)}%`
}

export function maskValue(formatted: string): string {
  return formatted.replace(/[0-9]/g, '•')
}
