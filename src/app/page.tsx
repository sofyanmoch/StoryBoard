'use client'

import { useEffect, useMemo } from 'react'
import { TopBar } from '@/components/navigation/TopBar'
import { BottomNav } from '@/components/navigation/BottomNav'
import { FilterBar } from '@/components/filters/FilterBar'
import { FilterModal } from '@/components/filters/FilterModal'
import { SwipeStack } from '@/components/swipe/SwipeStack'
import { IPDetailModal } from '@/components/modals/IPDetailModal'
import { LicenseModal } from '@/components/modals/LicenseModal'
import { mockIPAssets, filterIPAssets } from '@/data/mockIPAssets'
import { useFilterStore } from '@/store/useFilterStore'
import { useIPStore } from '@/store/useIPStore'
import { IPCardSkeleton } from '@/components/ui/Skeleton'

export default function HomePage() {
  const { filters } = useFilterStore()
  const { setCurrentStack } = useIPStore()

  const filteredAssets = useMemo(() => {
    return filterIPAssets(mockIPAssets, filters)
  }, [filters])

  useEffect(() => {
    setCurrentStack(filteredAssets)
  }, [filteredAssets, setCurrentStack])

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar title="StoryBoard" showUndo />
      <FilterBar />

      {/* Main Content */}
      <main className="flex-1 relative pb-20">
        <div className="max-w-screen-xl mx-auto h-full px-4 py-8">
          {filteredAssets.length > 0 ? (
            <div className="relative w-full h-[calc(100vh-280px)] min-h-[500px]">
              <SwipeStack ipAssets={filteredAssets} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-xl text-white mb-2">No IP assets found</p>
                <p className="text-muted">Try adjusting your filters</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <BottomNav />

      {/* Modals */}
      <IPDetailModal />
      <LicenseModal />
      <FilterModal />
    </div>
  )
}
