import { create } from 'zustand'
import { type FilterOptions } from '@/types'

interface FilterStore {
  filters: FilterOptions
  setFilter: <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => void
  resetFilters: () => void
}

const defaultFilters: FilterOptions = {
  type: 'all',
  collection: 'all',
  license: 'all',
  sort: 'newest'
}

export const useFilterStore = create<FilterStore>((set) => ({
  filters: defaultFilters,

  setFilter: (key, value) => set((state) => ({
    filters: {
      ...state.filters,
      [key]: value
    }
  })),

  resetFilters: () => set({ filters: defaultFilters })
}))
