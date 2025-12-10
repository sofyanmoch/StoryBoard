'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Coins, TrendingUp, Info, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { calculateRoyaltyTokens, formatRoyaltyTokens } from '@/hooks/useRoyaltyShares'
import { useRoyaltyStore } from '@/store/useRoyaltyStore'
import { type IPAsset } from '@/types'

interface SharesModalProps {
  isOpen: boolean
  onClose: () => void
  ipAsset: IPAsset | null
}

export function SharesModal({ isOpen, onClose, ipAsset }: SharesModalProps) {
  const { addHolding } = useRoyaltyStore()
  const [sharePercentage, setSharePercentage] = useState(5)
  const [isAcquiring, setIsAcquiring] = useState(false)

  if (!ipAsset) return null

  const royaltyTokens = calculateRoyaltyTokens(sharePercentage)

  const handleAcquire = async () => {
    setIsAcquiring(true)

    try {
      toast.loading('Acquiring royalty tokens...', { id: 'acquire-shares' })

      // Simulate token acquisition
      // In production, this would be a real transaction
      await new Promise(resolve => setTimeout(resolve, 1500))

      const holding = {
        id: `holding-${Date.now()}`,
        ipAssetId: ipAsset.id,
        ipAsset: ipAsset,
        sharePercentage: sharePercentage,
        royaltyTokens: royaltyTokens,
        vaultAddress: ipAsset.ipId,
        acquiredAt: new Date().toISOString(),
        totalClaimed: '0'
      }

      addHolding(holding)

      toast.success(
        `Successfully acquired ${sharePercentage}% royalty share!`,
        { id: 'acquire-shares' }
      )

      onClose()
      setSharePercentage(5) // Reset

    } catch (error: any) {
      console.error('Failed to acquire shares:', error)
      toast.error(error.message || 'Failed to acquire shares', { id: 'acquire-shares' })
    } finally {
      setIsAcquiring(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <Coins size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Get Royalty Shares</h2>
              <p className="text-white/60 text-sm">Earn from IP revenue</p>
            </div>
          </div>
        </div>

        {/* IP Info */}
        <div className="mb-6 p-4 bg-white/5 rounded-xl">
          <h3 className="text-white font-medium mb-1">{ipAsset.title}</h3>
          <p className="text-white/60 text-sm mb-2">{ipAsset.description}</p>
          <div className="flex gap-2">
            <Badge variant="primary">{ipAsset.type}</Badge>
            {ipAsset.collection && (
              <Badge variant="default">{ipAsset.collection}</Badge>
            )}
          </div>
        </div>

        {/* Share Selection */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-3">
            Select Royalty Share
          </label>

          <div className="relative mb-4">
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={sharePercentage}
              onChange={(e) => setSharePercentage(parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
              disabled={isAcquiring}
            />
            <div className="flex justify-between mt-2">
              <span className="text-white/40 text-sm">1%</span>
              <span className="text-accent font-bold text-xl">{sharePercentage}%</span>
              <span className="text-white/40 text-sm">30%</span>
            </div>
          </div>

          {/* Token Details */}
          <div className="space-y-3 p-4 bg-white/5 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/60">
                <TrendingUp size={16} />
                <span className="text-sm">Royalty Tokens</span>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">
                  {formatRoyaltyTokens(royaltyTokens)}
                </div>
                <div className="text-white/40 text-xs">
                  {royaltyTokens.toLocaleString()} tokens
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/60">
                <Sparkles size={16} />
                <span className="text-sm">Revenue Share</span>
              </div>
              <span className="text-accent font-bold">{sharePercentage}%</span>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-xl">
          <div className="flex gap-3">
            <Info size={20} className="text-accent flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-medium mb-1">How Royalty Shares Work</h4>
              <p className="text-white/70 text-sm mb-2">
                Royalty tokens represent fractional ownership of this IP asset.
                You&apos;ll receive {sharePercentage}% of all revenue generated from:
              </p>
              <ul className="text-white/60 text-sm space-y-1 ml-4">
                <li>• Licensing fees</li>
                <li>• Derivative IP usage</li>
                <li>• Commercial exploitation</li>
                <li>• Secondary sales</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mb-6 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-white/70 text-xs text-center">
            <strong className="text-primary">Demo Mode:</strong> This simulates acquiring royalty tokens.
            In production, this would be a real blockchain transaction distributing
            tokens from Story Protocol&apos;s royalty vault.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={onClose}
            disabled={isAcquiring}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleAcquire}
            disabled={isAcquiring}
          >
            {isAcquiring ? (
              'Processing...'
            ) : (
              <>
                <Coins size={18} className="mr-2" />
                Get {sharePercentage}% Share
              </>
            )}
          </Button>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #C239B3 0%, #FF6B9D 100%);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(194, 57, 179, 0.5);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #C239B3 0%, #FF6B9D 100%);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(194, 57, 179, 0.5);
        }
      `}</style>
    </Modal>
  )
}
