'use client'

import { useRoyaltyStore } from '@/store/useRoyaltyStore'
import { useUIStore } from '@/store/useUIStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { IPImage } from '@/components/IPImage'
import { Coins, TrendingUp, DollarSign, Eye, Sparkles, Wallet } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { formatRoyaltyTokens } from '@/hooks/useRoyaltyShares'
import { BottomNav } from '@/components/navigation/BottomNav'

export default function RoyaltyPage() {
  const { holdings, getTotalShares, getTotalTokens } = useRoyaltyStore()
  const { openIPDetailModal } = useUIStore()

  const totalShares = getTotalShares()
  const totalTokens = getTotalTokens()

  return (
    <div className="min-h-screen bg-dark pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-dark/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Royalty Holdings</h1>
              <p className="text-white/60 text-sm">Your IP revenue shares</p>
            </div>
            <div className="flex items-center gap-2">
              <Coins size={20} className="text-accent" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Coins size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-white/60 text-xs">Total Holdings</p>
                <p className="text-white font-bold text-lg">{holdings.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <TrendingUp size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-white/60 text-xs">Total Shares</p>
                <p className="text-white font-bold text-lg">{totalShares.toFixed(1)}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                <Sparkles size={20} className="text-success" />
              </div>
              <div>
                <p className="text-white/60 text-xs">Royalty Tokens</p>
                <p className="text-white font-bold text-lg">
                  {formatRoyaltyTokens(totalTokens)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Holdings List */}
        {holdings.length === 0 ? (
          <EmptyState
            icon={<Coins size={64} />}
            title="No royalty holdings yet"
            description="Start acquiring royalty shares to earn from IP revenue"
          />
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">Your Holdings</h2>
            {holdings.map((holding) => (
              <Card key={holding.id} className="p-4 hover:bg-white/10 transition-colors">
                <div className="flex gap-4">
                  {/* Preview Image */}
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-dark flex-shrink-0">
                    {holding.ipAsset.type === 'image' ? (
                      <IPImage
                        src={holding.ipAsset.preview.thumbnailUrl.cachedUrl}
                        alt={holding.ipAsset.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                        <span className="text-white/60 text-xs capitalize">
                          {holding.ipAsset.type}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium mb-1 truncate">
                          {holding.ipAsset.title}
                        </h3>
                        <p className="text-white/60 text-sm line-clamp-1">
                          {holding.ipAsset.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openIPDetailModal(holding.ipAsset)}
                      >
                        <Eye size={16} />
                      </Button>
                    </div>

                    {/* Holding Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                      <div>
                        <p className="text-white/40 text-xs mb-1">Share</p>
                        <div className="flex items-center gap-1">
                          <TrendingUp size={12} className="text-accent" />
                          <span className="text-white font-bold text-sm">
                            {holding.sharePercentage}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-white/40 text-xs mb-1">Tokens</p>
                        <div className="flex items-center gap-1">
                          <Coins size={12} className="text-primary" />
                          <span className="text-white font-bold text-sm">
                            {formatRoyaltyTokens(holding.royaltyTokens)}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-white/40 text-xs mb-1">Claimed</p>
                        <div className="flex items-center gap-1">
                          <DollarSign size={12} className="text-success" />
                          <span className="text-white font-bold text-sm">
                            {holding.totalClaimed || '0'} ETH
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-white/40 text-xs mb-1">Acquired</p>
                        <span className="text-white font-medium text-sm">
                          {formatDate(holding.acquiredAt)}
                        </span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="primary">{holding.ipAsset.type}</Badge>
                      {holding.ipAsset.collection && (
                        <Badge variant="default">{holding.ipAsset.collection}</Badge>
                      )}
                      {holding.vaultAddress && (
                        <Badge variant="accent" className="flex items-center gap-1">
                          <Wallet size={10} />
                          <span className="text-xs">Vault Active</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Info Section */}
        <Card className="p-6 mt-6 bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Coins size={24} className="text-accent" />
            </div>
            <div>
              <h3 className="text-white font-bold mb-2">About Royalty Shares</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-3">
                Royalty shares represent fractional ownership of IP assets on Story Protocol.
                Each share gives you proportional revenue from:
              </p>
              <ul className="text-white/70 text-sm space-y-1 ml-4">
                <li>• Licensing fees and commercial use</li>
                <li>• Derivative works and remixes</li>
                <li>• Secondary market transactions</li>
                <li>• Any revenue generated by the IP</li>
              </ul>
              <div className="mt-4 p-3 bg-white/5 rounded-lg">
                <p className="text-white/60 text-xs">
                  <strong className="text-accent">Powered by Story Protocol:</strong> Royalty tokens
                  are ERC-20 tokens from Story&apos;s royalty vault system. Hold tokens to earn
                  proportional revenue automatically.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

    <BottomNav />
    </div>
  )
}
