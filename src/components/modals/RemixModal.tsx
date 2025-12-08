'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Check, ExternalLink, Upload } from 'lucide-react'
import Image from 'next/image'
import { useUIStore } from '@/store/useUIStore'
import { useRemixIP } from '@/hooks/useStoryProtocol'
import { useAccount } from 'wagmi'
import { ConnectKitButton } from 'connectkit'
import { getExplorerUrl, getIPPortalUrl } from '@/lib/utils'
import { toast } from 'sonner'

export function RemixModal() {
  const { isRemixModalOpen, remixingIP, closeRemixModal } = useUIStore()
  const { isConnected } = useAccount()
  const { remix: remixIP } = useRemixIP()

  const [isRemixing, setIsRemixing] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [newIpId, setNewIpId] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Remix metadata
  const [nftContract, setNftContract] = useState('')
  const [tokenId, setTokenId] = useState('')
  const [metadataURI, setMetadataURI] = useState('')

  if (!remixingIP) return null

  const handleRemix = async () => {
    if (!nftContract || !tokenId) {
      toast.error('Please provide NFT contract and token ID')
      return
    }

    // Validate Ethereum address format
    if (!nftContract.startsWith('0x') || nftContract.length !== 42) {
      toast.error('Invalid NFT contract address')
      return
    }

    setIsRemixing(true)

    try {
      toast.info('Creating derivative IP asset...')

      const result = await remixIP(
        remixingIP.ipId as `0x${string}`,
        nftContract as `0x${string}`,
        tokenId,
        metadataURI || undefined
      )

      setTxHash(result.txHash)
      setNewIpId(result.childIpId)
      setSuccess(true)
      toast.success('Remix created successfully!')
    } catch (error: any) {
      console.error('Remix error:', error)
      toast.error('Failed to create remix', {
        description: error.message || 'Please try again'
      })
    } finally {
      setIsRemixing(false)
    }
  }

  const handleClose = () => {
    closeRemixModal()
    setTimeout(() => {
      setSuccess(false)
      setTxHash(null)
      setNewIpId(null)
      setNftContract('')
      setTokenId('')
      setMetadataURI('')
    }, 300)
  }

  return (
    <Modal
      isOpen={isRemixModalOpen}
      onClose={handleClose}
      title={success ? 'Remix Created!' : 'Remix IP Asset'}
      size="md"
    >
      <div className="p-6">
        {success ? (
          // Success state
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-success/20 rounded-full flex items-center justify-center">
              <Check size={40} className="text-success" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Remix Created!</h3>
            <p className="text-white/80 mb-6">
              You&apos;ve successfully created a derivative of <span className="font-semibold">{remixingIP.title}</span>
            </p>

            {newIpId && (
              <div className="mb-4 p-4 bg-white/5 rounded-xl">
                <p className="text-white/60 text-sm mb-2">New IP Asset ID</p>
                <p className="text-white font-mono text-sm break-all">{newIpId}</p>
              </div>
            )}

            <div className="flex gap-3 mb-6">
              {txHash && (
                <button
                  onClick={() => window.open(getExplorerUrl(txHash), '_blank')}
                  className="flex-1 inline-flex items-center justify-center gap-2 text-primary hover:text-primary/80"
                >
                  View Transaction
                  <ExternalLink size={16} />
                </button>
              )}
              {newIpId && (
                <button
                  onClick={() => window.open(getIPPortalUrl(newIpId), '_blank')}
                  className="flex-1 inline-flex items-center justify-center gap-2 text-primary hover:text-primary/80"
                >
                  View on Story
                  <ExternalLink size={16} />
                </button>
              )}
            </div>

            <Button
              variant="primary"
              className="w-full"
              onClick={handleClose}
            >
              Done
            </Button>
          </div>
        ) : (
          // Remix form
          <>
            {/* Parent IP Preview */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-white/5 rounded-xl">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-dark flex-shrink-0">
                {remixingIP.type === 'image' && (
                  <Image
                    src={remixingIP.preview.thumbnailUrl.cachedUrl || remixingIP.preview.url}
                    alt={remixingIP.title}
                    fill
                    className="object-cover"
                  />
                )}
                {remixingIP.type === 'music' && (
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-white/60 text-xs mb-1">Remixing from</p>
                <h3 className="text-white font-semibold mb-1">{remixingIP.title}</h3>
                <p className="text-white/60 text-sm">{remixingIP.creator.name}</p>
              </div>
            </div>

            {/* Remix Info */}
            <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl">
              <p className="text-white text-sm mb-2">
                <strong>Remix IP Asset</strong>
              </p>
              <p className="text-white/70 text-sm">
                Create a derivative work based on this IP. You&apos;ll need an existing NFT to register as the derivative IP asset.
              </p>
            </div>

            {/* NFT Details Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  NFT Contract Address *
                </label>
                <input
                  type="text"
                  value={nftContract}
                  onChange={(e) => setNftContract(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary transition-colors"
                />
                <p className="text-white/40 text-xs mt-1">
                  The contract address of your NFT
                </p>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Token ID *
                </label>
                <input
                  type="text"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                  placeholder="1"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary transition-colors"
                />
                <p className="text-white/40 text-xs mt-1">
                  The token ID of your NFT
                </p>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Metadata URI (Optional)
                </label>
                <input
                  type="text"
                  value={metadataURI}
                  onChange={(e) => setMetadataURI(e.target.value)}
                  placeholder="ipfs://... or https://..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary transition-colors"
                />
                <p className="text-white/40 text-xs mt-1">
                  IPFS URI or URL to your derivative work&apos;s metadata
                </p>
              </div>
            </div>

            {/* Actions */}
            {isConnected ? (
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleRemix}
                isLoading={isRemixing}
                disabled={!nftContract || !tokenId}
              >
                {isRemixing ? 'Creating Remix...' : 'Create Remix'}
              </Button>
            ) : (
              <ConnectKitButton.Custom>
                {({ show }) => (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={show}
                  >
                    Connect Wallet to Remix
                  </Button>
                )}
              </ConnectKitButton.Custom>
            )}

            <p className="text-white/60 text-xs text-center mt-4">
              By creating a remix, you agree to the license terms of the parent IP asset.
            </p>
          </>
        )}
      </div>
    </Modal>
  )
}
