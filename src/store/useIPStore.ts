import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type IPAsset, type SwipeAction } from '@/types'

interface IPStore {
  // Current swipe stack
  currentStack: IPAsset[]
  currentIndex: number

  // Liked IPs
  likedIPs: IPAsset[]

  // Swipe history for undo
  swipeHistory: SwipeAction[]

  // Actions
  setCurrentStack: (stack: IPAsset[]) => void
  nextCard: () => void
  previousCard: () => void

  likeIP: (ip: IPAsset) => void
  unlikeIP: (ipId: string) => void
  isLiked: (ipId: string) => boolean

  addSwipeAction: (action: SwipeAction) => void
  undoLastSwipe: () => IPAsset | null

  reset: () => void
}

export const useIPStore = create<IPStore>()(
  persist(
    (set, get) => ({
      currentStack: [],
      currentIndex: 0,
      likedIPs: [],
      swipeHistory: [],

      setCurrentStack: (stack) => set({ currentStack: stack, currentIndex: 0 }),

      nextCard: () => set((state) => ({
        currentIndex: Math.min(state.currentIndex + 1, state.currentStack.length - 1)
      })),

      previousCard: () => set((state) => ({
        currentIndex: Math.max(state.currentIndex - 1, 0)
      })),

      likeIP: (ip) => set((state) => {
        const isAlreadyLiked = state.likedIPs.some((liked) => liked.id === ip.id)
        if (isAlreadyLiked) return state

        return {
          likedIPs: [ip, ...state.likedIPs]
        }
      }),

      unlikeIP: (ipId) => set((state) => ({
        likedIPs: state.likedIPs.filter((ip) => ip.id !== ipId)
      })),

      isLiked: (ipId) => {
        return get().likedIPs.some((ip) => ip.id === ipId)
      },

      addSwipeAction: (action) => set((state) => ({
        swipeHistory: [...state.swipeHistory.slice(-9), action] // Keep last 10 actions
      })),

      undoLastSwipe: () => {
        const state = get()
        const lastAction = state.swipeHistory[state.swipeHistory.length - 1]

        if (!lastAction) return null

        // Find the IP from the last action
        const ip = state.currentStack.find((ip) => ip.id === lastAction.ipAssetId)

        if (lastAction.type === 'like' && ip) {
          get().unlikeIP(lastAction.ipAssetId)
        }

        set((state) => ({
          swipeHistory: state.swipeHistory.slice(0, -1),
          currentIndex: Math.max(0, state.currentIndex - 1)
        }))

        return ip || null
      },

      reset: () => set({
        currentStack: [],
        currentIndex: 0,
        swipeHistory: []
      })
    }),
    {
      name: 'ip-store',
      partialize: (state) => ({
        likedIPs: state.likedIPs
      })
    }
  )
)
