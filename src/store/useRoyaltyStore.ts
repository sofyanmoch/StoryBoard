import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type IPAsset } from '@/types'

/**
 * Represents royalty token holdings for an IP asset
 */
export interface RoyaltyHolding {
  id: string
  ipAssetId: string
  ipAsset: IPAsset
  sharePercentage: number // e.g., 5 = 5%
  royaltyTokens: number // e.g., 5,000,000 tokens
  vaultAddress?: string
  acquiredAt: string
  lastClaimAt?: string
  totalClaimed?: string // Total revenue claimed (in ETH)
}

interface RoyaltyStore {
  // Holdings
  holdings: RoyaltyHolding[]

  // Actions
  addHolding: (holding: RoyaltyHolding) => void
  removeHolding: (id: string) => void
  updateHolding: (id: string, updates: Partial<RoyaltyHolding>) => void
  getHoldingsByIPId: (ipAssetId: string) => RoyaltyHolding[]
  getTotalShares: () => number
  getTotalTokens: () => number

  // Claim tracking
  recordClaim: (holdingId: string, amount: string) => void

  reset: () => void
}

export const useRoyaltyStore = create<RoyaltyStore>()(
  persist(
    (set, get) => ({
      holdings: [],

      addHolding: (holding) => set((state) => {
        // Check if already holding this IP
        const existingIndex = state.holdings.findIndex(
          (h) => h.ipAssetId === holding.ipAssetId
        )

        if (existingIndex >= 0) {
          // Update existing holding
          const updated = [...state.holdings]
          const existing = updated[existingIndex]
          updated[existingIndex] = {
            ...existing,
            sharePercentage: existing.sharePercentage + holding.sharePercentage,
            royaltyTokens: existing.royaltyTokens + holding.royaltyTokens,
            acquiredAt: holding.acquiredAt // Update to latest
          }
          return { holdings: updated }
        }

        // Add new holding
        return {
          holdings: [holding, ...state.holdings]
        }
      }),

      removeHolding: (id) => set((state) => ({
        holdings: state.holdings.filter((h) => h.id !== id)
      })),

      updateHolding: (id, updates) => set((state) => ({
        holdings: state.holdings.map((h) =>
          h.id === id ? { ...h, ...updates } : h
        )
      })),

      getHoldingsByIPId: (ipAssetId) => {
        return get().holdings.filter((h) => h.ipAssetId === ipAssetId)
      },

      getTotalShares: () => {
        return get().holdings.reduce(
          (total, h) => total + h.sharePercentage,
          0
        )
      },

      getTotalTokens: () => {
        return get().holdings.reduce(
          (total, h) => total + h.royaltyTokens,
          0
        )
      },

      recordClaim: (holdingId, amount) => set((state) => ({
        holdings: state.holdings.map((h) => {
          if (h.id === holdingId) {
            const currentTotal = parseFloat(h.totalClaimed || '0')
            const newTotal = currentTotal + parseFloat(amount)
            return {
              ...h,
              lastClaimAt: new Date().toISOString(),
              totalClaimed: newTotal.toString()
            }
          }
          return h
        })
      })),

      reset: () => set({
        holdings: []
      })
    }),
    {
      name: 'royalty-store',
      partialize: (state) => ({
        holdings: state.holdings
      })
    }
  )
)
