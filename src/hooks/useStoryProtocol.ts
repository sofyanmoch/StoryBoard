import { useAccount, useWalletClient } from 'wagmi'
import { useMemo } from 'react'
import { StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { Address, Hex, http } from 'viem'

// Story Protocol configuration for Odyssey Testnet
const STORY_CONFIG: StoryConfig = {
  account: '0x' as Address, // Will be overridden by wallet
  transport: http(process.env.NEXT_PUBLIC_STORY_RPC_URL || 'https://odyssey.storyrpc.io'),
  chainId: 'odyssey' as any, // Story Odyssey testnet
}

// Hook for Story Protocol client
export function useStoryProtocol() {
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()

  const client = useMemo(() => {
    if (!walletClient || !isConnected || !address) return null

    try {
      // Initialize Story Protocol client with wallet
      const storyClient = StoryClient.newClient({
        ...STORY_CONFIG,
        account: walletClient.account,
        wallet: walletClient as any,
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
      console.log('Minting license for IP:', ipId)

      // Attach license terms to IP if not already attached
      // This is required before minting license tokens
      const attachResponse = await client.license.attachLicenseTerms({
        ipId: ipId,
        licenseTermsId: BigInt(licenseTermsId),
      })

      console.log('License terms attached:', attachResponse.txHash)

      // Mint license tokens
      const mintResponse = await client.license.mintLicenseTokens({
        licenseTermsId: BigInt(licenseTermsId),
        licensorIpId: ipId,
        receiver: address,
        amount: amount,
      })

      console.log('License minted:', mintResponse)

      return {
        txHash: mintResponse.txHash || '',
        licenseId: mintResponse.licenseTokenIds?.[0]?.toString() || `license-${Date.now()}`
      }
    } catch (error: any) {
      console.error('Error minting license:', error)

      // Handle specific errors
      if (error.message?.includes('already attached')) {
        // License terms already attached, try minting directly
        try {
          const mintResponse = await client.license.mintLicenseTokens({
            licenseTermsId: BigInt(licenseTermsId),
            licensorIpId: ipId,
            receiver: address,
            amount: amount,
          })

          return {
            txHash: mintResponse.txHash || '',
            licenseId: mintResponse.licenseTokenIds?.[0]?.toString() || `license-${Date.now()}`
          }
        } catch (mintError: any) {
          throw new Error(mintError.message || 'Failed to mint license')
        }
      }

      throw new Error(error.message || 'Failed to mint license')
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
      metadataHash?: string
      nftMetadataHash?: string
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
      console.log('Attaching license terms:', licenseTermsId, 'to IP:', ipId)

      const response = await client.license.attachLicenseTerms({
        ipId: ipId,
        licenseTermsId: BigInt(licenseTermsId),
      })

      console.log('License terms attached:', response)

      return {
        txHash: response.txHash || '',
        success: true
      }
    } catch (error: any) {
      console.error('Error attaching license terms:', error)

      // If already attached, consider it a success
      if (error.message?.includes('already attached')) {
        return {
          txHash: '',
          success: true
        }
      }

      throw new Error(error.message || 'Failed to attach license terms')
    }
  }

  return { attachTerms, isConnected }
}

// Hook for creating PIL (Programmable IP License) terms
export function useRegisterPILTerms() {
  const { client, isConnected } = useStoryProtocol()

  const registerTerms = async (params: {
    transferable: boolean
    royaltyPolicy?: Address
    defaultMintingFee?: bigint
    commercialUse?: boolean
    commercialAttribution?: boolean
    commercializerChecker?: Address
    commercializerCheckerData?: Address
    commercialRevShare?: number
    derivativesAllowed?: boolean
    derivativesAttribution?: boolean
    derivativesApproval?: boolean
    derivativesReciprocal?: boolean
    territories?: string[]
    distributionChannels?: string[]
    contentRestrictions?: string[]
  }): Promise<{ licenseTermsId: string; txHash: string }> => {
    if (!client || !isConnected) {
      throw new Error('Wallet not connected')
    }

    try {
      console.log('Registering PIL terms:', params)

      // const response = await client.license.registerPILTerms({
      //   transferable: params.transferable,
      //   royaltyPolicy: params.royaltyPolicy || '0x0000000000000000000000000000000000000000' as Address,
      //   defaultMintingFee: params.defaultMintingFee || BigInt(0),
      //   commercialUse: params.commercialUse || false,
      //   commercialAttribution: params.commercialAttribution || false,
      //   commercializerChecker: params.commercializerChecker || '0x0000000000000000000000000000000000000000' as Address,
      //   commercializerCheckerData: params.commercializerCheckerData || '0x' as Address,
      //   commercialRevShare: params.commercialRevShare || 0,
      //   derivativesAllowed: params.derivativesAllowed || false,
      //   derivativesAttribution: params.derivativesAttribution || false,
      //   derivativesApproval: params.derivativesApproval || false,
      //   derivativesReciprocal: params.derivativesReciprocal || false,
      //   territories: params.territories || [],
      //   distributionChannels: params.distributionChannels || [],
      //   contentRestrictions: params.contentRestrictions || [],
      // })

      const response = await client.license.registerPILTerms({
        transferable: params.transferable,
        royaltyPolicy: params.royaltyPolicy || '0x0000000000000000000000000000000000000000' as Address,
        defaultMintingFee: params.defaultMintingFee || BigInt(0),
        currency: (params as any).currency || '0x0000000000000000000000000000000000000000' as Address,
        uri: (params as any).uri || '',
        commercialUse: params.commercialUse || false,
        commercialAttribution: params.commercialAttribution || false,
        commercializerChecker: params.commercializerChecker || '0x0000000000000000000000000000000000000000' as Address,
        commercializerCheckerData: params.commercializerCheckerData || '0x' as Hex,
        commercialRevShare: params.commercialRevShare || 0,
        commercialRevCeiling: (params as any).commercialRevCeiling || BigInt(0),
        derivativesAllowed: params.derivativesAllowed || false,
        derivativesAttribution: params.derivativesAttribution || false,
        derivativesApproval: params.derivativesApproval || false,
        derivativesReciprocal: params.derivativesReciprocal || false,
        derivativeRevCeiling: (params as any).derivativeRevCeiling || BigInt(0),
        expiration: (params as any).expiration || BigInt(0),
      })

      console.log('PIL terms registered:', response)

      return {
        licenseTermsId: response.licenseTermsId?.toString() || '',
        txHash: response.txHash || ''
      }
    } catch (error: any) {
      console.error('Error registering PIL terms:', error)
      throw new Error(error.message || 'Failed to register PIL terms')
    }
  }

  return { registerTerms, isConnected }
}

// Helper: Get default PIL terms IDs for common license types
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
