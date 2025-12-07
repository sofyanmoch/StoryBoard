'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SwipeCard } from './SwipeCard'
import { type IPAsset } from '@/types'
import { useIPStore } from '@/store/useIPStore'
import { useUIStore } from '@/store/useUIStore'
import { toast } from 'sonner'

interface SwipeStackProps {
  ipAssets: IPAsset[]
}

export function SwipeStack({ ipAssets }: SwipeStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)

  const { likeIP, addSwipeAction } = useIPStore()
  const { openIPDetailModal } = useUIStore()

  useEffect(() => {
    setCurrentIndex(0)
  }, [ipAssets])

  const handleSwipeLeft = (ipAsset: IPAsset) => {
    setDirection('left')
    addSwipeAction({ type: 'skip', ipAssetId: ipAsset.id, timestamp: Date.now() })
    toast('Skipped', { description: `${ipAsset.title} was skipped` })

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1)
      setDirection(null)
    }, 300)
  }

  const handleSwipeRight = (ipAsset: IPAsset) => {
    setDirection('right')
    likeIP(ipAsset)
    addSwipeAction({ type: 'like', ipAssetId: ipAsset.id, timestamp: Date.now() })
    toast.success('Liked!', { description: `${ipAsset.title} added to your likes` })

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1)
      setDirection(null)
    }, 300)
  }

  const handleTap = (ipAsset: IPAsset) => {
    openIPDetailModal(ipAsset)
  }

  const visibleCards = ipAssets.slice(currentIndex, currentIndex + 3)

  if (currentIndex >= ipAssets.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="w-24 h-24 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center"
          >
            <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h3 className="text-xl font-bold text-white mb-2">All Done!</h3>
          <p className="text-muted">You&apos;ve seen all available IP assets</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="popLayout">
        {visibleCards.map((ipAsset, index) => {
          const isTop = index === 0
          const offset = index * 8
          const scale = 1 - index * 0.05

          return (
            <motion.div
              key={ipAsset.id}
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{
                scale,
                opacity: 1,
                y: offset,
                zIndex: visibleCards.length - index
              }}
              exit={{
                x: direction === 'left' ? -500 : direction === 'right' ? 500 : 0,
                opacity: 0,
                transition: { duration: 0.3 }
              }}
              className="absolute inset-0"
            >
              <SwipeCard
                ipAsset={ipAsset}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                onTap={handleTap}
                isTop={isTop}
              />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
