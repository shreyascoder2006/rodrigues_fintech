import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ToastProvider } from '@/components/ui/Toast'
import { usePortfolioStore } from '@/store/portfolioStore'
import OverviewPage from '@/pages/OverviewPage'
import PortfolioPage from '@/pages/PortfolioPage'
import AccountPortfolioPage from '@/pages/AccountPortfolioPage'
import AssetClassPage from '@/pages/AssetClassPage'
import AnalyticsPage from '@/pages/AnalyticsPage'
import TransactionsPage from '@/pages/TransactionsPage'
import ExplorePage from '@/pages/ExplorePage'
import InvestmentDetailPage from '@/pages/InvestmentDetailPage'
import WatchlistPage from '@/pages/WatchlistPage'
import CompareLearnPage from '@/pages/CompareLearnPage'
import GoalsPage from '@/pages/GoalsPage'
import InsightsPage from '@/pages/InsightsPage'
import ReportsPage from '@/pages/ReportsPage'
import LinkedAccountsPage from '@/pages/LinkedAccountsPage'
import SettingsPage from '@/pages/SettingsPage'
import NotFoundPage from '@/pages/NotFoundPage'

function ThemeSync() {
  const theme = usePortfolioStore((s) => s.settings.theme)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  return null
}

export default function App() {
  return (
    <ToastProvider>
      <ThemeSync />
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<OverviewPage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="portfolio/account/:accountId" element={<AccountPortfolioPage />} />
            <Route path="portfolio/asset/:assetSlug" element={<AssetClassPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="explore/:instrumentId" element={<InvestmentDetailPage />} />
            <Route path="watchlist" element={<WatchlistPage />} />
            <Route path="compare" element={<CompareLearnPage />} />
            <Route path="goals" element={<GoalsPage />} />
            <Route path="insights" element={<InsightsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="accounts" element={<LinkedAccountsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}
