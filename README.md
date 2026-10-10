# FolioOne — Your Wealth, Unified.

A frontend-only prototype of a unified investment intelligence platform for Indian retail investors. FolioOne consolidates holdings across brokers, mutual fund platforms, bond platforms, crypto exchanges, and manually tracked assets into one coherent portfolio view — and helps investors discover and understand investments beyond conventional stocks and mutual funds (REITs, InvITs, bonds, crypto, gold, fixed deposits).

**This is a demo prototype.** All platforms, holdings, and transactions are simulated sample data stored only in your browser's local storage. No real brokerage, banking, or depository accounts are ever connected, and no credentials are collected.

## Features

- **Three levels of portfolio visibility** — consolidated (all platforms), per-platform, and per-asset-class views, all computed live from one shared holdings dataset.
- **Linked Accounts** — simulate connecting new demo platforms, disconnecting accounts (excluded from consolidated totals), syncing, and CSV import of holdings.
- **Transactions** — a unified activity feed with filters, search, CSV export, and a quick-add form.
- **Explore Investments** — educational cards for Stocks, Mutual Funds, ETFs, REITs, InvITs, Bonds, Crypto, Gold, and Fixed Deposits, each with an instrument detail page, illustrative historical chart, pros/cons, and risk profile.
- **Watchlist** — save instruments from Explore, persisted locally.
- **Compare & Learn** — side-by-side comparison of up to 3 asset categories across 9 dimensions, plus short lessons with quizzes and a glossary.
- **Goals & Planner** — create goals, adjust contribution/return assumptions with live sliders, and see projected future value vs. shortfall/surplus.
- **Insights & Alerts** — rule-based observations generated from your actual holdings and configurable allocation targets.
- **Reports & Tax** — illustrative consolidated/holdings/platform/allocation/transaction/income/gains reports with CSV export and print view.
- **Settings** — show/hide balances, light/dark theme, notification preferences, and a one-click demo data reset.

## Tech Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router · Recharts · Zustand (persisted to `localStorage`) · Lucide Icons

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.

```bash
npm run build    # type-checks and builds a production bundle to dist/
npm run preview  # preview the production build locally
```

## Deploying to Vercel

1. Push this repository to GitHub.
2. In [Vercel](https://vercel.com), click **New Project** and import the repository.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. No environment variables are required — the app works entirely with local mock data.
5. Deploy. `vercel.json` already includes the SPA rewrite rule so nested routes (e.g. `/portfolio/account/groww`) work on direct navigation and refresh.

## Known Simulations / Limitations

- All platform connections, prices, and historical charts are illustrative sample data, not live market feeds.
- "Connecting" an account adds a simulated demo account with sample holdings — no real brokerage integration exists or is implied.
- Reports are illustrative and are not a valid tax return or legally accurate tax calculation.
- All data lives in `localStorage` in your browser; clearing site data or using a different browser/device will reset it (use **Settings → Reset Demo Data** to restore the seed portfolio intentionally).
