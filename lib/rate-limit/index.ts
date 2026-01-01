/**
 * Rate Limiting Utility
 *
 * Implements token bucket algorithm using LRU cache for rate limiting.
 * Each IP address gets a bucket that refills over time.
 */

import { LRUCache } from 'lru-cache'
import type { RateLimitConfig } from './config'

export interface RateLimitResult {
  /** Whether the request is allowed */
  success: boolean
  /** Number of requests remaining in current window */
  remaining: number
  /** When the rate limit resets (Unix timestamp) */
  reset: number
}

/**
 * Creates a rate limiter instance
 */
export const createRateLimiter = (config: RateLimitConfig) => {
  const tokenCache = new LRUCache<string, number[]>({
    max: config.uniqueTokenPerInterval,
    ttl: config.interval,
  })

  return {
    /**
     * Check if a request should be rate limited
     *
     * @param token - Unique identifier (usually IP address)
     * @returns Rate limit result
     */
    check: async (token: string): Promise<RateLimitResult> => {
      const now = Date.now()
      const tokenCount = tokenCache.get(token) ?? [0, now]

      // Reset count if interval has passed
      if (now - tokenCount[1] > config.interval) {
        tokenCount[0] = 0
        tokenCount[1] = now
      }

      tokenCount[0] += 1
      tokenCache.set(token, tokenCount)

      const currentUsage = tokenCount[0]
      const isRateLimited = currentUsage > config.limit
      const reset = tokenCount[1] + config.interval

      return {
        success: !isRateLimited,
        remaining: Math.max(0, config.limit - currentUsage),
        reset,
      }
    },

    /**
     * Get current usage for a token without incrementing
     */
    getUsage: (token: string): number => {
      const tokenCount = tokenCache.get(token)
      return tokenCount ? tokenCount[0] : 0
    },

    /**
     * Reset rate limit for a token
     */
    reset: (token: string): void => {
      tokenCache.delete(token)
    },
  }
}

// Export pre-configured rate limiters
export { WAITLIST_RATE_LIMIT, CONTACT_RATE_LIMIT, API_RATE_LIMIT } from './config'
