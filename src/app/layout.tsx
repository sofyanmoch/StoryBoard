import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Web3Provider } from '@/components/providers/Web3Provider'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StoryBoard - Visual IP Licensing Marketplace',
  description: 'Discover and license IP assets with a Tinder-like swipe interface powered by Story Protocol',
  keywords: ['IP', 'licensing', 'NFT', 'Story Protocol', 'marketplace'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#1E1E2E',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              },
            }}
          />
        </Web3Provider>
      </body>
    </html>
  )
}
