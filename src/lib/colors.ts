const ASSET_CLASS_COLORS: Record<string, string> = {
  Stocks: '#5b9cf6',
  'Mutual Funds': '#2fd499',
  ETFs: '#8c7bff',
  REITs: '#e0a92f',
  InvITs: '#f0924a',
  Bonds: '#7b8699',
  Crypto: '#e05a6e',
  Gold: '#f2c14e',
  'Fixed Deposits': '#4fd1c5',
  Other: '#9ca3af',
}

const PALETTE = ['#2fd499', '#5b9cf6', '#8c7bff', '#e0a92f', '#f0924a', '#e05a6e', '#7b8699', '#4fd1c5', '#f2c14e']

export function colorForAssetClass(assetClass: string): string {
  return ASSET_CLASS_COLORS[assetClass] ?? '#9ca3af'
}

export function colorForIndex(index: number): string {
  return PALETTE[index % PALETTE.length]
}
