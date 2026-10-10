import { Navigate, useParams } from 'react-router-dom'
import { PortfolioExplorer } from '@/components/portfolio/PortfolioExplorer'
import { slugToAssetClass } from '@/lib/navigation'

export default function AssetClassPage() {
  const { assetSlug } = useParams<{ assetSlug: string }>()
  const assetClass = assetSlug ? slugToAssetClass(assetSlug) : undefined

  if (!assetClass) return <Navigate to="/portfolio" replace />

  return (
    <PortfolioExplorer
      key={assetClass}
      title={assetClass}
      subtitle={`${assetClass} holdings aggregated across every connected platform.`}
      initialAccountId="all"
      initialAssetClass={assetClass}
    />
  )
}
