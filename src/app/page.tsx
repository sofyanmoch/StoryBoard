'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import { TopBar } from '@/components/navigation/TopBar'
import { BottomNav } from '@/components/navigation/BottomNav'
import { FilterBar } from '@/components/filters/FilterBar'
import { FilterModal } from '@/components/filters/FilterModal'
import { SwipeStack } from '@/components/swipe/SwipeStack'
import { IPDetailModal } from '@/components/modals/IPDetailModal'
import { LicenseModal } from '@/components/modals/LicenseModal'
import { RemixModal } from '@/components/modals/RemixModal'
import { useFilterStore } from '@/store/useFilterStore'
import { useIPStore } from '@/store/useIPStore'
import { useRealIPAssets } from '@/hooks/useRealIPAssets'
import { IPCardSkeleton } from '@/components/ui/Skeleton'
import { type IPAsset } from '@/types'

export default function HomePage() {
  const { filters } = useFilterStore()
  const { setCurrentStack, currentStack } = useIPStore()
  const [currentPage, setCurrentPage] = useState(0)
  const [allIPAssets, setAllIPAssets] = useState<IPAsset[]>([])
  const [hasMore, setHasMore] = useState(true)

  const { data: ipAssets = [], isLoading } = useRealIPAssets(currentPage)

  // Accumulate IP assets from all pages
  useEffect(() => {
 
    if (ipAssets.length > 0) {
      setAllIPAssets((prev) => {
        // Check if we already have these IPs to avoid duplicates
        const newIPs = ipAssets.filter(
          (newIP) => !prev.some((existingIP) => existingIP.id === newIP.id)
        )
        return [...prev, ...newIPs]
      })

      // If we got less than 50 IPs, we've reached the end
      if (ipAssets.length < 50) {
        setHasMore(false)
      }
    } else if (!isLoading && currentPage > 0) {
      // No more IPs available
      setHasMore(false)
    }
  }, [ipAssets, isLoading, currentPage])

  // Filter assets based on current filters
  const filteredAssets = useMemo(() => {
    return allIPAssets;
  }, [allIPAssets, filters])

  const filteredKey = useMemo(() => {
    return filteredAssets.map(ip => ip.id).join(',')
  }, [filteredAssets])

  // Update current stack when filtered assets change
  useEffect(() => {
    if (filteredAssets.length > 0) {
      setCurrentStack(filteredAssets)
    }
  }, [filteredKey, setCurrentStack])

  // Auto-load next page when running low on IPs
  useEffect(() => {
    // When we have less than 5 IPs left and we have more to load
    if (currentStack.length < 5 && hasMore && !isLoading && filteredAssets.length < 10) {
      console.log('🔄 Running low on IPs, loading next page...')
      setCurrentPage((prev) => prev + 1)
    }
  }, [currentStack.length, hasMore, isLoading, filteredAssets.length])

  // Manual trigger to load more (can be called when all IPs are swiped)
  const loadNextPage = useCallback(() => {
    if (hasMore && !isLoading) {
      console.log('📄 Loading next page of IP assets...')
      setCurrentPage((prev) => prev + 1)
    }
  }, [hasMore, isLoading])

  // Detect when all IPs are swiped
  useEffect(() => {
    if (currentStack.length === 0 && allIPAssets.length > 0 && hasMore && !isLoading) {
      console.log('✅ All IPs swiped! Loading next page automatically...')
      loadNextPage()
    }
  }, [currentStack.length, allIPAssets.length, hasMore, isLoading, loadNextPage])

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar title="StoryBoard" showUndo />
      <FilterBar />

      {/* Main Content */}
      <main className="flex-1 relative pb-20">
        <div className="max-w-screen-xl mx-auto h-full px-4 py-8">
          {isLoading && allIPAssets.length === 0 ? (
            <div className="relative w-full h-[calc(100vh-280px)] min-h-[500px]">
              <IPCardSkeleton />
            </div>
          ) : filteredAssets.length > 0 ? (
            <div className="relative w-full h-[calc(100vh-280px)] min-h-[500px]">
              <SwipeStack ipAssets={filteredAssets} />

              {/* Loading indicator for pagination */}
              {isLoading && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-dark/80 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                    Loading more IPs...
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-xl text-white mb-2">
                  {allIPAssets.length === 0 ? 'No IP assets found' : 'No more IP assets'}
                </p>
                <p className="text-muted">
                  {allIPAssets.length === 0
                    ? 'Loading IP assets from Story Protocol...'
                    : hasMore
                    ? 'Try adjusting your filters'
                    : "You've seen all available IP assets!"}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <BottomNav />

      {/* Modals */}
      <IPDetailModal />
      <LicenseModal />
      <RemixModal />
      <FilterModal />
    </div>
  )
}
