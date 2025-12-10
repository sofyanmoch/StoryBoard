'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Heart, FileText, Wallet, Coins } from 'lucide-react'
import { ConnectKitButton } from 'connectkit'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', icon: Home, label: 'Discover' },
  { href: '/likes', icon: Heart, label: 'Likes' },
  { href: '/royalty', icon: Coins, label: 'Royalty' },
  { href: '/licenses', icon: FileText, label: 'Licenses' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-secondary/95 backdrop-blur-xl border-t border-white/10 safe-area-inset-bottom">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 min-w-[64px] h-full transition-colors',
                  isActive ? 'text-primary' : 'text-white/60 hover:text-white'
                )}
              >
                <Icon size={24} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}

          {/* Wallet Button */}
          <ConnectKitButton.Custom>
            {({ isConnected, show, address }) => (
              <button
                onClick={show}
                className="flex flex-col items-center justify-center gap-1 min-w-[64px] h-full text-white/60 hover:text-white transition-colors"
              >
                <Wallet size={24} />
                <span className="text-xs font-medium">
                  {isConnected ? 'Wallet' : 'Connect'}
                </span>
              </button>
            )}
          </ConnectKitButton.Custom>
        </div>
      </div>
    </nav>
  )
}
