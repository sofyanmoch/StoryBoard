import { useQuery } from '@tanstack/react-query'
import { type IPAsset } from '@/types'
import { parseEther } from 'viem'

// Types for License Terms from API
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

// Currency address mapping
const CURRENCY_MAP: Record<string, string> = {
  '0x1514000000000000000000000000000000000000': 'WIP',
  '0x0000000000000000000000000000000000000000': 'FREE',
}

// Story Protocol API configuration
const STORY_API_URL = process.env.NEXT_PUBLIC_STORY_API_URL || 'https://staging-api.storyprotocol.net/api/v4'
const STORY_API_KEY = process.env.NEXT_PUBLIC_STORY_API_KEY || ''

// Transform Story Protocol IP data to our IPAsset format
function transformStoryIPToAsset(storyIP: any): IPAsset {
  // Handle Story Protocol API response structure
  const ipId = storyIP.ipId || storyIP.id || storyIP.assetId || ''
  const metadata = storyIP.nftMetadata || storyIP.metadata || {}
  const ipMetadata = storyIP.ipMetadata || {}

  // Extract owner/creator
  const owner = storyIP.owner || storyIP.ipOwner || storyIP.creator || '0x0000000000000000000000000000000000000000'

  // Extract metadata fields
  const name = metadata.name || ipMetadata.name || storyIP.name || 'Untitled IP Asset'
  const description = metadata.description || ipMetadata.description || storyIP.description || 'No description available'
  const image = metadata.image || metadata.imageUrl || ipMetadata.imageUrl || storyIP.imageUrl

  // Determine collection from metadata or default
  const collection = (metadata.collection || storyIP.collection || 'Story Protocol') as any
  const validCollection = ['Color Cats', 'Sigma Music', 'PizdzaDAO', 'WTF Freg'].includes(collection)
    ? collection
    : '' // default to valid collection

  return {
    id: ipId,
    title: name,
    description: description,
    type: determineAssetType(metadata.contentType || metadata.type || storyIP.assetType || 'image'),
    collection: validCollection,
    creator: {
      name: metadata.creator?.name || shortenAddress(owner),
      address: owner,
      avatar: metadata.creator?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${owner}`,
    },
    preview: {
      url: image || generatePlaceholderImage(name),
      thumbnailUrl: metadata.thumbnail || metadata.thumbnailUrl || image || generatePlaceholderImage(name),
    },
    licenses: transformLicenses(storyIP.licenseTerms || storyIP.licenses || []),
    ipId: ipId,
    metadata: {
      createdAt: storyIP.blockTimestamp || storyIP.createdAt || storyIP.timestamp || new Date().toISOString(),
      views: parseInt(metadata.views || storyIP.views || '0'),
      likes: parseInt(metadata.likes || storyIP.likes || '0'),
      tags: metadata.tags || storyIP.tags || extractTags(description),
    },
  }
}

function determineAssetType(contentType: string): IPAsset['type'] {
  const type = contentType.toLowerCase()
  if (type.includes('image') || type.includes('png') || type.includes('jpg')) return 'image'
  if (type.includes('audio') || type.includes('music') || type.includes('mp3')) return 'music'
  if (type.includes('video') || type.includes('mp4')) return 'video'
  if (type.includes('text') || type.includes('document')) return 'text'
  return 'image'
}

// Transform licenses - preserves original API data + adds UI fields
function transformLicenses(licenseTerms: LicenseTermsFromAPI[] | any[]): (LicenseTermsFromAPI & {
  // UI-friendly fields
  type: 'personal' | 'commercial' | 'remix'
  price: string
  priceFormatted: string
  currency: string
  currencyAddress: string
  available: boolean
  isTransferable: boolean
  commercialRevSharePercent: number
  derivativesAllowed: boolean
  requiresAttribution: boolean
})[] {
  
  // Return default if no license terms
  if (!licenseTerms || licenseTerms.length === 0) {
    return [{
      // Default API structure
      licenseTemplateId: '',
      licenseTermsId: '0',
      templateName: 'default',
      templateMetadataUri: '',
      terms: {
        uri: '',
        currency: '0x0000000000000000000000000000000000000000',
        expiration: '0',
        transferable: true,
        commercialUse: false,
        royaltyPolicy: '',
        defaultMintingFee: '0',
        commercialRevShare: 0,
        derivativesAllowed: false,
        derivativesApproval: false,
        commercialRevCeiling: '0',
        derivativeRevCeiling: '0',
        commercialAttribution: false,
        commercializerChecker: '0x0000000000000000000000000000000000000000',
        derivativesReciprocal: false,
        derivativesAttribution: false,
        commercializerCheckerData: '0x',
      },
      licensingConfig: {
        isSet: false,
        disabled: false,
        hookData: '',
        mintingFee: 0,
        licensingHook: '',
        commercialRevShare: 0,
        expectGroupRewardPool: '',
        expectMinimumGroupRewardShare: 0,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      
      // UI fields
      type: 'personal' as const,
      price: '0',
      priceFormatted: 'Free',
      currency: 'IP',
      currencyAddress: '0x0000000000000000000000000000000000000000',
      available: true,
      isTransferable: true,
      commercialRevSharePercent: 0,
      derivativesAllowed: false,
      requiresAttribution: false,
    }]
  }

  return licenseTerms.map((term: LicenseTermsFromAPI) => {
    const terms = term.terms || {}
    const licensingConfig = term.licensingConfig || {}
    
    // Get currency from address
    const currencyAddress = terms.currency || '0x0000000000000000000000000000000000000000'
    const currency = CURRENCY_MAP[currencyAddress] || 'IP'
    
    // Get minting fee
    const mintingFeeWei = terms.defaultMintingFee || licensingConfig.mintingFee?.toString() || '0'
    const priceFormatted = formatMintingFee(mintingFeeWei)
    
    // Check availability
    const isDisabled = licensingConfig.isSet && licensingConfig.disabled
    const available = !isDisabled
    
    // Determine type
    const type = determineLicenseType(terms as LicenseTermsFromAPI['terms'])
    
    return {
      // Preserve ALL original API data
      ...term,
      
      // Add UI-friendly fields
      type,
      price: mintingFeeWei,
      priceFormatted: mintingFeeWei === '0' ? 'Free' : `${priceFormatted} ${currency}`,
      currency,
      currencyAddress,
      available,
      isTransferable: terms.transferable ?? true,
      commercialRevSharePercent: terms.commercialRevShare || licensingConfig.commercialRevShare || 0,
      derivativesAllowed: terms.derivativesAllowed ?? false,
      requiresAttribution: terms.commercialAttribution || terms.derivativesAttribution || false,
    }
  })
}

// Format wei to human readable
function formatMintingFee(weiValue: string): string {
  if (!weiValue || weiValue === '0') return 'Free'
  
  try {
    const wei = BigInt(weiValue)
    const eth = Number(wei) / 1e18
    
    if (eth === 0) return 'Free'
    if (eth < 0.001) return eth.toExponential(2)
    if (eth < 1) return eth.toFixed(4)
    if (eth < 1000) return eth.toFixed(2)
    return eth.toLocaleString('en-US', { maximumFractionDigits: 2 })
  } catch {
    return weiValue
  }
}

// Determine license type based on terms
function determineLicenseType(terms: LicenseTermsFromAPI['terms']): 'personal' | 'commercial' | 'remix' {
  if (terms.derivativesAllowed) {
    return 'remix'
  }
  if (terms.commercialUse) {
    return 'commercial'
  }
  return 'personal'
}


function shortenAddress(address: string): string {
  if (!address || address.length < 10) return 'Unknown'
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function extractTags(description: string = ''): string[] {
  const hashtags = description.match(/#\w+/g) || []
  return hashtags.map(tag => tag.slice(1)).slice(0, 5)
}

function generatePlaceholderImage(name: string = 'IP Asset'): string {
  const colors = ['FF6B35', '7C3AED', '10B981', 'F59E0B', 'EF4444', '8B5CF6']
  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  return `https://via.placeholder.com/800x1000/${randomColor}/FFFFFF?text=${encodeURIComponent(name)}`
}

// Fetch IP assets from Story Protocol with pagination
async function fetchIPAssetsFromStory(page: number = 0, limit: number = 50): Promise<IPAsset[]> {
  try {
    const offset = page * limit
    console.log(`Fetching IP assets from Story Protocol API (page ${page}, offset ${offset})...`)

    // Call Story Protocol API with POST method
    const response = await fetch(`${STORY_API_URL}/assets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': STORY_API_KEY,
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        includeLicenses: true,
        moderated: false,
        orderBy: 'blockNumber',
        orderDirection: 'desc',
        pagination: {
          limit: limit,
          offset: offset,
        },
      }),
    })

    if (!response.ok) {
      console.warn(`Story Protocol API error: ${response.status} ${response.statusText}`)

      console.log('No more assets available')
      return []
    }

    const data = await response.json()
    console.log('API Response:', data)

    // Handle response format from Story Protocol API
    const assets = data.data || data.assets || data.items || []

    if (Array.isArray(assets) && assets.length > 0) {
      console.log(`✅ Fetched ${assets.length} IP assets from Story Protocol (page ${page})`)
      return assets.map(transformStoryIPToAsset)
    }

    console.warn(`No IP assets found in response for page ${page}`)

    return []
  } catch (error) {
    console.error('Error fetching IP assets from Story Protocol:', error)

    return []
  }
}

// Hook to fetch real IP assets with pagination
export function useRealIPAssets(page: number = 0) {
  return useQuery({
    queryKey: ['ipAssets', 'story-protocol', page],
    queryFn: () => fetchIPAssetsFromStory(page),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  })
}

// Hook to fetch a specific IP asset by ID
export function useIPAsset(ipId: string) {
  return useQuery({
    queryKey: ['ipAsset', ipId],
    queryFn: async () => {
      try {
        const response = await fetch(`${STORY_API_URL}/assets/${ipId}`, {
          method: 'GET',
          headers: {
            'X-API-Key': STORY_API_KEY,
            'Accept': 'application/json',
          },
        })

        if (!response.ok) throw new Error('IP asset not found')

        const data = await response.json()
        const asset = data.data || data.asset || data

        return transformStoryIPToAsset(asset)
      } catch (error) {
        console.error('Error fetching IP asset:', error)
        throw error
      }
    },
    enabled: !!ipId,
    staleTime: 5 * 60 * 1000,
  })
}
