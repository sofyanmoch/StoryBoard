import { useCallback, useState } from 'react'
import { useStoryProtocol } from './useStoryProtocol'
import { Address } from 'viem'

/**
 * Simplified hook for royalty token operations using Story Protocol SDK.
 *
 * This hook enables:
 * 1. Viewing royalty vault information
 * 2. Checking claimable revenue
 * 3. Claiming revenue from IP assets
 *
 * Fractional ownership is represented by holding royalty tokens (ERC-20)
 * from Story Protocol's royalty vaults.
 */
export function useRoyaltyShares() {
  const { client, isReady, ensureCorrectChain, address } = useStoryProtocol()
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Get the royalty vault address for an IP asset.
   * Each IP has its own vault that holds revenue and distributes to token holders.
   */
  const getVaultAddress = useCallback(async (
    ipId: Address
  ): Promise<Address | null> => {
    if (!isReady || !client) {
      console.log('Story Protocol client not ready')
      return null
    }

    try {
      const vaultAddress = await client.royalty.getRoyaltyVaultAddress(ipId)
      console.log('Royalty Vault for', ipId, ':', vaultAddress)
      return vaultAddress
    } catch (error: any) {
      console.error('Failed to get vault:', error)
      return null
    }
  }, [client, isReady])

  /**
   * Check how much revenue is claimable for an address.
   *
   * @param ipId - The IP asset address
   * @param claimer - Address to check claimable amount for
   * @param token - Currency token address (e.g., WETH, USDC)
   */
  const checkClaimableRevenue = useCallback(async (
    ipId: Address,
    claimer: Address,
    token: Address
  ): Promise<bigint> => {
    if (!isReady || !client) {
      throw new Error('Story Protocol client not ready')
    }

    try {
      const amount = await client.royalty.claimableRevenue({
        ipId,
        claimer,
        token
      })

      console.log('Claimable revenue:', amount.toString())
      return amount
    } catch (error: any) {
      console.error('Failed to check claimable revenue:', error)
      return BigInt(0)
    }
  }, [client, isReady])

  /**
   * Claim all revenue from an IP's royalty vault.
   * This transfers the claimant's share of revenue based on royalty token holdings.
   */
  const claimRevenue = useCallback(async (
    ipId: Address,
    currencyTokens: Address[]
  ): Promise<{ success: boolean; txHashes?: string[] }> => {
    if (!isReady || !client || !address) {
      throw new Error('Wallet not connected')
    }

    setIsLoading(true)

    try {
      await ensureCorrectChain()

      console.log('=== CLAIMING REVENUE ===')
      console.log('IP ID:', ipId)
      console.log('Claimer:', address)
      console.log('Currency Tokens:', currencyTokens)

      const response = await client.royalty.claimAllRevenue({
        ancestorIpId: ipId,
        claimer: address,
        childIpIds: [], // No child IPs for direct claims
        royaltyPolicies: [], // Will be auto-populated
        currencyTokens: currencyTokens
      })

      console.log('✅ Revenue claimed!')
      console.log('TX Hashes:', response.txHashes)

      return {
        success: true,
        txHashes: response.txHashes
      }
    } catch (error: any) {
      console.error('Failed to claim revenue:', error)

      const errorMsg = (error.message || '').toLowerCase()

      if (errorMsg.includes('no claimable')) {
        throw new Error('No revenue available to claim')
      }

      if (errorMsg.includes('not a token holder')) {
        throw new Error('You do not own any royalty tokens for this IP')
      }

      throw new Error(error.message || 'Failed to claim revenue')
    } finally {
      setIsLoading(false)
    }
  }, [client, isReady, address, ensureCorrectChain])

  /**
   * Simulate owning royalty tokens for demo purposes.
   * In production, users would receive tokens through:
   * 1. IP registration with royalty distribution
   * 2. Secondary market purchases
   * 3. Direct transfers from IP owners
   */
  const simulateRoyaltyTokenOwnership = useCallback((
    ipId: Address,
    sharePercentage: number
  ): {
    ipId: Address
    sharePercentage: number
    royaltyTokens: number
    estimatedValue: string
  } => {
    // 1% ownership = 1,000,000 tokens (from 100M total supply)
    const royaltyTokens = (sharePercentage / 100) * 100_000_000

    return {
      ipId,
      sharePercentage,
      royaltyTokens,
      estimatedValue: '0.00' // Would be calculated from market data
    }
  }, [])

  return {
    getVaultAddress,
    checkClaimableRevenue,
    claimRevenue,
    simulateRoyaltyTokenOwnership,
    isLoading,
    isReady
  }
}

/**
 * Helper: Calculate royalty tokens from percentage
 */
export function calculateRoyaltyTokens(percentage: number): number {
  return (percentage / 100) * 100_000_000
}

/**
 * Helper: Calculate percentage from royalty tokens
 */
export function calculateSharePercentage(tokens: number): number {
  return (tokens / 100_000_000) * 100
}

/**
 * Helper: Format royalty tokens for display
 */
export function formatRoyaltyTokens(tokens: number): string {
  if (tokens >= 1_000_000) {
    return `${(tokens / 1_000_000).toFixed(2)}M`
  }
  if (tokens >= 1_000) {
    return `${(tokens / 1_000).toFixed(2)}K`
  }
  return tokens.toString()
}
