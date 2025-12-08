import { clsx, type ClassValue } from './clsx'
import { formatEther } from 'viem'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatPrice(priceInWei: string): string {
  if (priceInWei === '0') return 'Free'
  const ethValue = formatEther(BigInt(priceInWei))
  return `${parseFloat(ethValue).toFixed(4)} IP`
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function getExplorerUrl(txHash: string): string {
  const explorerUrl = process.env.NEXT_PUBLIC_STORY_EXPLORER_URL || 'https://aeneid.storyscan.xyz'
  return `${explorerUrl}/tx/${txHash}`
}

export function getIPPortalUrl(ipId: string): string {
  const portalUrl = process.env.NEXT_PUBLIC_STORY_PORTAL_URL || 'https://aeneid.explorer.story.foundation'
  return `${portalUrl}/ipa/${ipId}`
}

export function parseError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unknown error occurred'
}

// lib/utils.ts

// Placeholder options
export const PLACEHOLDERS = {
  default: '/placeholder-ip.png',
  gradient: 'gradient', // Special flag untuk gradient placeholder
  avatar: (seed: string) => `https://api.dicebear.com/7.x/shapes/svg?seed=${seed}`,
  pattern: (seed: string) => `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}`,
}

export function getIPAssetImage(asset: any): string {
  // Coba berbagai lokasi image
  const possibleImages = [
    asset.nftMetadata?.image,
    asset.nftMetadata?.imageUrl,
    asset.nftMetadata?.image_url,
    asset.metadata?.image,
    asset.metadata?.imageUrl,
    asset.mediaUrl,
    asset.thumbnailUrl,
    asset.image,
  ]

  // Cari yang valid
  const imageUrl = possibleImages.find((url) => 
    url && 
    typeof url === 'string' && 
    url.trim() !== '' &&
    url !== 'undefined' &&
    url !== 'null'
  )

  if (!imageUrl) {
    // ✅ Generate unique placeholder berdasarkan asset ID
    return PLACEHOLDERS.avatar(asset.id || Math.random().toString())
  }

  // Handle IPFS URLs
  if (imageUrl.startsWith('ipfs://')) {
    return imageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/')
  }

  // Handle Arweave URLs
  if (imageUrl.startsWith('ar://')) {
    return imageUrl.replace('ar://', 'https://arweave.net/')
  }

  return imageUrl
}

export function isPlaceholderImage(url: string): boolean {
  return (
    url.includes('dicebear') ||
    url.includes('placeholder') ||
    url === PLACEHOLDERS.gradient
  )
}