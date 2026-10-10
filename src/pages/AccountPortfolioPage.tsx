import { Navigate, useParams } from 'react-router-dom'
import { PortfolioExplorer } from '@/components/portfolio/PortfolioExplorer'
import { usePortfolioStore } from '@/store/portfolioStore'
import type { PlatformId } from '@/types'

export default function AccountPortfolioPage() {
  const { accountId } = useParams<{ accountId: string }>()
  const accounts = usePortfolioStore((s) => s.accounts)
  const account = accounts.find((a) => a.id === accountId)

  if (!account) return <Navigate to="/portfolio" replace />

  return (
    <PortfolioExplorer
      key={account.id}
      title={account.platformName}
      subtitle={`${account.accountType} · ${account.isEnabled ? 'Connected' : 'Disconnected'}`}
      initialAccountId={account.id as PlatformId}
      initialAssetClass="all"
    />
  )
}
