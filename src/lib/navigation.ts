import type { AssetClass } from '@/types'

export const ASSET_CLASSES: AssetClass[] = [
  'Stocks',
  'Mutual Funds',
  'ETFs',
  'REITs',
  'InvITs',
  'Bonds',
  'Crypto',
  'Gold',
  'Fixed Deposits',
  'Other',
]

export function assetClassToSlug(assetClass: string): string {
  return assetClass.toLowerCase().replace(/\s+/g, '-')
}

export function slugToAssetClass(slug: string): AssetClass | undefined {
  return ASSET_CLASSES.find((a) => assetClassToSlug(a) === slug)
}
