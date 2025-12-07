import { useQuery } from '@tanstack/react-query'
import { type IPAsset } from '@/types'
import { parseEther } from 'viem'

// Story Protocol API configuration
const STORY_API_URL = 'https://staging-api.storyprotocol.net/api/v4'
const STORY_API_KEY = 'KOTbaGUSWQ6cUJWhiJYiOjPgB0kTRu1eCFFvQL0IWls'

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
  const validCollection = ['Color Cats', 'Sigma Music', 'PizzaDAO', 'WTF Freg'].includes(collection)
    ? collection
    : 'PizzaDAO' // default to valid collection

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

function transformLicenses(licenseTerms: any[]): IPAsset['licenses'] {
  if (!licenseTerms || licenseTerms.length === 0) {
    return [{ type: 'personal', price: '0', currency: 'IP', available: true }]
  }

  return licenseTerms.map((term: any) => {
    const termId = term.licenseTermsId || term.id
    let type: 'personal' | 'commercial' | 'remix' = 'personal'

    if (termId === '2' || termId === 2 || term.commercialUse) type = 'commercial'
    else if (termId === '3' || termId === 3 || term.derivativesAllowed) type = 'remix'

    return {
      type,
      price: term.mintingFee || term.price || '0',
      currency: term.currency || 'IP',
      available: term.available !== false,
    }
  })
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

// Sample IP assets from Story Protocol ecosystem
function getSampleIPAssets(): IPAsset[] {
  return [
    {
      id: 'story-ip-001',
      title: 'Digital Art Collection #1',
      description: 'A unique digital artwork registered on Story Protocol. This piece represents the future of IP ownership and licensing on-chain.',
      type: 'image',
      collection: 'Color Cats',
      creator: {
        name: 'StoryArtist',
        address: '0x1234567890123456789012345678901234567890',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=StoryArtist',
      },
      preview: {
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=1000&fit=crop',
        thumbnailUrl: {
            cachedUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=500&fit=crop',
            contentType: 'image/jpeg',
            thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=500&fit=crop'
        }
      },
      licenses: [
        { type: 'personal', price: '0', currency: 'IP', available: true },
        { type: 'commercial', price: parseEther('0.05').toString(), currency: 'IP', available: true },
      ],
      ipId: '0xabc1234567890abcdef1234567890abcdef12345',
      metadata: {
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        views: 450,
        likes: 34,
        tags: ['digital-art', 'nft', 'story-protocol'],
      },
    },
    {
      id: 'story-ip-002',
      title: 'Licensed Music Track',
      description: 'Original music composition available for licensing through Story Protocol. Perfect for content creators and commercial use.',
      type: 'music',
      collection: 'Sigma Music',
      creator: {
        name: 'MusicCreator',
        address: '0x2345678901234567890123456789012345678901',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MusicCreator',
      },
      preview: {
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        thumbnailUrl: {
            cachedUrl: 'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?w=400&h=500&fit=crop',
            contentType: 'image/jpeg',
            thumbnailUrl: 'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?w=400&h=500&fit=crop'
        }
      },
      licenses: [
        { type: 'personal', price: parseEther('0.01').toString(), currency: 'IP', available: true },
        { type: 'commercial', price: parseEther('0.1').toString(), currency: 'IP', available: true },
        { type: 'remix', price: parseEther('0.05').toString(), currency: 'IP', available: true },
      ],
      ipId: '0xdef2345678901234567890abcdef1234567890ab',
      metadata: {
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        views: 820,
        likes: 67,
        tags: ['music', 'royalty-free', 'licensing'],
      },
    },
    {
      id: 'story-ip-003',
      title: 'Programmable IP NFT',
      description: 'An innovative IP asset demonstrating the power of Story Protocol. Includes full commercial rights and remix capabilities with revenue sharing.',
      type: 'image',
      collection: 'PizzaDAO',
      creator: {
        name: 'IPInnovator',
        address: '0x3456789012345678901234567890123456789012',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=IPInnovator',
      },
      preview: {
        url: 'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=800&h=1000&fit=crop',
        thumbnailUrl: {
            cachedUrl: 'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=400&h=500&fit=crop',
            contentType: 'image/jpeg',
            thumbnailUrl: 'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=400&h=500&fit=crop'
        }
      },
      licenses: [
        { type: 'commercial', price: parseEther('0.15').toString(), currency: 'IP', available: true },
        { type: 'remix', price: parseEther('0.08').toString(), currency: 'IP', available: true },
      ],
      ipId: '0x456789012345678901234567890abcdef1234567',
      metadata: {
        createdAt: new Date(Date.now() - 14400000).toISOString(),
        views: 1250,
        likes: 98,
        tags: ['programmable-ip', 'nft', 'licensing'],
      },
    },
  ]
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
        // where field is optional - omit to get all assets
        // where: {
        //   ipIds: [],
        //   ownerAddress: "",
        //   tokenContract: ""
        // }
      }),
    })

    if (!response.ok) {
      console.warn(`Story Protocol API error: ${response.status} ${response.statusText}`)

      // Only use sample data for the first page
      if (page === 0) {
        console.log('Using sample data as fallback for page 0')
        return getSampleIPAssets()
      }

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

    // Only use sample data for the first page
    if (page === 0) {
      return getSampleIPAssets()
    }

    return []
  } catch (error) {
    console.error('Error fetching IP assets from Story Protocol:', error)

    // Only use sample data for the first page
    if (page === 0) {
      console.log('Falling back to sample Story Protocol data')
      return getSampleIPAssets()
    }

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
