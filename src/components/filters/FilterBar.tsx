'use client'

import { Filter, RotateCcw } from 'lucide-react'
import { IconButton } from '@/components/ui/IconButton'
import { Badge } from '@/components/ui/Badge'
import { useFilterStore } from '@/store/useFilterStore'
import { useUIStore } from '@/store/useUIStore'
import { IP_ASSET_TYPES, COLLECTIONS } from '@/lib/constants'

export function FilterBar() {
  const { filters, resetFilters } = useFilterStore()
  const { toggleFilterModal } = useUIStore()

  const activeFiltersCount = [
    filters.type !== 'all',
    filters.collection !== 'all',
    filters.license !== 'all',
    filters.sort !== 'newest'
  ].filter(Boolean).length

  const getFilterLabel = () => {
    const labels = []

    if (filters.type !== 'all') {
      const type = IP_ASSET_TYPES.find((t) => t.value === filters.type)
      labels.push(type?.label)
    }

    if (filters.collection !== 'all') {
      labels.push(filters.collection)
    }

    if (filters.license !== 'all') {
      labels.push(filters.license)
    }

    return labels.length > 0 ? labels.join(', ') : 'All IP Assets'
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-secondary/40 backdrop-blur-xl border-b border-white/10">
      <button
        onClick={toggleFilterModal}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white"
      >
        <Filter size={18} />
        <span className="text-sm font-medium">{getFilterLabel()}</span>
        {activeFiltersCount > 0 && (
          <Badge variant="primary" className="ml-1">
            {activeFiltersCount}
          </Badge>
        )}
      </button>

      {activeFiltersCount > 0 && (
        <IconButton
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          title="Reset filters"
        >
          <RotateCcw size={16} />
        </IconButton>
      )}

      <div className="ml-auto text-white/60 text-sm">
        Sort: <span className="text-white capitalize">{filters.sort.replace('-', ' ')}</span>
      </div>
    </div>
  )
}
