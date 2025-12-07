'use client'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Check } from 'lucide-react'
import { useFilterStore } from '@/store/useFilterStore'
import { useUIStore } from '@/store/useUIStore'
import { IP_ASSET_TYPES, COLLECTIONS } from '@/lib/constants'
import { type FilterOptions } from '@/types'

export function FilterModal() {
  const { filters, setFilter, resetFilters } = useFilterStore()
  const { isFilterModalOpen, closeFilterModal } = useUIStore()

  const handleApply = () => {
    closeFilterModal()
  }

  const handleReset = () => {
    resetFilters()
    closeFilterModal()
  }

  return (
    <Modal
      isOpen={isFilterModalOpen}
      onClose={closeFilterModal}
      title="Filter & Sort"
      size="md"
    >
      <div className="p-6 space-y-6">
        {/* Type Filter */}
        <div>
          <h3 className="text-white font-medium mb-3">Type</h3>
          <div className="grid grid-cols-2 gap-2">
            {IP_ASSET_TYPES.map((type) => {
              const isSelected = filters.type === type.value
              return (
                <button
                  key={type.value}
                  onClick={() => setFilter('type', type.value as FilterOptions['type'])}
                  className={`p-3 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-primary/20 border-2 border-primary'
                      : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-primary bg-primary' : 'border-white/30'
                    }`}>
                      {isSelected && <Check size={12} className="text-white" />}
                    </div>
                    <span className="text-white text-sm">{type.label}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Collection Filter */}
        <div>
          <h3 className="text-white font-medium mb-3">Collection</h3>
          <div className="grid grid-cols-2 gap-2">
            {COLLECTIONS.map((collection) => {
              const isSelected = filters.collection === collection.value
              return (
                <button
                  key={collection.value}
                  onClick={() => setFilter('collection', collection.value as FilterOptions['collection'])}
                  className={`p-3 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-primary/20 border-2 border-primary'
                      : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-primary bg-primary' : 'border-white/30'
                    }`}>
                      {isSelected && <Check size={12} className="text-white" />}
                    </div>
                    <span className="text-white text-sm">{collection.label}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* License Filter */}
        <div>
          <h3 className="text-white font-medium mb-3">License</h3>
          <div className="grid grid-cols-3 gap-2">
            {['all', 'free', 'paid'].map((license) => {
              const isSelected = filters.license === license
              return (
                <button
                  key={license}
                  onClick={() => setFilter('license', license as FilterOptions['license'])}
                  className={`p-3 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-primary/20 border-2 border-primary'
                      : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-primary bg-primary' : 'border-white/30'
                    }`}>
                      {isSelected && <Check size={12} className="text-white" />}
                    </div>
                    <span className="text-white text-sm capitalize">{license}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Sort */}
        <div>
          <h3 className="text-white font-medium mb-3">Sort By</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'newest', label: 'Newest' },
              { value: 'popular', label: 'Most Popular' },
              { value: 'price-low', label: 'Price: Low to High' },
              { value: 'price-high', label: 'Price: High to Low' }
            ].map((sort) => {
              const isSelected = filters.sort === sort.value
              return (
                <button
                  key={sort.value}
                  onClick={() => setFilter('sort', sort.value as FilterOptions['sort'])}
                  className={`p-3 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-primary/20 border-2 border-primary'
                      : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-primary bg-primary' : 'border-white/30'
                    }`}>
                      {isSelected && <Check size={12} className="text-white" />}
                    </div>
                    <span className="text-white text-sm">{sort.label}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-white/10">
          <Button variant="secondary" className="flex-1" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="primary" className="flex-1" onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </div>
    </Modal>
  )
}
