'use client'

import { type ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider } from 'connectkit'
import { config } from '@/lib/wagmi'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          theme="midnight"
          mode="dark"
          customTheme={{
            '--ck-connectbutton-background': '#FF6B35',
            '--ck-connectbutton-hover-background': '#E55A2B',
            '--ck-connectbutton-active-background': '#CC4F23',
            '--ck-primary-button-background': '#FF6B35',
            '--ck-primary-button-hover-background': '#E55A2B',
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
