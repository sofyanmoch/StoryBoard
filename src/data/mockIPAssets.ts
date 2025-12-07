import { type IPAsset } from '@/types'
import { parseEther } from 'viem'

export const mockIPAssets: IPAsset[] = [
  {
    id: 'ip-001',
    title: 'Neon Cat Dreams',
    description: 'A vibrant digital artwork featuring a cyberpunk cat in neon lights. Perfect for digital galleries and NFT collections.',
    type: 'image',
    collection: 'Color Cats',
    creator: {
      name: 'CryptoArtist',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoArtist'
    },
    preview: {
      url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=1000&fit=crop',
      thumbnailUrl: {
        cachedUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=500&fit=crop',
        contentType: 'image/jpeg',
        thumbnailUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=500&fit=crop'
      }
    },
    licenses: [
      {
        type: 'personal',
        price: parseEther('0.01').toString(),
        currency: 'IP',
        available: true
      },
      {
        type: 'commercial',
        price: parseEther('0.1').toString(),
        currency: 'IP',
        available: true
      },
      {
        type: 'remix',
        price: parseEther('0.05').toString(),
        currency: 'IP',
        available: true
      }
    ],
    ipId: '0x1234567890abcdef1234567890abcdef12345678',
    metadata: {
      createdAt: '2024-01-15T10:30:00Z',
      views: 1250,
      likes: 89,
      tags: ['cat', 'neon', 'cyberpunk', 'digital-art']
    }
  },
  {
    id: 'ip-002',
    title: 'Sigma Beats Vol.1',
    description: 'Lo-fi hip hop beats for studying, working, and relaxing. Royalty-free music for content creators.',
    type: 'music',
    collection: 'Sigma Music',
    creator: {
      name: 'BeatMaker',
      address: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BeatMaker'
    },
    preview: {
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      thumbnailUrl: {
        cachedUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=500&fit=crop',
        contentType: 'image/jpeg',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=500&fit=crop'
      }
    },
    licenses: [
      {
        type: 'personal',
        price: '0',
        currency: 'IP',
        available: true
      },
      {
        type: 'commercial',
        price: parseEther('0.2').toString(),
        currency: 'IP',
        available: true
      }
    ],
    ipId: '0x2234567890abcdef1234567890abcdef12345678',
    metadata: {
      createdAt: '2024-01-20T14:20:00Z',
      views: 3420,
      likes: 245,
      tags: ['lofi', 'beats', 'music', 'chill']
    }
  },
  {
    id: 'ip-003',
    title: 'Rainbow Feline',
    description: 'Colorful abstract cat illustration with rainbow gradients. Great for apparel, posters, and digital media.',
    type: 'image',
    collection: 'Color Cats',
    creator: {
      name: 'ColorMaster',
      address: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ColorMaster'
    },
    preview: {
      url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=1000&fit=crop',
      thumbnailUrl: {
        cachedUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=500&fit=crop',
        contentType: 'image/jpeg',
        thumbnailUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=500&fit=crop'
      }
    },
    licenses: [
      {
        type: 'personal',
        price: parseEther('0.02').toString(),
        currency: 'IP',
        available: true
      },
      {
        type: 'commercial',
        price: parseEther('0.15').toString(),
        currency: 'IP',
        available: true
      },
      {
        type: 'remix',
        price: parseEther('0.08').toString(),
        currency: 'IP',
        available: true
      }
    ],
    ipId: '0x3234567890abcdef1234567890abcdef12345678',
    metadata: {
      createdAt: '2024-01-18T09:15:00Z',
      views: 890,
      likes: 67,
      tags: ['cat', 'rainbow', 'colorful', 'abstract']
    }
  },
  {
    id: 'ip-004',
    title: 'Pizza Party NFT',
    description: 'Delicious pixel art pizza slice with animated toppings. Part of the exclusive PizzaDAO collection.',
    type: 'image',
    collection: 'PizzaDAO',
    creator: {
      name: 'PixelPizza',
      address: '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PixelPizza'
    },
    preview: {
      url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=1000&fit=crop',
      thumbnailUrl: {
        cachedUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=500&fit=crop',
        contentType: 'image/jpeg',
        thumbnailUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=500&fit=crop'
      }
    },
    licenses: [
      {
        type: 'personal',
        price: parseEther('0.05').toString(),
        currency: 'IP',
        available: true
      },
      {
        type: 'commercial',
        price: parseEther('0.3').toString(),
        currency: 'IP',
        available: true
      }
    ],
    ipId: '0x4234567890abcdef1234567890abcdef12345678',
    metadata: {
      createdAt: '2024-01-22T16:45:00Z',
      views: 2100,
      likes: 178,
      tags: ['pizza', 'food', 'pixel-art', 'nft']
    }
  },
  {
    id: 'ip-005',
    title: 'Ambient Space Journey',
    description: 'Ethereal ambient soundscape perfect for meditation, yoga, or background music. High-quality audio.',
    type: 'music',
    collection: 'Sigma Music',
    creator: {
      name: 'AmbientPro',
      address: '0xdD870fA1b7C4700F2BD7f44238821C26f7392148',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AmbientPro'
    },
    preview: {
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      thumbnailUrl: {
        cachedUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=500&fit=crop',
        contentType: 'image/jpeg',
        thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=500&fit=crop'
      }
    },
    licenses: [
      {
        type: 'personal',
        price: parseEther('0.03').toString(),
        currency: 'IP',
        available: true
      },
      {
        type: 'commercial',
        price: parseEther('0.25').toString(),
        currency: 'IP',
        available: true
      },
      {
        type: 'remix',
        price: parseEther('0.15').toString(),
        currency: 'IP',
        available: true
      }
    ],
    ipId: '0x5234567890abcdef1234567890abcdef12345678',
    metadata: {
      createdAt: '2024-01-25T11:00:00Z',
      views: 1680,
      likes: 134,
      tags: ['ambient', 'space', 'meditation', 'music']
    }
  },
  {
    id: 'ip-006',
    title: 'Cosmic Frog',
    description: 'Psychedelic frog floating in space. Unique digital art from the WTF Freg collection.',
    type: 'image',
    collection: 'WTF Freg',
    creator: {
      name: 'FrogLord',
      address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FrogLord'
    },
    preview: {
      url: 'https://images.unsplash.com/photo-1533450718592-29d45635f0a9?w=800&h=1000&fit=crop',
      thumbnailUrl: {
        cachedUrl: 'https://images.unsplash.com/photo-1533450718592-29d45635f0a9?w=400&h=500&fit=crop',
        contentType: 'image/jpeg',
        thumbnailUrl: 'https://images.unsplash.com/photo-1533450718592-29d45635f0a9?w=400&h=500&fit=crop'
      }
    },
    licenses: [
      {
        type: 'personal',
        price: '0',
        currency: 'IP',
        available: true
      },
      {
        type: 'commercial',
        price: parseEther('0.12').toString(),
        currency: 'IP',
        available: true
      },
      {
        type: 'remix',
        price: parseEther('0.06').toString(),
        currency: 'IP',
        available: true
      }
    ],
    ipId: '0x6234567890abcdef1234567890abcdef12345678',
    metadata: {
      createdAt: '2024-01-28T13:30:00Z',
      views: 945,
      likes: 72,
      tags: ['frog', 'space', 'psychedelic', 'art']
    }
  },
  {
    id: 'ip-007',
    title: 'Margherita Dreams',
    description: 'Classic Margherita pizza in stunning 4K detail. Food photography at its finest.',
    type: 'image',
    collection: 'PizzaDAO',
    creator: {
      name: 'FoodieShots',
      address: '0x03C5B4f5D3b3e7F3C6e6e5b3C3b3C3b3C3b3C3b3',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FoodieShots'
    },
    preview: {
      url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=1000&fit=crop',
      thumbnailUrl: {
        cachedUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=500&fit=crop',
        contentType: 'image/jpeg',
        thumbnailUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=500&fit=crop'
      }
    },
    licenses: [
      {
        type: 'personal',
        price: parseEther('0.04').toString(),
        currency: 'IP',
        available: true
      },
      {
        type: 'commercial',
        price: parseEther('0.2').toString(),
        currency: 'IP',
        available: true
      }
    ],
    ipId: '0x7234567890abcdef1234567890abcdef12345678',
    metadata: {
      createdAt: '2024-02-01T10:20:00Z',
      views: 1560,
      likes: 123,
      tags: ['pizza', 'food', 'photography', 'margherita']
    }
  },
  {
    id: 'ip-008',
    title: 'Galactic Cat',
    description: 'Cat wearing astronaut helmet in space. Whimsical digital art perfect for prints and merchandise.',
    type: 'image',
    collection: 'Color Cats',
    creator: {
      name: 'SpaceCats',
      address: '0x04C6C6f6D4b4e8F4C7e7e6b4C4b4C4b4C4b4C4b4',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SpaceCats'
    },
    preview: {
      url: 'https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?w=800&h=1000&fit=crop',
      thumbnailUrl: {
        cachedUrl: 'https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?w=400&h=500&fit=crop',
        contentType: 'image/jpeg',
        thumbnailUrl: 'https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?w=400&h=500&fit=crop'
      }
    },
    licenses: [
      {
        type: 'personal',
        price: parseEther('0.03').toString(),
        currency: 'IP',
        available: true
      },
      {
        type: 'commercial',
        price: parseEther('0.18').toString(),
        currency: 'IP',
        available: true
      },
      {
        type: 'remix',
        price: parseEther('0.09').toString(),
        currency: 'IP',
        available: true
      }
    ],
    ipId: '0x8234567890abcdef1234567890abcdef12345678',
    metadata: {
      createdAt: '2024-02-03T15:10:00Z',
      views: 2340,
      likes: 198,
      tags: ['cat', 'space', 'astronaut', 'whimsical']
    }
  },
  {
    id: 'ip-009',
    title: 'Electronic Dreams',
    description: 'Upbeat electronic music track with synth waves. Perfect for vlogs, gaming streams, and podcasts.',
    type: 'music',
    collection: 'Sigma Music',
    creator: {
      name: 'SynthWave',
      address: '0x05C7C7f7D5b5e9F5C8e8e7b5C5b5C5b5C5b5C5b5',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SynthWave'
    },
    preview: {
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      thumbnailUrl: {
        cachedUrl: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=400&h=500&fit=crop',
        contentType: 'image/jpeg',
        thumbnailUrl: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=400&h=500&fit=crop'
      }
    },
    licenses: [
      {
        type: 'personal',
        price: parseEther('0.02').toString(),
        currency: 'IP',
        available: true
      },
      {
        type: 'commercial',
        price: parseEther('0.22').toString(),
        currency: 'IP',
        available: true
      }
    ],
    ipId: '0x9234567890abcdef1234567890abcdef12345678',
    metadata: {
      createdAt: '2024-02-05T12:40:00Z',
      views: 2890,
      likes: 267,
      tags: ['electronic', 'synth', 'upbeat', 'music']
    }
  },
  {
    id: 'ip-010',
    title: 'Neon Frog King',
    description: 'Majestic frog with crown in neon aesthetic. Limited edition from WTF Freg series.',
    type: 'image',
    collection: 'WTF Freg',
    creator: {
      name: 'NeonKing',
      address: '0x06C8C8f8D6b6eAF6C9e9e8b6C6b6C6b6C6b6C6b6',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NeonKing'
    },
    preview: {
      url: 'https://images.unsplash.com/photo-1568642891147-bd1c9c5cf745?w=800&h=1000&fit=crop',
      thumbnailUrl: {
        cachedUrl: 'https://images.unsplash.com/photo-1568642891147-bd1c9c5cf745?w=400&h=500&fit=crop',
        contentType: 'image/jpeg',
        thumbnailUrl: 'https://images.unsplash.com/photo-1568642891147-bd1c9c5cf745?w=400&h=500&fit=crop'
      }
    },
    licenses: [
      {
        type: 'personal',
        price: parseEther('0.07').toString(),
        currency: 'IP',
        available: true
      },
      {
        type: 'commercial',
        price: parseEther('0.35').toString(),
        currency: 'IP',
        available: true
      },
      {
        type: 'remix',
        price: parseEther('0.2').toString(),
        currency: 'IP',
        available: true
      }
    ],
    ipId: '0xa234567890abcdef1234567890abcdef12345678',
    metadata: {
      createdAt: '2024-02-07T09:25:00Z',
      views: 1780,
      likes: 156,
      tags: ['frog', 'neon', 'king', 'limited']
    }
  },
  {
    id: 'ip-011',
    title: 'Pepperoni Paradise',
    description: 'Sizzling pepperoni pizza with perfect cheese pull. Mouth-watering food content.',
    type: 'image',
    collection: 'PizzaDAO',
    creator: {
      name: 'CheeseLife',
      address: '0x07C9C9f9D7b7eBF7CAeAe9b7C7b7C7b7C7b7C7b7',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CheeseLife'
    },
    preview: {
      url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&h=1000&fit=crop',
      thumbnailUrl: {
        cachedUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=500&fit=crop',
        contentType: 'image/jpeg',
        thumbnailUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=500&fit=crop'
      }
    },
    licenses: [
      {
        type: 'personal',
        price: parseEther('0.06').toString(),
        currency: 'IP',
        available: true
      },
      {
        type: 'commercial',
        price: parseEther('0.28').toString(),
        currency: 'IP',
        available: true
      }
    ],
    ipId: '0xb234567890abcdef1234567890abcdef12345678',
    metadata: {
      createdAt: '2024-02-09T14:50:00Z',
      views: 3120,
      likes: 289,
      tags: ['pizza', 'pepperoni', 'food', 'cheese']
    }
  },
  {
    id: 'ip-012',
    title: 'Sunset Feline',
    description: 'Beautiful cat silhouette against sunset sky. Peaceful and serene imagery.',
    type: 'image',
    collection: 'Color Cats',
    creator: {
      name: 'SunsetShots',
      address: '0x08CACAf0D8b8eCF8CBeB0b8C8b8C8b8C8b8C8b8',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SunsetShots'
    },
    preview: {
      url: 'https://images.unsplash.com/photo-1506755855567-92ff770e8d00?w=800&h=1000&fit=crop',
      thumbnailUrl: {
        cachedUrl: 'https://images.unsplash.com/photo-1506755855567-92ff770e8d00?w=400&h=500&fit=crop',
        contentType: 'image/jpeg',
        thumbnailUrl: 'https://images.unsplash.com/photo-1506755855567-92ff770e8d00?w=400&h=500&fit=crop'
      }
    },
    licenses: [
      {
        type: 'personal',
        price: '0',
        currency: 'IP',
        available: true
      },
      {
        type: 'commercial',
        price: parseEther('0.14').toString(),
        currency: 'IP',
        available: true
      },
      {
        type: 'remix',
        price: parseEther('0.07').toString(),
        currency: 'IP',
        available: true
      }
    ],
    ipId: '0xc234567890abcdef1234567890abcdef12345678',
    metadata: {
      createdAt: '2024-02-11T17:15:00Z',
      views: 1450,
      likes: 118,
      tags: ['cat', 'sunset', 'silhouette', 'peaceful']
    }
  },
  {
    id: 'ip-013',
    title: 'Jazz Noir',
    description: 'Smooth jazz track with saxophone and piano. Perfect for cafes, lounges, and elegant content.',
    type: 'music',
    collection: 'Sigma Music',
    creator: {
      name: 'JazzCat',
      address: '0x09CBCBf1D9b9eDFAC9eBe1b9C9b9C9b9C9b9C9b9',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JazzCat'
    },
    preview: {
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      thumbnailUrl: {
        cachedUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=500&fit=crop',
        contentType: 'image/jpeg',
        thumbnailUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=500&fit=crop'
      }
    },
    licenses: [
      {
        type: 'personal',
        price: parseEther('0.05').toString(),
        currency: 'IP',
        available: true
      },
      {
        type: 'commercial',
        price: parseEther('0.3').toString(),
        currency: 'IP',
        available: true
      },
      {
        type: 'remix',
        price: parseEther('0.18').toString(),
        currency: 'IP',
        available: true
      }
    ],
    ipId: '0xd234567890abcdef1234567890abcdef12345678',
    metadata: {
      createdAt: '2024-02-13T11:30:00Z',
      views: 2670,
      likes: 234,
      tags: ['jazz', 'smooth', 'saxophone', 'elegant']
    }
  },
  {
    id: 'ip-014',
    title: 'Mystical Frog',
    description: 'Ethereal frog with glowing eyes in misty forest. Magical and mysterious artwork.',
    type: 'image',
    collection: 'WTF Freg',
    creator: {
      name: 'MysticArts',
      address: '0x0ACCCCf2DAcAeEFBCAeBe2bACAcACAcACAcACAcA',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MysticArts'
    },
    preview: {
      url: 'https://images.unsplash.com/photo-1490718687940-0ecadf414600?w=800&h=1000&fit=crop',
      thumbnailUrl: {
        cachedUrl: 'https://images.unsplash.com/photo-1490718687940-0ecadf414600?w=400&h=500&fit=crop',
        contentType: 'image/jpeg',
        thumbnailUrl: 'https://images.unsplash.com/photo-1490718687940-0ecadf414600?w=400&h=500&fit=crop'
      }
    },
    licenses: [
      {
        type: 'personal',
        price: parseEther('0.04').toString(),
        currency: 'IP',
        available: true
      },
      {
        type: 'commercial',
        price: parseEther('0.16').toString(),
        currency: 'IP',
        available: true
      },
      {
        type: 'remix',
        price: parseEther('0.1').toString(),
        currency: 'IP',
        available: true
      }
    ],
    ipId: '0xe234567890abcdef1234567890abcdef12345678',
    metadata: {
      createdAt: '2024-02-15T08:45:00Z',
      views: 1920,
      likes: 167,
      tags: ['frog', 'mystical', 'magical', 'forest']
    }
  },
  {
    id: 'ip-015',
    title: 'Artisan Pizza',
    description: 'Rustic wood-fired pizza with fresh ingredients. Premium food photography for restaurants.',
    type: 'image',
    collection: 'PizzaDAO',
    creator: {
      name: 'ArtisanFood',
      address: '0x0BDDDDf3DBcBfEFCCBeBf3cBCbCBCbCBCbCBCbCb',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ArtisanFood'
    },
    preview: {
      url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=1000&fit=crop',
      thumbnailUrl: {
        cachedUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=500&fit=crop',
        contentType: 'image/jpeg',
        thumbnailUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=500&fit=crop'
      }
    },
    licenses: [
      {
        type: 'personal',
        price: parseEther('0.08').toString(),
        currency: 'IP',
        available: true
      },
      {
        type: 'commercial',
        price: parseEther('0.4').toString(),
        currency: 'IP',
        available: true
      }
    ],
    ipId: '0xf234567890abcdef1234567890abcdef12345678',
    metadata: {
      createdAt: '2024-02-17T16:20:00Z',
      views: 2560,
      likes: 221,
      tags: ['pizza', 'artisan', 'food', 'rustic']
    }
  }
]

// Helper function to filter IP assets
export function filterIPAssets(
  assets: IPAsset[],
  filters: {
    type?: string
    collection?: string
    license?: string
    sort?: string
  }
): IPAsset[] {
  let filtered = [...assets]

  // Filter by type
  if (filters.type && filters.type !== 'all') {
    filtered = filtered.filter((asset) => asset.type === filters.type)
  }

  // Filter by collection
  if (filters.collection && filters.collection !== 'all') {
    filtered = filtered.filter((asset) => asset.collection === filters.collection)
  }

  // Filter by license (free/paid)
  if (filters.license && filters.license !== 'all') {
    filtered = filtered.filter((asset) => {
      const hasFree = asset.licenses.some((license) => license.price === '0')
      const hasPaid = asset.licenses.some((license) => license.price !== '0')

      if (filters.license === 'free') return hasFree
      if (filters.license === 'paid') return hasPaid
      return true
    })
  }

  // Sort
  if (filters.sort) {
    switch (filters.sort) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime())
        break
      case 'popular':
        filtered.sort((a, b) => b.metadata.likes - a.metadata.likes)
        break
      case 'price-low':
        filtered.sort((a, b) => {
          const aMin = Math.min(...a.licenses.map((l) => Number(l.price)))
          const bMin = Math.min(...b.licenses.map((l) => Number(l.price)))
          return aMin - bMin
        })
        break
      case 'price-high':
        filtered.sort((a, b) => {
          const aMax = Math.max(...a.licenses.map((l) => Number(l.price)))
          const bMax = Math.max(...b.licenses.map((l) => Number(l.price)))
          return bMax - aMax
        })
        break
    }
  }

  return filtered
}
