'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-white/5',
        className
      )}
    />
  )
}

export function IPCardSkeleton() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-full max-w-sm aspect-[3/4] rounded-3xl bg-secondary/40 backdrop-blur-xl border border-white/10 p-6">
        <Skeleton className="w-full h-full rounded-2xl" />
      </div>
    </div>
  )
}
