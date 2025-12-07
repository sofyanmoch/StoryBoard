'use client'

import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = 'ghost', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95'

    const variants = {
      primary: 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20',
      secondary: 'bg-secondary text-white hover:bg-secondary/90',
      ghost: 'bg-white/10 text-white hover:bg-white/20',
    }

    const sizes = {
      sm: 'w-9 h-9 min-w-[36px] min-h-[36px]',
      md: 'w-11 h-11 min-w-[44px] min-h-[44px]',
      lg: 'w-14 h-14 min-w-[56px] min-h-[56px]',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'
