'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Check, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { useUIStore } from '@/store/useUIStore'
import { useLicenseStore } from '@/store/useLicenseStore'
import { useLicenseIP, getLicenseTermsId } from '@/hooks/useStoryProtocol'
import { useAccount } from 'wagmi'
import { ConnectKitButton } from 'connectkit'
import { formatPrice, getExplorerUrl } from '@/lib/utils'
import { LICENSE_TYPES } from '@/lib/constants'
import { toast } from 'sonner'
import { type LicenseType } from '@/types'

export function LicenseModal() {
  const { isLicenseModalOpen, licensingIP, selectedLicenseType, closeLicenseModal, setSelectedLicenseType } = useUIStore()
  const { addLicense } = useLicenseStore()
  const { isConnected } = useAccount()
  const { license: licenseIP } = useLicenseIP()

  const [isLicensing, setIsLicensing] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!licensingIP) return null

  const handleLicenseTypeSelect = (type: LicenseType) => {
    setSelectedLicenseType(type)
  }

  const selectedLicense = licensingIP.licenses.find((l) => l.type === selectedLicenseType)

  const handleConfirm = async () => {
    if (!selectedLicense || !selectedLicenseType) {
      toast.error('Please select a license type')
      return
    }

    setIsLicensing(true)

    try {
      // Validate IP ID
      if (!licensingIP.ipId) {
        throw new Error('IP ID is required to license this asset')
      }

      // Get the license terms ID for this license type
      // const licenseTermsId = getLicenseTermsId(selectedLicenseType)

      // Start licensing process
      toast.info('Starting license process...')

      // licenseIP function will handle:
      // 1. Attach license terms (if not already attached)
      // 2. Mint license tokens
      const result = await licenseIP(
        licensingIP.ipId as any,
        selectedLicense.licenseTermsId as any,
        1 // amount
      )

      setTxHash(result.txHash)

      // Save license to store
      addLicense({
        id: result.licenseId,
        ipAssetId: licensingIP.id,
        ipAsset: licensingIP,
        licenseType: selectedLicenseType,
        price: selectedLicense.price,
        txHash: result.txHash,
        licensedAt: new Date().toISOString(),
      })

      setSuccess(true)
      toast.success('License acquired successfully!')
    } catch (error: any) {
      console.error('Licensing error:', error)
      toast.error('Failed to acquire license', {
        description: error.message || 'Please try again'
      })
    } finally {
      setIsLicensing(false)
    }
  }

  const handleClose = () => {
    closeLicenseModal()
    setTimeout(() => {
      setSuccess(false)
      setTxHash(null)
    }, 300)
  }

  return (
    <Modal
      isOpen={isLicenseModalOpen}
      onClose={handleClose}
      title={success ? 'License Acquired!' : 'License IP Asset'}
      size="md"
    >
      <div className="p-6">
        {success ? (
          // Success state
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-success/20 rounded-full flex items-center justify-center">
              <Check size={40} className="text-success" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Success!</h3>
            <p className="text-white/80 mb-6">
              You&apos;ve successfully licensed <span className="font-semibold">{licensingIP.title}</span>
            </p>

            {txHash && (
              <button
                onClick={() => window.open(getExplorerUrl(txHash), '_blank')}
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6"
              >
                View on Explorer
                <ExternalLink size={16} />
              </button>
            )}

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={handleClose}
              >
                Close
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => window.location.href = '/licenses'}
              >
                View My Licenses
              </Button>
            </div>
          </div>
        ) : (
          // License selection
          <>
            {/* IP Preview */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-white/5 rounded-xl">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-dark flex-shrink-0">
                {licensingIP.type === 'image' && (
                  <Image
                    src={licensingIP.preview.thumbnailUrl.cachedUrl || licensingIP.preview.url}
                    alt={licensingIP.title}
                    fill
                    className="object-cover"
                  />
                )}
                {licensingIP.type === 'music' && (
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">{licensingIP.title}</h3>
                <p className="text-white/60 text-sm">{licensingIP.creator.name}</p>
              </div>
            </div>

            {/* License Type Selection */}
            <div className="mb-6">
              <p className="text-white font-medium mb-3">Select License Type</p>
              <div className="space-y-2">
                {licensingIP.licenses.map((license) => {
                  const info = LICENSE_TYPES.find((t) => t.value === license.type)
                  const isSelected = selectedLicenseType === license.type

                  return (
                    <button
                      key={license.type}
                      onClick={() => handleLicenseTypeSelect(license.type)}
                      className={`w-full p-4 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-primary/20 border-2 border-primary'
                          : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-primary bg-primary' : 'border-white/30'
                          }`}>
                            {isSelected && <Check size={12} className="text-white" />}
                          </div>
                          <span className="text-white font-medium">{info?.label}</span>
                        </div>
                        <span className="text-primary font-bold">
                          {formatPrice(license.price)}
                        </span>
                      </div>
                      <p className="text-white/60 text-sm text-left ml-7">
                        {info?.description}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Price Summary */}
            {selectedLicense && (
              <div className="mb-6 p-4 bg-white/5 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60">License Fee</span>
                  <span className="text-white font-medium">
                    {formatPrice(selectedLicense.price)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Total</span>
                  <span className="text-primary font-bold text-xl">
                    {formatPrice(selectedLicense.price)}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            {isConnected ? (
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleConfirm}
                isLoading={isLicensing}
                disabled={!selectedLicenseType}
              >
                {isLicensing ? 'Processing...' : 'Confirm & License'}
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
                    Connect Wallet to License
                  </Button>
                )}
              </ConnectKitButton.Custom>
            )}

            <p className="text-white/60 text-xs text-center mt-4">
              By licensing this IP, you agree to the terms and conditions of the selected license type.
            </p>
          </>
        )}
      </div>
    </Modal>
  )
}
