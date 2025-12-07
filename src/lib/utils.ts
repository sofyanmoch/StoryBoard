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
  return `${portalUrl}/ip/${ipId}`
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
