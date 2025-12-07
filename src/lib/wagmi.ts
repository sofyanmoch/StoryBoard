import { getDefaultConfig } from 'connectkit'
import { createConfig, http } from 'wagmi'
import { defineChain } from 'viem'

// Define Story Aeneid Testnet chain
export const storyAeneidTestnet = defineChain({
  id: 1315,
  name: 'Story Aeneid Testnet',
  network: 'story-aeneid-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'IP',
    symbol: 'IP',
  },
  rpcUrls: {
    default: {
      http: ['https://aeneid.storyrpc.io'],
    },
    public: {
      http: ['https://aeneid.storyrpc.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Story Aeneid Explorer',
      url: 'https://aeneid.storyscan.xyz',
    },
  },
  testnet: true,
})

export const config = createConfig(
  getDefaultConfig({
    chains: [storyAeneidTestnet],
    transports: {
      [storyAeneidTestnet.id]: http('https://aeneid.storyrpc.io'),
    },
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
    appName: 'StoryBoard',
    appDescription: 'Visual IP Licensing Marketplace with Swipe UI for Story Protocol',
    appUrl: 'https://storyboard.app',
    appIcon: 'https://storyboard.app/icon.png',
  })
)
