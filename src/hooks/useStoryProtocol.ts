import { useAccount, useWalletClient } from 'wagmi'
import { useMemo } from 'react'
import { StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { Address, http, createPublicClient } from 'viem'
import { storyAeneidTestnet } from '@/lib/wagmi'

// Hook for Story Protocol client
export function useStoryProtocol() {
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()

  const client = useMemo(() => {
    if (!walletClient || !isConnected || !address) return null

    try {
      // Create public client for Story Aeneid
      const publicClient = createPublicClient({
        chain: storyAeneidTestnet,
        transport: http('https://aeneid.storyrpc.io'),
      })

      // Initialize Story Protocol client
      const storyClient = StoryClient.newClient({
        account: walletClient.account,
        transport: http('https://aeneid.storyrpc.io'),
        chainId: 'aeneid' as any,
      })

      return storyClient
    } catch (error) {
      console.error('Failed to initialize Story Protocol client:', error)
      return null
    }
  }, [walletClient, isConnected, address])

  return {
    client,
    isConnected,
    address
  }
}

// Hook for licensing an IP asset
// export function useLicenseIP() {
//   const { client, isConnected, address } = useStoryProtocol()

//   const license = async (
//     ipId: Address,
//     licenseTermsId: string | bigint,
//     amount: number = 1
//   ): Promise<{ txHash: string; licenseId: string }> => {
//     if (!client || !isConnected || !address) {
//       throw new Error('Wallet not connected')
//     }

//     try {
//       console.log('Minting license for IP:', ipId, 'with terms:', licenseTermsId)

//       // Try to attach license terms first (may already be attached)
//       try {
//         const attachResponse = await client.license.attachLicenseTerms({
//           ipId: ipId,
//           licenseTermsId: BigInt(licenseTermsId),
//         })
//         console.log('License terms attached:', attachResponse.txHash)
//       } catch (attachError: any) {
//         // If already attached, continue
//         if (!attachError.message?.includes('already attached')) {
//           console.warn('Failed to attach license terms:', attachError.message)
//         }
//       }

//       // Mint license tokens
//       const mintResponse = await client.license.mintLicenseTokens({
//         licenseTermsId: BigInt(licenseTermsId),
//         licensorIpId: ipId,
//         receiver: address,
//         amount: amount,
//       })

//       console.log('License minted:', mintResponse)

//       return {
//         txHash: mintResponse.txHash || '',
//         licenseId: mintResponse.licenseTokenIds?.[0]?.toString() || `license-${Date.now()}`
//       }
//     } catch (error: any) {
//       console.error('Error minting license:', error)
//       throw new Error(error.message || 'Failed to mint license')
//     }
//   }

//   return { license, isConnected }
// }

export function useLicenseIP() {
  const { client, isConnected, address } = useStoryProtocol()

  const license = async (
    ipId: Address,
    licenseTermsId: string | bigint,
    amount: number = 1
  ): Promise<{ txHash: string; licenseId: string }> => {
    if (!client || !isConnected || !address) {
      throw new Error('Wallet not connected')
    }

    try {
      console.log('=== LICENSE PROCESS STARTED ===')
      console.log('IP ID:', ipId)
      console.log('License Terms ID:', licenseTermsId)
      console.log('Amount:', amount)
      console.log('Receiver:', address)

      // Step 1: Try to attach license terms first
      let attachSuccess = false
      try {
        console.log('Attempting to attach license terms...')
        
        const attachResponse = await client.license.attachLicenseTerms({
          ipId: ipId as Address,
          licenseTermsId: BigInt(licenseTermsId),
        })
        
        console.log('✅ License terms attached successfully')
        console.log('Attach TX Hash:', attachResponse.txHash)
        attachSuccess = true
        
        // Wait for blockchain confirmation
        if (attachResponse.txHash) {
          await new Promise(resolve => setTimeout(resolve, 5000))
        }
        
      } catch (attachError: any) {
        console.log('Attach error:', attachError.message)
        
        // Check if already attached (this is OK)
        const errorMsg = attachError.message?.toLowerCase() || ''
        if (
          errorMsg.includes('already attached') ||
          errorMsg.includes('0xb3e96921') ||
          errorMsg.includes('alreadyattached')
        ) {
          console.log('ℹ️ License terms already attached, proceeding...')
          attachSuccess = true
        } else {
          console.error('❌ Failed to attach license terms:', attachError)
          throw new Error(`Failed to attach license terms: ${attachError.message}`)
        }
      }

      // Only proceed if attach was successful
      if (!attachSuccess) {
        throw new Error('Failed to attach license terms. Cannot mint license.')
      }

      // Step 2: Mint license tokens
      console.log('Attempting to mint license tokens...')
      
      const mintResponse = await client.license.mintLicenseTokens({
        licensorIpId: ipId as Address,
        licenseTermsId: BigInt(licenseTermsId),
        amount: BigInt(amount),
        receiver: address as Address,
      })

      console.log('✅ License minted successfully')
      console.log('Mint TX Hash:', mintResponse.txHash)
      console.log('License Token IDs:', mintResponse.licenseTokenIds)

      if (!mintResponse.txHash) {
        throw new Error('No transaction hash returned from mint')
      }

      // Wait for transaction confirmation
      await new Promise(resolve => setTimeout(resolve, 3000))

      return {
        txHash: mintResponse.txHash,
        licenseId: mintResponse.licenseTokenIds?.[0]?.toString() || `license-${Date.now()}`
      }
      
    } catch (error: any) {
      console.error('=== LICENSE PROCESS FAILED ===')
      console.error('Error:', error)
      console.error('Error message:', error.message)
      console.error('Error details:', error.cause || error.details)
      
      // Provide more specific error messages
      if (error.message?.includes('not attached')) {
        throw new Error('License terms are not attached to this IP. Please try again.')
      }
      
      if (error.message?.includes('invalid parameters')) {
        throw new Error('Invalid minting parameters. Please verify the IP ID and license terms.')
      }
      
      if (error.message?.includes('insufficient')) {
        throw new Error('Insufficient balance to mint license. Please check your wallet.')
      }
      
      throw new Error(error.message || 'Failed to mint license tokens')
    }
  }

  return { license, isConnected }
}

// Hook for registering IP
export function useRegisterIP() {
  const { client, isConnected, address } = useStoryProtocol()

  const register = async (
    nftContract: Address,
    tokenId: string | bigint,
    metadata?: {
      metadataURI?: string
      metadataHash?: Address
      nftMetadataHash?: Address
    }
  ): Promise<{ ipId: string; txHash: string }> => {
    if (!client || !isConnected || !address) {
      throw new Error('Wallet not connected')
    }

    try {
      console.log('Registering IP for NFT:', nftContract, tokenId)

      // Register the NFT as an IP Asset
      const response = await client.ipAsset.register({
        nftContract: nftContract,
        tokenId: BigInt(tokenId),
        ...(metadata?.metadataURI && {
          metadata: {
            metadataURI: metadata.metadataURI,
            metadataHash: metadata.metadataHash || '0x' as Address,
            nftMetadataHash: metadata.nftMetadataHash || '0x' as Address,
          }
        })
      })

      console.log('IP registered:', response)

      return {
        ipId: response.ipId || '',
        txHash: response.txHash || ''
      }
    } catch (error: any) {
      console.error('Error registering IP:', error)
      throw new Error(error.message || 'Failed to register IP')
    }
  }

  return { register, isConnected }
}

// Hook for attaching license terms to an IP
// export function useAttachLicenseTerms() {
//   const { client, isConnected } = useStoryProtocol()

//   const attachTerms = async (
//     ipId: Address,
//     licenseTermsId: string | bigint
//   ): Promise<{ txHash: string; success: boolean }> => {
//     if (!client || !isConnected) {
//       throw new Error('Wallet not connected')
//     }

//     try {
//       console.log('Attaching license terms:', licenseTermsId, 'to IP:', ipId)

//       const response = await client.license.attachLicenseTerms({
//         ipId: ipId,
//         licenseTermsId: BigInt(licenseTermsId),
//       })

//       console.log('License terms attached:', response)

//       return {
//         txHash: response.txHash || '',
//         success: true
//       }
//     } catch (error: any) {
//       console.error('Error attaching license terms:', error)

//       // If already attached, consider it a success
//       if (error.message?.includes('already attached')) {
//         return {
//           txHash: '',
//           success: true
//         }
//       }

//       throw new Error(error.message || 'Failed to attach license terms')
//     }
//   }

//   return { attachTerms, isConnected }
// }

export function useAttachLicenseTerms() {
  const { client, isConnected } = useStoryProtocol()

  const attachTerms = async (
    ipId: Address,
    licenseTermsId: string | bigint
  ): Promise<{ txHash: string; success: boolean }> => {
    if (!client || !isConnected) {
      throw new Error('Wallet not connected')
    }

    try {
      console.log('=== ATTACHING LICENSE TERMS ===')
      console.log('IP ID:', ipId)
      console.log('License Terms ID:', licenseTermsId)

      const response = await client.license.attachLicenseTerms({
        ipId: ipId as Address,
        licenseTermsId: BigInt(licenseTermsId),
      })

      console.log('✅ Attach Response:', response)
      
      // Wait for confirmation
      if (response.txHash) {
        console.log('Waiting for transaction confirmation...')
        await new Promise(resolve => setTimeout(resolve, 5000))
      }

      return {
        txHash: response.txHash || '',
        success: true
      }
    } catch (error: any) {
      console.error('❌ Attach Error:', error)
      
      // Check if already attached
      const errorMsg = error.message?.toLowerCase() || ''
      if (
        errorMsg.includes('already attached') ||
        errorMsg.includes('0xb3e96921') ||
        errorMsg.includes('alreadyattached')
      ) {
        console.log('ℹ️ License terms already attached')
        return {
          txHash: '',
          success: true
        }
      }

      throw error
    }
  }

  return { attachTerms, isConnected }
}

// Hook for fetching IP assets from Story Protocol
export function useFetchIPAssets() {
  const { client, isConnected } = useStoryProtocol()

  const fetchIPAssets = async (options?: {
    limit?: number
    offset?: number
  }): Promise<any[]> => {
    if (!client) {
      console.warn('Story Protocol client not initialized')
      return []
    }

    try {
      console.log('Fetching IP assets from Story Protocol...')

      // Note: Story Protocol SDK may not have a direct "list all IPs" method
      // You would typically fetch IPs you own or specific IPs by ID
      // For now, return empty array as placeholder

      // Example of how you might fetch specific IPs:
      // const ipAsset = await client.ipAsset.get(ipId)

      return []
    } catch (error: any) {
      console.error('Error fetching IP assets:', error)
      return []
    }
  }

  return { fetchIPAssets, isConnected }
}

// Helper: Get default PIL terms IDs for common license types
// These are standard license term IDs on Story Protocol
export const DEFAULT_LICENSE_TERMS = {
  // Non-commercial Social Remixing (free, derivatives allowed)
  NON_COMMERCIAL_REMIX: '1',

  // Commercial Use (paid, no derivatives)
  COMMERCIAL_USE: '2',

  // Commercial Remix (paid, derivatives allowed with rev share)
  COMMERCIAL_REMIX: '3',
} as const

// Map our license types to Story Protocol license terms
export function getLicenseTermsId(licenseType: 'personal' | 'commercial' | 'remix'): string {
  switch (licenseType) {
    case 'personal':
      return DEFAULT_LICENSE_TERMS.NON_COMMERCIAL_REMIX
    case 'commercial':
      return DEFAULT_LICENSE_TERMS.COMMERCIAL_USE
    case 'remix':
      return DEFAULT_LICENSE_TERMS.COMMERCIAL_REMIX
    default:
      return DEFAULT_LICENSE_TERMS.NON_COMMERCIAL_REMIX
  }
}

// Helper: Format IP ID for display
export function formatIPId(ipId: string): string {
  if (!ipId || ipId.length < 10) return ipId
  return `${ipId.slice(0, 6)}...${ipId.slice(-4)}`
}
