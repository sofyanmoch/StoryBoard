import { type Collection, type IPAssetType, type LicenseType } from '@/types'

export const STORY_ODYSSEY_CHAIN_ID = 1516

export const STORY_CHAIN_CONFIG = {
  id: STORY_ODYSSEY_CHAIN_ID,
  name: 'Story Odyssey Testnet',
  network: 'story-odyssey',
  nativeCurrency: {
    decimals: 18,
    name: 'IP',
    symbol: 'IP',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_STORY_RPC_URL || 'https://odyssey.storyrpc.io'],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_STORY_RPC_URL || 'https://odyssey.storyrpc.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Story Odyssey Explorer',
      url: process.env.NEXT_PUBLIC_STORY_EXPLORER_URL || 'https://odyssey.storyscan.xyz',
    },
  },
  testnet: true,
}

export const STORY_PORTAL_URL = process.env.NEXT_PUBLIC_STORY_PORTAL_URL || 'https://odyssey.portal.story.foundation'

export const IP_ASSET_TYPES: { value: IPAssetType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'image', label: 'Image' },
  { value: 'music', label: 'Music' },
  { value: 'text', label: 'Text' },
  { value: 'video', label: 'Video' },
]

export const COLLECTIONS: { value: Collection | 'all'; label: string }[] = [
  { value: 'all', label: 'All Collections' },
  { value: 'Color Cats', label: 'Color Cats' },
  { value: 'Sigma Music', label: 'Sigma Music' },
  { value: 'PizzaDAO', label: 'PizzaDAO' },
  { value: 'WTF Freg', label: 'WTF Freg' },
]

export const LICENSE_TYPES: { value: LicenseType; label: string; description: string }[] = [
  {
    value: 'personal',
    label: 'Personal License',
    description: 'Use for personal projects and non-commercial purposes',
  },
  {
    value: 'commercial',
    label: 'Commercial License',
    description: 'Use for commercial projects and monetization',
  },
  {
    value: 'remix',
    label: 'Remix License',
    description: 'Create derivative works and remixes',
  },
]

export const SWIPE_THRESHOLD = 100
export const SWIPE_ROTATION_MULTIPLIER = 0.15
export const SPRING_CONFIG = { stiffness: 300, damping: 30 }
export const PRELOAD_COUNT = 5

export const NAVIGATION_ITEMS = [
  { label: 'Discover', href: '/', icon: 'home' },
  { label: 'Likes', href: '/likes', icon: 'heart' },
  { label: 'Licenses', href: '/licenses', icon: 'file-text' },
]
