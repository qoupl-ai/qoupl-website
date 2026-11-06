import { isIP } from 'node:net'

/**
 * Extracts the visitor's IP address from a request, or `null` if none can be trusted.
 *
 * `x-forwarded-for` is a comma-separated list that each proxy appends to, so it is ordered
 * client-first: the leftmost entry is the visitor and everything after it is infrastructure
 * (behind Firebase Hosting and Cloud Run the header is `"<client>, <google-proxy>"`).
 * The header is attacker-controlled, so the entry is returned only if it parses as an IPv4 or
 * IPv6 address; anything else yields `null`, which is safe to store in a Postgres `inet` column.
 * Accepted shapes: `1.2.3.4`, `1.2.3.4:5678`, `2001:db8::1`, `[2001:db8::1]:443`, and lists of these.
 * Falls back to `x-real-ip` when `x-forwarded-for` is absent or yields no valid address.
 *
 * @param headers - The request headers (e.g. `request.headers`).
 * @returns The normalised address without port or brackets, or `null` when absent or invalid.
 */
export function getClientIp(headers: Pick<Headers, 'get'>): string | null {
  const forwardedFor = headers.get('x-forwarded-for')
  const forwardedClient = forwardedFor === null ? null : parseAddress(forwardedFor.split(',')[0])
  return forwardedClient ?? parseAddress(headers.get('x-real-ip'))
}

/** Strips whitespace, brackets and a port from one header entry and validates it. */
function parseAddress(rawEntry: string | null | undefined): string | null {
  if (!rawEntry) return null
  let candidate = rawEntry.trim()

  const bracketed = /^\[([^\]]+)\](?::\d{1,5})?$/.exec(candidate)
  if (bracketed) {
    candidate = bracketed[1]
  } else if (/^[^:]+:\d{1,5}$/.test(candidate)) {
    // Exactly one colon: IPv4 with a port. A bare IPv6 address has several colons and is untouched.
    candidate = candidate.slice(0, candidate.indexOf(':'))
  }

  // Zone identifiers (fe80::1%eth0) pass net.isIP but Postgres inet rejects them.
  if (candidate.includes('%')) return null
  return isIP(candidate) === 0 ? null : candidate
}
