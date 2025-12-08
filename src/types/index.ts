export type IPAssetType = 'image' | 'music' | 'text' | 'video'

export type LicenseType = 'personal' | 'commercial' | 'remix'

export type Collection = 'Color Cats' | 'Sigma Music' | 'PizzadDAO' | 'WTF Freg'

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
  ownerAddress: string;
  preview: {
    url: string
    thumbnailUrl: ThumbnailUrl
  }
  licenses: any[]
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

export interface ThumbnailUrl {
  cachedUrl: string;
  contentType: string;
  thumbnailUrl: string;
}

interface LicenseTermsFromAPI {
  licenseTemplateId: string
  licenseTermsId: string
  templateName: string
  templateMetadataUri: string
  terms: {
    uri: string
    currency: string
    expiration: string
    transferable: boolean
    commercialUse: boolean
    royaltyPolicy: string
    defaultMintingFee: string
    commercialRevShare: number
    derivativesAllowed: boolean
    derivativesApproval: boolean
    commercialRevCeiling: string
    derivativeRevCeiling: string
    commercialAttribution: boolean
    commercializerChecker: string
    derivativesReciprocal: boolean
    derivativesAttribution: boolean
    commercializerCheckerData: string
  }
  licensingConfig: {
    isSet: boolean
    disabled: boolean
    hookData: string
    mintingFee: number
    licensingHook: string
    commercialRevShare: number
    expectGroupRewardPool: string
    expectMinimumGroupRewardShare: number
  }
  createdAt: string
  updatedAt: string
}