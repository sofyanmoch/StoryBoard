import { useAccount, useWalletClient, useSwitchChain } from 'wagmi'
import { useMemo, useCallback } from 'react'
import { StoryClient, StoryConfig, aeneid } from '@story-protocol/core-sdk'
import { Address, http, custom } from 'viem'
import { storyAeneidTestnet } from '@/lib/wagmi'

// Story Aeneid configuration
const STORY_AENEID_CONFIG = {
  rpcProviderUrl: 'https://aeneid.storyrpc.io',
  chainId: 'aeneid' as const,
  chain: aeneid,
}

// Hook for Story Protocol client
export function useStoryProtocol() {
  const { address, isConnected, chain, connector } = useAccount()
  const { data: walletClient, isLoading: isWalletLoading } = useWalletClient({ 
    chainId: storyAeneidTestnet.id 
  })
  const { switchChainAsync } = useSwitchChain()

  const client = useMemo(() => {
    if (!walletClient || !isConnected || !address) {
      console.log('Story Client - Missing requirements:', { 
        hasWalletClient: !!walletClient, 
        isConnected, 
        address,
        isWalletLoading 
      })
      return null
    }

    try {
      console.log('=== Initializing Story Protocol Client ===')
      console.log('Wallet Address:', address)
      // console.log('Chain ID:', walletClient.chain?.id)

      if (!walletClient.account) {
        console.error('WalletClient has no account')
        return null
      }

      // Create StoryClient with proper configuration
      const storyConfig: StoryConfig = {
        account: walletClient.account,
        transport: custom({
          async request({ method, params }) {
            return await walletClient.request({ method, params } as any)
          }
        }),
        chainId: 'aeneid',
      }

      const storyClient = StoryClient.newClient(storyConfig)
      
      console.log('✅ Story Protocol client initialized successfully')
      return storyClient

    } catch (error) {
      console.error('❌ Failed to initialize Story Protocol client:', error)
      return null
    }
  }, [walletClient, isConnected, address, isWalletLoading])

  const ensureCorrectChain = useCallback(async () => {
    if (chain?.id !== storyAeneidTestnet.id) {
      console.log('Switching to Story Aeneid Testnet...')
      if (switchChainAsync) {
        await switchChainAsync({ chainId: storyAeneidTestnet.id })
        await new Promise(resolve => setTimeout(resolve, 2000))
        return true
      }
      throw new Error(`Please switch to Story Aeneid Testnet (Chain ID: ${storyAeneidTestnet.id})`)
    }
    return true
  }, [chain?.id, switchChainAsync])

  return {
    client,
    isConnected,
    isReady: !!client && isConnected && !!address,
    isLoading: isWalletLoading,
    address,
    walletClient,
    chain,
    switchChain: switchChainAsync,
    ensureCorrectChain,
  }
}

// Hook for licensing an IP asset
export function useLicenseIP() {
  const { 
    client, 
    isConnected, 
    isReady,
    address, 
    walletClient, 
    chain, 
    ensureCorrectChain 
  } = useStoryProtocol()

  const license = useCallback(async (
    ipId: Address,
    licenseTermsId: string | bigint,
    amount: number = 1
  ): Promise<{ txHash: string; licenseId: string }> => {
    
    if (!isReady || !client) {
      throw new Error('Story Protocol client not ready. Please ensure your wallet is connected.')
    }
    
    if (!address) {
      throw new Error('Wallet address not available.')
    }

    if (!walletClient?.account) {
      throw new Error('Wallet account not available. Please reconnect your wallet.')
    }

    console.log('=== LICENSE MINTING PROCESS ===')
    console.log('IP ID:', ipId)
    console.log('License Terms ID:', licenseTermsId.toString())
    console.log('Amount:', amount)
    console.log('Receiver:', address)

    if (!ipId?.startsWith('0x') || ipId.length !== 42) {
      throw new Error(`Invalid IP ID format: ${ipId}`)
    }

    const termsId = BigInt(licenseTermsId)
    if (termsId < BigInt(1)) {
      throw new Error(`Invalid license terms ID: ${licenseTermsId}`)
    }

    try {
      await ensureCorrectChain()

      // Step 1: Try to attach license terms
      console.log('Step 1: Checking/Attaching license terms...')

      try {
        const attachResponse = await client.license.attachLicenseTerms({
          ipId: ipId,
          licenseTermsId: termsId,
        })
        
        if (attachResponse.success) {
          console.log('✅ License terms attached successfully')
          console.log('TX Hash:', attachResponse.txHash)
          // Wait for blockchain confirmation
          await new Promise(resolve => setTimeout(resolve, 5000))
        } else {
          console.log('ℹ️ License terms already attached to this IP')
        }
      } catch (attachError: any) {
        const errorMsg = (attachError.message || '').toLowerCase()
        const errorStr = JSON.stringify(attachError).toLowerCase()
        
        const isAlreadyAttached = 
          errorMsg.includes('already attached') ||
          errorMsg.includes('alreadyattached') ||
          errorMsg.includes('0xb3e96921') ||
          errorStr.includes('0xb3e96921')
        
        const isPermissionDenied = 
          errorMsg.includes('permission') ||
          errorMsg.includes('accesscontroller')

        if (isAlreadyAttached) {
          console.log('ℹ️ License terms already attached, proceeding...')
        } else if (isPermissionDenied) {
          console.log('ℹ️ Permission denied on attach - terms may be attached by owner')
        } else {
          console.warn('Attach warning:', attachError.message)
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000))

      // Step 2: Mint License Tokens
      console.log('Step 2: Minting License Tokens...')

      const mintResponse = await client.license.mintLicenseTokens({
        licensorIpId: ipId,
        licenseTermsId: termsId,
        receiver: address as Address,
        amount: amount,
        maxMintingFee: BigInt(0),
        maxRevenueShare: 100,
      })

      console.log('✅ License tokens minted successfully!')
      console.log('TX Hash:', mintResponse.txHash)
      console.log('License Token IDs:', mintResponse.licenseTokenIds)

      if (!mintResponse.txHash) {
        throw new Error('No transaction hash returned')
      }

      return {
        txHash: mintResponse.txHash,
        licenseId: mintResponse.licenseTokenIds?.[0]?.toString() || `license-${Date.now()}`
      }

    } catch (error: any) {
      console.error('=== LICENSE MINTING FAILED ===')
      console.error('Error:', error)
      
      const errorMsg = (error.message || '').toLowerCase()
      
      if (errorMsg.includes('not attached')) {
        throw new Error(
          `License terms ID ${licenseTermsId} is not attached to this IP Asset. ` +
          `The IP owner must attach license terms before others can mint licenses.`
        )
      }
      
      if (errorMsg.includes('permission')) {
        throw new Error('Permission denied. You may not have permission to mint licenses for this IP.')
      }
      
      if (errorMsg.includes('insufficient') || errorMsg.includes('balance')) {
        throw new Error('Insufficient balance. Please get testnet tokens from the faucet.')
      }
      
      if (errorMsg.includes('rejected') || errorMsg.includes('user denied')) {
        throw new Error('Transaction rejected by user.')
      }

      throw new Error(error.message || 'Failed to mint license tokens.')
    }
  }, [client, isReady, address, walletClient, chain, ensureCorrectChain])

  return { license, isConnected, isReady, client }
}

// Hook for attaching license terms
export function useAttachLicenseTerms() {
  const { client, isConnected, isReady, ensureCorrectChain } = useStoryProtocol()

  const attachTerms = useCallback(async (
    ipId: Address,
    licenseTermsId: string | bigint
  ): Promise<{ txHash: string; success: boolean }> => {
    
    if (!isReady || !client) {
      throw new Error('Story Protocol client not ready.')
    }

    console.log('=== ATTACHING LICENSE TERMS ===')
    console.log('IP ID:', ipId)
    console.log('License Terms ID:', licenseTermsId.toString())

    if (!ipId?.startsWith('0x') || ipId.length !== 42) {
      throw new Error('Invalid IP ID format')
    }

    const termsId = BigInt(licenseTermsId)
    if (termsId < BigInt(1)) {
      throw new Error('Invalid license terms ID')
    }

    try {
      await ensureCorrectChain()

      const response = await client.license.attachLicenseTerms({
        ipId: ipId,
        licenseTermsId: termsId,
      })

      if (response.success) {
        console.log('✅ License terms attached')
        console.log('TX Hash:', response.txHash)
        
        // Wait for confirmation
        if (response.txHash) {
          await new Promise(resolve => setTimeout(resolve, 5000))
        }
        
        return { txHash: response.txHash || '', success: true }
      } else {
        console.log('ℹ️ License terms already attached')
        return { txHash: '', success: true }
      }

    } catch (error: any) {
      const errorMsg = (error.message || '').toLowerCase()
      
      if (
        errorMsg.includes('already') || 
        errorMsg.includes('0xb3e96921') ||
        errorMsg.includes('alreadyattached')
      ) {
        console.log('ℹ️ License terms already attached')
        return { txHash: '', success: true }
      }
      
      if (errorMsg.includes('permission')) {
        throw new Error('You must be the IP owner to attach license terms.')
      }
      
      throw new Error(error.message || 'Failed to attach license terms')
    }
  }, [client, isReady, ensureCorrectChain])

  return { attachTerms, isConnected, isReady }
}

// Hook for registering IP
export function useRegisterIP() {
  const { client, isConnected, isReady, address, ensureCorrectChain } = useStoryProtocol()

  const register = useCallback(async (
    nftContract: Address,
    tokenId: string | bigint,
    metadata?: {
      metadataURI?: string
      metadataHash?: Address
      nftMetadataHash?: Address
    }
  ): Promise<{ ipId: string; txHash: string }> => {
    
    if (!isReady || !client || !address) {
      throw new Error('Story Protocol client not ready.')
    }

    console.log('=== REGISTERING IP ASSET ===')
    console.log('NFT Contract:', nftContract)
    console.log('Token ID:', tokenId.toString())

    try {
      await ensureCorrectChain()

      const response = await client.ipAsset.register({
        nftContract: nftContract,
        tokenId: BigInt(tokenId),
        ...(metadata?.metadataURI && {
          ipMetadata: {
            ipMetadataURI: metadata.metadataURI,
            ipMetadataHash: metadata.metadataHash || ('0x' as Address),
            nftMetadataHash: metadata.nftMetadataHash || ('0x' as Address),
          }
        })
      })

      console.log('✅ IP registered:', response.ipId)
      
      // Wait for confirmation
      if (response.txHash) {
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
      
      return {
        ipId: response.ipId || '',
        txHash: response.txHash || ''
      }
    } catch (error: any) {
      console.error('❌ Register error:', error)
      
      if (error.message?.includes('already registered')) {
        throw new Error('This NFT is already registered as an IP asset.')
      }
      
      throw new Error(error.message || 'Failed to register IP')
    }
  }, [client, isReady, address, ensureCorrectChain])

  return { register, isConnected, isReady }
}

// Hook for remix/derivative IP
export function useRemixIP() {
  const { client, isConnected, isReady, address, ensureCorrectChain } = useStoryProtocol()

  const remix = useCallback(async (
    parentIpId: Address,
    nftContract: Address,
    tokenId: string | bigint,
    licenseTermsId: string | bigint = '1',
    metadataURI?: string
  ): Promise<{ childIpId: string; txHash: string }> => {
    
    if (!isReady || !client || !address) {
      throw new Error('Story Protocol client not ready.')
    }

    console.log('=== CREATING DERIVATIVE IP ===')
    console.log('Parent IP:', parentIpId)
    console.log('NFT Contract:', nftContract)
    console.log('Token ID:', tokenId.toString())

    try {
      await ensureCorrectChain()

      // Step 1: Register the NFT as IP
      console.log('Step 1: Registering NFT as IP Asset...')
      const registerResponse = await client.ipAsset.register({
        nftContract: nftContract,
        tokenId: BigInt(tokenId),
      })

      if (!registerResponse.ipId) {
        throw new Error('Failed to register derivative IP')
      }

      const childIpId = registerResponse.ipId
      console.log('✅ Child IP registered:', childIpId)

      // Wait for registration to confirm
      await new Promise(resolve => setTimeout(resolve, 5000))

      // Step 2: Link as derivative
      console.log('Step 2: Linking to parent IP...')
      const linkResponse = await client.ipAsset.registerDerivative({
        childIpId: childIpId as Address,
        parentIpIds: [parentIpId],
        licenseTermsIds: [BigInt(licenseTermsId)],
      })

      console.log('✅ Derivative linked:', linkResponse.txHash)

      return {
        childIpId: childIpId,
        txHash: linkResponse.txHash || registerResponse.txHash || ''
      }
    } catch (error: any) {
      console.error('❌ Remix error:', error)
      
      if (error.message?.includes('already registered')) {
        throw new Error('This NFT is already registered as an IP.')
      }
      
      if (error.message?.includes('not owner')) {
        throw new Error('You must own the NFT to create a derivative.')
      }
      
      throw new Error(error.message || 'Failed to create derivative')
    }
  }, [client, isReady, address, ensureCorrectChain])

  return { remix, isConnected, isReady }
}

// Default license terms IDs
export const DEFAULT_LICENSE_TERMS = {
  NON_COMMERCIAL_REMIX: '1',
  COMMERCIAL_USE: '2',
  COMMERCIAL_REMIX: '3',
} as const

export function getLicenseTermsId(licenseType: 'personal' | 'commercial' | 'remix'): string {
  switch (licenseType) {
    case 'personal': return DEFAULT_LICENSE_TERMS.NON_COMMERCIAL_REMIX
    case 'commercial': return DEFAULT_LICENSE_TERMS.COMMERCIAL_USE
    case 'remix': return DEFAULT_LICENSE_TERMS.COMMERCIAL_REMIX
    default: return DEFAULT_LICENSE_TERMS.NON_COMMERCIAL_REMIX
  }
}

export function formatIPId(ipId: string): string {
  if (!ipId || ipId.length < 10) return ipId
  return `${ipId.slice(0, 6)}...${ipId.slice(-4)}`
}