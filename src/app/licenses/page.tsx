'use client'

import { TopBar } from '@/components/navigation/TopBar'
import { BottomNav } from '@/components/navigation/BottomNav'
import { IPDetailModal } from '@/components/modals/IPDetailModal'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Badge } from '@/components/ui/Badge'
import { FileText, ExternalLink, Download, Calendar } from 'lucide-react'
import Image from 'next/image'
import { useLicenseStore } from '@/store/useLicenseStore'
import { useUIStore } from '@/store/useUIStore'
import { formatPrice, formatDate, getExplorerUrl } from '@/lib/utils'
import { LICENSE_TYPES } from '@/lib/constants'

export default function LicensesPage() {
  const { licenses } = useLicenseStore()
  const { openIPDetailModal } = useUIStore()

  const handleDownload = (license: any) => {
    // In production, this would download the actual licensed asset
    window.open(license.ipAsset.preview.url, '_blank')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar title="My Licenses" />

      {/* Main Content */}
      <main className="flex-1 pb-20">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          {licenses.length > 0 ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-white/60">
                  {licenses.length} {licenses.length === 1 ? 'license' : 'licenses'} acquired
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {licenses.map((license) => {
                  const licenseInfo = LICENSE_TYPES.find((t) => t.value === license.licenseType)

                  return (
                    <Card key={license.id} glass className="group">
                      <div className="flex gap-4 p-4">
                        {/* Thumbnail */}
                        <div
                          className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                          onClick={() => openIPDetailModal(license.ipAsset)}
                        >
                          {license.ipAsset.type === 'image' && (
                            <Image
                              src={license.ipAsset.preview.thumbnailUrl || license.ipAsset.preview.url}
                              alt={license.ipAsset.title}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                          )}
                          {license.ipAsset.type === 'music' && (
                            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-semibold mb-1 truncate">
                                {license.ipAsset.title}
                              </h3>
                              <p className="text-white/60 text-sm">{license.ipAsset.creator.name}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="accent">{licenseInfo?.label}</Badge>
                            <Badge variant="primary">
                              {formatPrice(license.price)}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-white/60 text-sm mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {formatDate(license.licensedAt)}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleDownload(license)}
                            >
                              <Download size={16} className="mr-1" />
                              Download
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(getExplorerUrl(license.txHash), '_blank')}
                            >
                              <ExternalLink size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </>
          ) : (
            <EmptyState
              icon={<FileText size={64} />}
              title="No Licenses Yet"
              description="License IP assets to start building your collection"
              action={
                <Button variant="primary" onClick={() => window.location.href = '/'}>
                  Discover IP Assets
                </Button>
              }
            />
          )}
        </div>
      </main>

      <BottomNav />

      {/* Modals */}
      <IPDetailModal />
    </div>
  )
}
