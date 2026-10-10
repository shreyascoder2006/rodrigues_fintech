export type AssetClass =
  | 'Stocks'
  | 'Mutual Funds'
  | 'ETFs'
  | 'REITs'
  | 'InvITs'
  | 'Bonds'
  | 'Crypto'
  | 'Gold'
  | 'Fixed Deposits'
  | 'Other'

export type PlatformId = string

export interface PlatformAccount {
  id: PlatformId
  platformName: string
  accountType: string
  category: string
  connectionStatus: 'connected' | 'disconnected'
  lastSyncedAt: string
  isDemo: boolean
  isEnabled: boolean
  initials: string
  colorToken: string
}

export interface Holding {
  id: string
  accountId: PlatformId
  instrumentName: string
  symbol?: string
  assetClass: AssetClass
  quantity: number
  investedAmount: number
  currentValue: number
  currency: 'INR'
  purchaseDate: string
  lastUpdated: string
  isManual?: boolean
  meta?: {
    issuer?: string
    couponRate?: number
    faceValue?: number
    maturityDate?: string
    creditRating?: string
    interestRate?: number
    principal?: number
    startDate?: string
  }
}

export type TransactionType =
  | 'Buy'
  | 'Sell'
  | 'Dividend'
  | 'Interest'
  | 'Distribution'
  | 'Deposit'
  | 'Redemption'

export interface Transaction {
  id: string
  accountId: PlatformId
  holdingId?: string
  instrumentName: string
  assetClass: AssetClass
  transactionType: TransactionType
  amount: number
  quantity?: number
  transactionDate: string
  status: 'Completed' | 'Pending'
  notes?: string
}

export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  monthlyContribution: number
  targetDate: string
  assumedAnnualReturn: number
}

export interface WatchlistItem {
  id: string
  instrumentId: string
  instrumentName: string
  assetClass: AssetClass
  illustrativePrice: number
  addedAt: string
}

export interface Insight {
  id: string
  title: string
  description: string
  severity: 'info' | 'warning' | 'positive'
  relatedAssetClass?: AssetClass
  relatedAccountId?: PlatformId
  isRead: boolean
  createdAt: string
}

export interface PortfolioSnapshot {
  date: string
  value: number
}

export interface ExploreInstrument {
  id: string
  name: string
  category: AssetClass
  subtitle: string
  summary: string
  illustrativePrice: number
  change1y: number
  risk: 'Low' | 'Moderate' | 'High' | 'Very High'
  horizon: string
  liquidity: 'High' | 'Moderate' | 'Low'
  history: PortfolioSnapshot[]
  pros: string[]
  cons: string[]
  details: Record<string, string>
}

export interface Lesson {
  id: string
  title: string
  summary: string
  content: string
  example: string
  quiz: { question: string; options: string[]; correctIndex: number }
}

export interface GlossaryTerm {
  term: string
  definition: string
}

export interface AllocationTargets {
  Stocks?: number
  'Mutual Funds'?: number
  Bonds?: number
  Crypto?: number
  Gold?: number
}
