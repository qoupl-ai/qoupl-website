/**
 * Rate Limit Configuration
 *
 * Defines rate limiting rules for different endpoints.
 * Adjust these values based on your application's needs.
 */

export interface RateLimitConfig {
  /** Time window in milliseconds */
  interval: number
  /** Maximum number of requests allowed in the interval */
  limit: number
  /** Maximum unique tokens (IPs) to track */
  uniqueTokenPerInterval: number
}

/**
 * Rate limit for waitlist submissions
 * - 5 requests per minute per IP
 */
export const WAITLIST_RATE_LIMIT: RateLimitConfig = {
  interval: 60 * 1000, // 1 minute
  limit: 5,
  uniqueTokenPerInterval: 500, // Track up to 500 unique IPs
}

/**
 * Rate limit for contact form submissions
 * - 3 requests per minute per IP
 */
export const CONTACT_RATE_LIMIT: RateLimitConfig = {
  interval: 60 * 1000, // 1 minute
  limit: 3,
  uniqueTokenPerInterval: 500,
}

/**
 * Rate limit for general API endpoints
 * - 10 requests per minute per IP
 */
export const API_RATE_LIMIT: RateLimitConfig = {
  interval: 60 * 1000, // 1 minute
  limit: 10,
  uniqueTokenPerInterval: 500,
}
