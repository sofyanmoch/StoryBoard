'use client'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { Badge } from '@/components/ui/Badge'
import { Heart, Share2, ExternalLink, Music, Shuffle } from 'lucide-react'
import Image from 'next/image'
import { useUIStore } from '@/store/useUIStore'
import { useIPStore } from '@/store/useIPStore'
import { formatPrice, formatDate, getIPPortalUrl, shortenAddress } from '@/lib/utils'
import { toast } from 'sonner'
import { LICENSE_TYPES } from '@/lib/constants'
import { IPImage } from '../IPImage'

export function IPDetailModal() {
  const { isIPDetailModalOpen, selectedIP, closeIPDetailModal, openLicenseModal, openRemixModal } = useUIStore()
  const { likeIP, unlikeIP, isLiked } = useIPStore()

  if (!selectedIP) return null

  const liked = isLiked(selectedIP.id)
  const minPrice = Math.min(...selectedIP.licenses.map((l) => Number(l.price)))
  const isFree = minPrice === 0

  const handleLike = () => {
    if (liked) {
      unlikeIP(selectedIP.id)
      toast('Removed from likes')
    } else {
      likeIP(selectedIP)
      toast.success('Added to likes!')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedIP.title,
          text: selectedIP.description,
          url: window.location.href
        })
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const handleLicenseClick = (licenseType: any) => {
    closeIPDetailModal()
    openLicenseModal(selectedIP, licenseType)
  }

  return (
    <Modal isOpen={isIPDetailModalOpen} onClose={closeIPDetailModal} size="lg">
      <div className="grid md:grid-cols-2 gap-6 p-6">
        {/* Preview */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-dark">
          {selectedIP.type === 'image' && (
            <IPImage
              src={selectedIP.preview.thumbnailUrl.cachedUrl}
              alt={selectedIP.title}
              fill
              className="object-cover"
            />
          )}
          {selectedIP.type === 'music' && (
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center">
                  <Music size={64} className="text-white" />
                </div>
                <audio controls className="w-full px-8">
                  <source src={selectedIP.preview.url} type="audio/mpeg" />
                </audio>
              </div>
            </div>
          )}
          {(selectedIP.type === 'text' || selectedIP.type === 'video') && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <p className="text-white/60 capitalize">{selectedIP.type} Asset</p>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{selectedIP.title}</h2>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant={isFree ? 'success' : 'primary'}>
                    {formatPrice(minPrice.toString())}
                  </Badge>
                  {selectedIP.collection && (
                    <Badge variant="default">{selectedIP.collection}</Badge>
                  )}
                  <Badge variant="accent">{selectedIP.type}</Badge>
                </div>
              </div>
            </div>

            <p className="text-white/80 mb-4">{selectedIP.description}</p>

            {/* Actions */}
            <div className="flex gap-2">
              <IconButton
                variant={liked ? 'primary' : 'ghost'}
                onClick={handleLike}
              >
                <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
              </IconButton>
              <IconButton variant="ghost" onClick={handleShare}>
                <Share2 size={20} />
              </IconButton>
              {selectedIP.ipId && (
                <IconButton
                  variant="ghost"
                  onClick={() => window.open(getIPPortalUrl(selectedIP.ipId!), '_blank')}
                >
                  <ExternalLink size={20} />
                </IconButton>
              )}
            </div>
          </div>

          {/* Creator */}
          <div className="mb-6 p-4 bg-white/5 rounded-xl">
            <p className="text-white/60 text-sm mb-2">Creator</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/10 overflow-hidden">
                {selectedIP.creator.avatar && (
                  <Image
                    src={selectedIP.creator.avatar}
                    alt={selectedIP.creator.name}
                    width={48}
                    height={48}
                  />
                )}
              </div>
              <div>
                <p className="text-white font-medium">{selectedIP.creator.name}</p>
                <p className="text-white/60 text-sm">
                  {shortenAddress(selectedIP.creator.address)}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-white/5 rounded-xl">
            <div>
              <p className="text-white/60 text-sm mb-1">Likes</p>
              <p className="text-white font-bold text-lg">{selectedIP.metadata.likes}</p>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Views</p>
              <p className="text-white font-bold text-lg">{selectedIP.metadata.views}</p>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Created</p>
              <p className="text-white font-bold text-sm">{formatDate(selectedIP.metadata.createdAt)}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <p className="text-white/60 text-sm mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {selectedIP.metadata.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Licenses */}
          <div className="mt-auto">
            <p className="text-white font-medium mb-3">Available Licenses</p>
            <div className="space-y-2">
              {selectedIP.licenses.map((license) => {
                const licenseInfo = LICENSE_TYPES.find((t) => t.value === license.type)
                return (
                  <button
                    key={license.type}
                    onClick={() => handleLicenseClick(license.type)}
                    className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-left"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium">{licenseInfo?.label}</span>
                      <span className="text-primary font-bold">
                        {formatPrice(license.price)}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm">{licenseInfo?.description}</p>
                  </button>
                )
              })}
            </div>

            {/* Remix Button */}
            <div className="mt-4">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  closeIPDetailModal()
                  openRemixModal(selectedIP)
                }}
              >
                <Shuffle size={18} className="mr-2" />
                Remix This IP
              </Button>
              <p className="text-white/40 text-xs text-center mt-2">
                Create a derivative work based on this IP asset
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
