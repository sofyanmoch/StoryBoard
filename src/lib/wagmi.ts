import { getDefaultConfig } from 'connectkit'
import { createConfig } from 'wagmi'
import { STORY_CHAIN_CONFIG } from './constants'

const chains = [STORY_CHAIN_CONFIG] as const

export const config = createConfig(
  getDefaultConfig({
    chains,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
    appName: 'StoryBoard',
    appDescription: 'Visual IP Licensing Marketplace with Swipe UI for Story Protocol',
    appUrl: 'https://storyboard.app',
    appIcon: 'https://storyboard.app/icon.png',
  })
)
