// components/IPImage.tsx
'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ImageOff } from 'lucide-react'

interface IPImageProps {
  src: string
  alt: string
  fill?: boolean
  className?: string
  fallbackType?: 'gradient' | 'icon' | 'initials'
  title?: string // Untuk initials fallback
}

export function IPImage({ 
  src, 
  alt, 
  fill = true, 
  className = '',
  fallbackType = 'gradient',
  title = ''
}: IPImageProps) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  // Generate gradient berdasarkan string
  const generateGradient = (str: string) => {
    const colors = [
      ['#FF6B35', '#7C3AED'],
      ['#3B82F6', '#8B5CF6'],
      ['#10B981', '#3B82F6'],
      ['#F59E0B', '#EF4444'],
      ['#EC4899', '#8B5CF6'],
      ['#06B6D4', '#3B82F6'],
    ]
    const index = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    return colors[index]
  }

  const [color1, color2] = generateGradient(alt || title || 'default')

  // Get initials
  const getInitials = (text: string) => {
    return text
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (error || !src || src === '') {
    // ✅ Render fallback
    return (
      <div 
        className={`relative flex items-center justify-center ${className}`}
        style={fill ? { position: 'absolute', inset: 0 } : {}}
      >
        {fallbackType === 'gradient' && (
          <div 
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`
            }}
          >
            {/* Optional: Add pattern overlay */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}
            />
          </div>
        )}

        {fallbackType === 'icon' && (
          <div className="w-full h-full bg-story-secondary flex items-center justify-center">
            <ImageOff className="w-12 h-12 text-story-muted" />
          </div>
        )}

        {fallbackType === 'initials' && (
          <div 
            className="w-full h-full flex items-center justify-center text-white font-display font-bold text-4xl"
            style={{
              background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`
            }}
          >
            {getInitials(title || alt)}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={fill ? { position: 'absolute', inset: 0 } : {}}>
      {/* Loading skeleton */}
      {loading && (
        <div className="absolute inset-0 bg-story-secondary animate-pulse" />
      )}

      <Image
        src={src}
        alt={alt}
        fill={fill}
        className={`object-cover transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
        onError={() => setError(true)}
        onLoad={() => setLoading(false)}
        unoptimized // Untuk external URLs
      />
    </div>
  )
}