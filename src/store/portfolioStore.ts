import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  PlatformAccount,
  Holding,
  Transaction,
  Goal,
  WatchlistItem,
  AllocationTargets,
  PlatformId,
} from '@/types'
import {
  PLATFORM_ACCOUNTS,
  INITIAL_HOLDINGS,
  INITIAL_TRANSACTIONS,
  INITIAL_GOALS,
  INITIAL_WATCHLIST,
  CONNECTABLE_CATALOG,
} from '@/data/seedData'
import { isoToday } from '@/lib/date'

interface SettingsState {
  showBalances: boolean
  theme: 'dark' | 'light'
  notificationsEnabled: boolean
  allocationTargets: AllocationTargets
}

interface PortfolioState {
  accounts: PlatformAccount[]
  holdings: Holding[]
  transactions: Transaction[]
  goals: Goal[]
  watchlist: WatchlistItem[]
  dismissedInsightIds: string[]
  readInsightIds: string[]
  completedLessonIds: string[]
  settings: SettingsState

  addHolding: (holding: Omit<Holding, 'id' | 'lastUpdated'>) => void
  updateHolding: (id: string, patch: Partial<Holding>) => void
  deleteHolding: (id: string) => void

  addTransaction: (transaction: Omit<Transaction, 'id'>) => void

  connectAccount: (id: PlatformId) => void
  disconnectAccount: (id: PlatformId) => void
  syncAccount: (id: PlatformId) => void
  connectNewAccount: (catalogId: string) => void

  addGoal: (goal: Omit<Goal, 'id'>) => void
  updateGoal: (id: string, patch: Partial<Goal>) => void
  deleteGoal: (id: string) => void

  addWatchlistItem: (item: Omit<WatchlistItem, 'id' | 'addedAt'>) => void
  removeWatchlistItem: (instrumentId: string) => void

  dismissInsight: (id: string) => void
  markInsightRead: (id: string) => void

  completeLesson: (id: string) => void

  setAllocationTarget: (assetClass: keyof AllocationTargets, value: number | undefined) => void
  toggleShowBalances: () => void
  setNotificationsEnabled: (v: boolean) => void
  setTheme: (theme: 'dark' | 'light') => void

  resetDemoData: () => void
}

const defaultSettings: SettingsState = {
  showBalances: true,
  theme: 'dark',
  notificationsEnabled: true,
  allocationTargets: { Stocks: 35, 'Mutual Funds': 30, Bonds: 20, Crypto: 5, Gold: 10 },
}

function genId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      accounts: PLATFORM_ACCOUNTS,
      holdings: INITIAL_HOLDINGS,
      transactions: INITIAL_TRANSACTIONS,
      goals: INITIAL_GOALS,
      watchlist: INITIAL_WATCHLIST,
      dismissedInsightIds: [],
      readInsightIds: [],
      completedLessonIds: [],
      settings: defaultSettings,

      addHolding: (holding) =>
        set((s) => ({
          holdings: [
            ...s.holdings,
            { ...holding, id: genId('hold'), lastUpdated: isoToday() },
          ],
        })),

      updateHolding: (id, patch) =>
        set((s) => ({
          holdings: s.holdings.map((h) => (h.id === id ? { ...h, ...patch, lastUpdated: isoToday() } : h)),
        })),

      deleteHolding: (id) => set((s) => ({ holdings: s.holdings.filter((h) => h.id !== id) })),

      addTransaction: (transaction) =>
        set((s) => ({ transactions: [{ ...transaction, id: genId('txn') }, ...s.transactions] })),

      connectAccount: (id) =>
        set((s) => ({
          accounts: s.accounts.map((a) =>
            a.id === id ? { ...a, isEnabled: true, connectionStatus: 'connected', lastSyncedAt: isoToday() } : a,
          ),
        })),

      disconnectAccount: (id) =>
        set((s) => ({
          accounts: s.accounts.map((a) =>
            a.id === id ? { ...a, isEnabled: false, connectionStatus: 'disconnected' } : a,
          ),
        })),

      syncAccount: (id) =>
        set((s) => ({
          accounts: s.accounts.map((a) => (a.id === id ? { ...a, lastSyncedAt: isoToday() } : a)),
        })),

      connectNewAccount: (catalogId) => {
        const existing = get().accounts.find((a) => a.id === catalogId)
        if (existing) {
          get().connectAccount(catalogId)
          return
        }
        const entry = CONNECTABLE_CATALOG.find((c) => c.id === catalogId)
        if (!entry) return
        const newAccount: PlatformAccount = {
          id: entry.id,
          platformName: entry.platformName,
          accountType: entry.accountType,
          category: entry.category,
          connectionStatus: 'connected',
          lastSyncedAt: isoToday(),
          isDemo: true,
          isEnabled: true,
          initials: entry.initials,
          colorToken: entry.colorToken,
        }
        const newHoldings: Holding[] = entry.sampleHoldings.map((h) => ({
          ...h,
          id: genId('hold'),
          accountId: entry.id,
          lastUpdated: isoToday(),
        }))
        set((s) => ({ accounts: [...s.accounts, newAccount], holdings: [...s.holdings, ...newHoldings] }))
      },

      addGoal: (goal) => set((s) => ({ goals: [...s.goals, { ...goal, id: genId('goal') }] })),
      updateGoal: (id, patch) =>
        set((s) => ({ goals: s.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)) })),
      deleteGoal: (id) => set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

      addWatchlistItem: (item) => {
        if (get().watchlist.some((w) => w.instrumentId === item.instrumentId)) return
        set((s) => ({
          watchlist: [...s.watchlist, { ...item, id: genId('watch'), addedAt: isoToday() }],
        }))
      },
      removeWatchlistItem: (instrumentId) =>
        set((s) => ({ watchlist: s.watchlist.filter((w) => w.instrumentId !== instrumentId) })),

      dismissInsight: (id) => set((s) => ({ dismissedInsightIds: [...s.dismissedInsightIds, id] })),
      markInsightRead: (id) => set((s) => ({ readInsightIds: [...s.readInsightIds, id] })),

      completeLesson: (id) =>
        set((s) => ({
          completedLessonIds: s.completedLessonIds.includes(id) ? s.completedLessonIds : [...s.completedLessonIds, id],
        })),

      setAllocationTarget: (assetClass, value) =>
        set((s) => ({
          settings: { ...s.settings, allocationTargets: { ...s.settings.allocationTargets, [assetClass]: value } },
        })),

      toggleShowBalances: () =>
        set((s) => ({ settings: { ...s.settings, showBalances: !s.settings.showBalances } })),

      setNotificationsEnabled: (v) =>
        set((s) => ({ settings: { ...s.settings, notificationsEnabled: v } })),

      setTheme: (theme) => set((s) => ({ settings: { ...s.settings, theme } })),

      resetDemoData: () =>
        set({
          accounts: PLATFORM_ACCOUNTS,
          holdings: INITIAL_HOLDINGS,
          transactions: INITIAL_TRANSACTIONS,
          goals: INITIAL_GOALS,
          watchlist: INITIAL_WATCHLIST,
          dismissedInsightIds: [],
          readInsightIds: [],
          completedLessonIds: [],
          settings: defaultSettings,
        }),
    }),
    { name: 'folioone-demo-state', version: 1 },
  ),
)
