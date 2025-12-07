export type IPAssetType = 'image' | 'music' | 'text' | 'video'

export type LicenseType = 'personal' | 'commercial' | 'remix'

export type Collection = 'Color Cats' | 'Sigma Music' | 'PizzaDAO' | 'WTF Freg'

export interface IPAsset {
  id: string
  title: string
  description: string
  type: IPAssetType
  collection: Collection
  creator: {
    name: string
    address: string
    avatar?: string
  }
  preview: {
    url: string
    thumbnailUrl?: string
  }
  licenses: {
    type: LicenseType
    price: string // in wei
    currency: string
    available: boolean
  }[]
  ipId?: string // Story Protocol IP ID
  metadata: {
    createdAt: string
    views: number
    likes: number
    tags: string[]
  }
}

export interface License {
  id: string
  ipAssetId: string
  ipAsset: IPAsset
  licenseType: LicenseType
  price: string
  txHash: string
  licensedAt: string
  expiresAt?: string
}

export interface SwipeAction {
  type: 'like' | 'skip'
  ipAssetId: string
  timestamp: number
}

export interface FilterOptions {
  type: IPAssetType | 'all'
  collection: Collection | 'all'
  license: 'free' | 'paid' | 'all'
  sort: 'newest' | 'popular' | 'price-low' | 'price-high'
}
