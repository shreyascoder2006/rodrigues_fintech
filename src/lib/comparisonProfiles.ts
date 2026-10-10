import type { AssetClass } from '@/types'

export interface ComparisonProfile {
  howItWorks: string
  returnMechanism: string
  incomeDistributions: string
  liquidity: string
  mainRisks: string
  diversification: string
  complexity: string
  costs: string
  horizon: string
}

export const COMPARISON_PROFILES: Record<AssetClass, ComparisonProfile> = {
  Stocks: {
    howItWorks: 'Direct part-ownership in a listed company, bought and sold on an exchange.',
    returnMechanism: 'Capital appreciation plus any dividends the company chooses to pay.',
    incomeDistributions: 'Dividends, if declared — not guaranteed or fixed.',
    liquidity: 'High for large-cap stocks; varies for small/mid-cap names.',
    mainRisks: 'Company-specific risk, market volatility, no capital protection.',
    diversification: 'Low per single stock; depends heavily on sector and company exposure.',
    complexity: 'Moderate — requires company and sector research.',
    costs: 'Brokerage and transaction charges; no recurring management fee.',
    horizon: 'Typically 5+ years for compounding to work through cycles.',
  },
  'Mutual Funds': {
    howItWorks: 'Pooled money professionally managed and invested across securities per a stated strategy.',
    returnMechanism: 'NAV appreciation reflecting the performance of underlying holdings.',
    incomeDistributions: 'Optional dividend/IDCW payout plans; growth plans reinvest instead.',
    liquidity: 'High — most open-ended funds allow redemption within a few business days.',
    mainRisks: 'Market risk of underlying assets; fund manager and strategy risk.',
    diversification: 'High — a single fund can hold dozens of securities.',
    complexity: 'Low to moderate — beginner-friendly with professional management.',
    costs: 'Expense ratio charged annually; possible exit load for early redemption.',
    horizon: '3-5+ years depending on fund category.',
  },
  ETFs: {
    howItWorks: 'A basket of securities tracking an index, traded on an exchange like a stock.',
    returnMechanism: 'Tracks the performance of its underlying index or benchmark.',
    incomeDistributions: 'Some ETFs distribute dividends from underlying holdings.',
    liquidity: 'High — tradable throughout market hours at live prices.',
    mainRisks: 'Market risk of the tracked index; tracking error versus benchmark.',
    diversification: 'High — single purchase gives exposure to the full underlying basket.',
    complexity: 'Low — transparent, rules-based, easy to understand.',
    costs: 'Very low expense ratio versus actively managed funds; brokerage on trades.',
    horizon: '5+ years for equity-linked ETFs; shorter for debt ETFs.',
  },
  REITs: {
    howItWorks: 'A trust owning income-generating real estate; units trade on an exchange.',
    returnMechanism: 'Rental income distributions plus potential unit price appreciation.',
    incomeDistributions: 'Regular distributions, often quarterly, from rental income.',
    liquidity: 'Moderate — listed but with lower trading volumes than large-cap stocks.',
    mainRisks: 'Occupancy & leasing risk, interest-rate sensitivity, real estate cycles.',
    diversification: 'Moderate — diversified across properties, but concentrated in real estate.',
    complexity: 'Moderate — requires understanding of distribution yield and NAV premium/discount.',
    costs: 'Trust management fees embedded; brokerage on unit purchase.',
    horizon: '3-5+ years for income and cycle-related appreciation.',
  },
  InvITs: {
    howItWorks: 'A trust owning operating infrastructure assets; units trade on an exchange.',
    returnMechanism: 'Distributions from asset cash flows plus potential unit price movement.',
    incomeDistributions: 'Regular distributions, often quarterly, from toll/tariff cash flows.',
    liquidity: 'Low to moderate — thinner trading volumes than equities.',
    mainRisks: 'Regulatory/tariff risk, demand risk (e.g. traffic), interest-rate sensitivity.',
    diversification: 'Moderate — multiple assets, but sector-concentrated in infrastructure.',
    complexity: 'Moderate to high — requires understanding underlying asset cash flows.',
    costs: 'Trust management fees embedded; brokerage on unit purchase.',
    horizon: '3-5+ years, matching long-lived infrastructure assets.',
  },
  Bonds: {
    howItWorks: 'A loan to a government or company in exchange for periodic interest and principal repayment.',
    returnMechanism: 'Fixed coupon income plus price gain/loss if sold before maturity.',
    incomeDistributions: 'Periodic coupon payments at a fixed or floating rate.',
    liquidity: 'Varies — government securities are more liquid than many corporate bonds.',
    mainRisks: 'Interest-rate risk, credit/default risk (for non-sovereign issuers).',
    diversification: 'Low per single bond; reduces overall portfolio volatility when combined with equity.',
    complexity: 'Moderate — coupon, yield, and price relationships take some learning.',
    costs: 'Bid-ask spread; low ongoing cost if held to maturity.',
    horizon: 'Matches the bond\'s tenure — from under 1 year to 10+ years.',
  },
  Crypto: {
    howItWorks: 'Decentralized digital assets traded on crypto exchanges, 24/7.',
    returnMechanism: 'Purely price-driven — no cash flows or earnings underpin value.',
    incomeDistributions: 'None, typically — some networks offer staking rewards (not modeled here).',
    liquidity: 'High on major exchanges, but prices can gap sharply.',
    mainRisks: 'Extreme volatility, regulatory uncertainty, no intrinsic cash flow backing.',
    diversification: 'Very low — highly correlated price moves across most crypto assets.',
    complexity: 'High — requires understanding of custody, volatility, and market structure.',
    costs: 'Exchange trading fees; wallet/custody considerations.',
    horizon: 'Speculative — only for high risk tolerance, any horizon.',
  },
  Gold: {
    howItWorks: 'Exposure to gold prices via SGBs, Gold ETFs, gold mutual funds, or physical gold.',
    returnMechanism: 'Tracks domestic gold price movements; SGBs add a fixed annual interest.',
    incomeDistributions: 'SGBs pay ~2.5% p.a. interest; ETFs and physical gold pay none.',
    liquidity: 'High for Gold ETFs; low for SGBs (lock-in) and physical gold (resale friction).',
    mainRisks: 'Gold price volatility; SGB lock-in; physical gold storage & purity risk.',
    diversification: 'Useful hedge against equity & currency risk; low correlation to stocks.',
    complexity: 'Low to moderate — differs meaningfully by product type.',
    costs: 'ETF expense ratio; no making charges versus physical gold.',
    horizon: '3-8 years depending on product (SGBs lock in for 8 years).',
  },
  'Fixed Deposits': {
    howItWorks: 'A fixed-tenure deposit with a bank or NBFC at a pre-agreed interest rate.',
    returnMechanism: 'Guaranteed fixed interest for the deposit tenure.',
    incomeDistributions: 'Interest paid periodically or at maturity, per the chosen option.',
    liquidity: 'Low — premature withdrawal usually incurs a penalty.',
    mainRisks: 'Inflation eroding real returns; issuer/institution risk beyond insured limits.',
    diversification: 'None by itself — a stable anchor rather than a growth asset.',
    complexity: 'Very low — simple, well understood by most investors.',
    costs: 'No ongoing fees; possible penalty on early withdrawal.',
    horizon: '1-5 years, matched to the deposit tenure.',
  },
  Other: {
    howItWorks: 'Manually tracked investments not covered by a standard category.',
    returnMechanism: 'Depends on the specific instrument being tracked.',
    incomeDistributions: 'Varies by instrument.',
    liquidity: 'Varies by instrument.',
    mainRisks: 'Varies by instrument — review the specific terms.',
    diversification: 'Depends on what is being tracked.',
    complexity: 'Varies.',
    costs: 'Varies by instrument.',
    horizon: 'Varies by instrument.',
  },
}

export const COMPARISON_DIMENSIONS: Array<{ key: keyof ComparisonProfile; label: string }> = [
  { key: 'howItWorks', label: 'How it works' },
  { key: 'returnMechanism', label: 'Return mechanism' },
  { key: 'incomeDistributions', label: 'Income distributions' },
  { key: 'liquidity', label: 'Liquidity' },
  { key: 'mainRisks', label: 'Main risks' },
  { key: 'diversification', label: 'Diversification' },
  { key: 'complexity', label: 'Complexity for beginners' },
  { key: 'costs', label: 'Typical costs' },
  { key: 'horizon', label: 'Investment horizon' },
]
