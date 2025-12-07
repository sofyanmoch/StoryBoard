'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { Heart, X, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { type IPAsset } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { formatPrice, formatDate } from '@/lib/utils'
import { SWIPE_THRESHOLD, SWIPE_ROTATION_MULTIPLIER, SPRING_CONFIG } from '@/lib/constants'
import { IPImage } from '../IPImage'

interface SwipeCardProps {
  ipAsset: IPAsset
  onSwipeLeft?: (ipAsset: IPAsset) => void
  onSwipeRight?: (ipAsset: IPAsset) => void
  onTap?: (ipAsset: IPAsset) => void
  isTop?: boolean
  style?: any
}

export function SwipeCard({
  ipAsset,
  onSwipeLeft,
  onSwipeRight,
  onTap,
  isTop = false,
  style
}: SwipeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = SWIPE_THRESHOLD

    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        // Swipe right - Like
        onSwipeRight?.(ipAsset)
      } else {
        // Swipe left - Skip
        onSwipeLeft?.(ipAsset)
      }
    }
  }

  const minPrice = Math.min(...ipAsset.licenses.map((l) => Number(l.price)))
  const isFree = minPrice === 0

  console.log(ipAsset, 'ipAsset in SwipeCard')

  return (
    <motion.div
      ref={cardRef}
      className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
      style={{
        x,
        y,
        rotate,
        opacity,
        ...style
      }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={1}
      onDragEnd={handleDragEnd}
      onClick={() => onTap?.(ipAsset)}
      whileTap={{ scale: 0.95 }}
      transition={SPRING_CONFIG}
    >
      <div className="w-full max-w-sm aspect-[3/4] rounded-3xl bg-secondary/40 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl relative">
        {/* Image/Preview */}
        <div className="absolute inset-0">
          {ipAsset.type === 'image' && (
            <IPImage
              src={ipAsset.preview.thumbnailUrl.cachedUrl}
              alt={ipAsset.title}
              fill
              className="object-cover"
              fallbackType='gradient'
            />
          )}
          {ipAsset.type === 'music' && (
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                  </svg>
                </div>
                <p className="text-white/60 text-sm">Music Track</p>
              </div>
            </div>
          )}
          {(ipAsset.type === 'text' || ipAsset.type === 'video') && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <p className="text-white/60 capitalize">{ipAsset.type} Asset</p>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        {/* Top badges */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
          <div className="flex flex-wrap gap-2">
            <Badge variant={isFree ? 'success' : 'primary'}>
              {formatPrice(minPrice.toString())}
            </Badge>
            <Badge variant="default">{ipAsset.collection}</Badge>
          </div>
          <Badge variant="accent">{ipAsset.type}</Badge>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <h2 className="text-2xl font-bold text-white mb-2">{ipAsset.title}</h2>
          <p className="text-white/80 text-sm mb-3 line-clamp-2">{ipAsset.description}</p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden">
                {ipAsset.creator.avatar && (
                  <Image
                    src={ipAsset.creator.avatar}
                    alt={ipAsset.creator.name}
                    width={32}
                    height={32}
                  />
                )}
              </div>
              <div>
                <p className="text-white text-sm font-medium">{ipAsset.creator.name}</p>
                <p className="text-white/60 text-xs">{formatDate(ipAsset.metadata.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-white/60 text-sm">
              <span className="flex items-center gap-1">
                <Heart size={14} />
                {ipAsset.metadata.likes}
              </span>
              <span>{ipAsset.metadata.views} views</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {ipAsset.metadata.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/80"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Swipe indicators */}
        <motion.div
          className="absolute top-1/2 left-8 -translate-y-1/2 w-20 h-20 rounded-full bg-red-500/20 border-4 border-red-500 flex items-center justify-center pointer-events-none"
          style={{ opacity: useTransform(x, [-200, -50, 0], [1, 0.5, 0]) }}
        >
          <X size={40} className="text-red-500" />
        </motion.div>

        <motion.div
          className="absolute top-1/2 right-8 -translate-y-1/2 w-20 h-20 rounded-full bg-success/20 border-4 border-success flex items-center justify-center pointer-events-none"
          style={{ opacity: useTransform(x, [0, 50, 200], [0, 0.5, 1]) }}
        >
          <Heart size={40} className="text-success" fill="currentColor" />
        </motion.div>
      </div>
    </motion.div>
  )
}
