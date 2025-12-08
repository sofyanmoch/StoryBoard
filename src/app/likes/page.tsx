'use client'

import { TopBar } from '@/components/navigation/TopBar'
import { BottomNav } from '@/components/navigation/BottomNav'
import { IPDetailModal } from '@/components/modals/IPDetailModal'
import { LicenseModal } from '@/components/modals/LicenseModal'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { EmptyState } from '@/components/ui/EmptyState'
import { Badge } from '@/components/ui/Badge'
import { Heart, Trash2, Zap } from 'lucide-react'
import Image from 'next/image'
import { useIPStore } from '@/store/useIPStore'
import { useUIStore } from '@/store/useUIStore'
import { useLicenseStore } from '@/store/useLicenseStore'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'
import { IPImage } from '@/components/IPImage'

export default function LikesPage() {
  const { likedIPs, unlikeIP } = useIPStore()
  const { openIPDetailModal, openLicenseModal } = useUIStore()
  const { hasLicense } = useLicenseStore()

  const handleUnlike = (ipId: string, title: string) => {
    unlikeIP(ipId)
    toast('Removed from likes', { description: `${title} was removed` })
  }

  const handleQuickLicense = (ip: any) => {
    const cheapestLicense = ip.licenses.reduce((prev: any, current: any) =>
      Number(prev.price) < Number(current.price) ? prev : current
    )
    openLicenseModal(ip, cheapestLicense.type)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar title="My Likes" />

      {/* Main Content */}
      <main className="flex-1 pb-20">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          {likedIPs.length > 0 ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-white/60">
                  {likedIPs.length} {likedIPs.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {likedIPs.map((ip) => {
                  const minPrice = Math.min(...ip.licenses.map((l) => Number(l.price)))
                  const isFree = minPrice === 0
                  const isLicensed = hasLicense(ip.id)

                  return (
                    <Card key={ip.id} glass className="group overflow-hidden">
                      {/* Image */}
                      <div
                        className="relative aspect-square cursor-pointer"
                        onClick={() => openIPDetailModal(ip)}
                      >
                        {ip.type === 'image' && (
                          <IPImage
                            src={ip.preview.thumbnailUrl.cachedUrl || ip.preview.url}
                            alt={ip.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        )}
                        {ip.type === 'music' && (
                          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                            </svg>
                          </div>
                        )}

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex gap-2">
                          <Badge variant={isFree ? 'success' : 'primary'}>
                            {formatPrice(minPrice.toString())}
                          </Badge>
                          {isLicensed && (
                            <Badge variant="success">Licensed</Badge>
                          )}
                        </div>

                        {/* Remove button */}
                        <IconButton
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-sm hover:bg-red-500/50"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleUnlike(ip.id, ip.title)
                          }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="text-white font-semibold mb-1 line-clamp-1">
                          {ip.title}
                        </h3>
                        <p className="text-white/60 text-sm mb-3">{ip.creator.name}</p>

                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full"
                          onClick={() => handleQuickLicense(ip)}
                          disabled={isLicensed}
                        >
                          {isLicensed ? (
                            'Already Licensed'
                          ) : (
                            <>
                              <Zap size={16} className="mr-1" />
                              Quick License
                            </>
                          )}
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </>
          ) : (
            <EmptyState
              icon={<Heart size={64} />}
              title="No Liked IPs Yet"
              description="Swipe right on IP assets to add them to your likes"
              action={
                <Button variant="primary" onClick={() => window.location.href = '/'}>
                  Start Discovering
                </Button>
              }
            />
          )}
        </div>
      </main>

      <BottomNav />

      {/* Modals */}
      <IPDetailModal />
      <LicenseModal />
    </div>
  )
}
