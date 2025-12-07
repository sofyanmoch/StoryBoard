'use client'

import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'accent'
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-white/10 text-white',
    primary: 'bg-primary/20 text-primary border-primary/30',
    success: 'bg-success/20 text-success border-success/30',
    accent: 'bg-accent/20 text-accent border-accent/30',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
