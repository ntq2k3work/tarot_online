/**
 * In-Memory Rate Limiter
 * Simple token-bucket rate limiting for API endpoints
 * Note: In production with multiple instances, use Redis-based rate limiting
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Store rate limit entries in memory (keyed by IP or identifier)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup interval: remove expired entries every 60 seconds
const CLEANUP_INTERVAL_MS = 60_000;
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function startCleanup(): void {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore) {
      if (entry.resetAt <= now) {
        rateLimitStore.delete(key);
      }
    }
  }, CLEANUP_INTERVAL_MS);
  // Allow Node.js to exit even if the timer is still running
  if (cleanupTimer && typeof cleanupTimer === 'object' && 'unref' in cleanupTimer) {
    cleanupTimer.unref();
  }
}

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number;
  /** Time window in seconds */
  windowSeconds: number;
}

export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean;
  /** Number of remaining requests in the current window */
  remaining: number;
  /** Unix timestamp (ms) when the rate limit resets */
  resetAt: number;
}

/**
 * Check rate limit for a given identifier (e.g., IP address)
 * Returns whether the request is allowed and remaining quota
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  startCleanup();

  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const key = identifier;

  const existing = rateLimitStore.get(key);

  // If no entry or window has expired, create a new entry
  if (!existing || existing.resetAt <= now) {
    const entry: RateLimitEntry = {
      count: 1,
      resetAt: now + windowMs,
    };
    rateLimitStore.set(key, entry);
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: entry.resetAt,
    };
  }

  // Increment count
  existing.count += 1;

  if (existing.count > config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  return {
    allowed: true,
    remaining: config.maxRequests - existing.count,
    resetAt: existing.resetAt,
  };
}

/**
 * Get the client IP from a Next.js request
 * Checks common proxy headers first
 */
export function getClientIP(request: Request): string {
  // Check forwarded headers (set by reverse proxies)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }

  return 'unknown';
}

// --- Pre-configured rate limit configs ---

/** General API rate limit: 60 requests per minute */
export const RATE_LIMIT_GENERAL: RateLimitConfig = {
  maxRequests: 60,
  windowSeconds: 60,
};

/** Auth endpoints rate limit: 10 requests per minute (prevent brute force) */
export const RATE_LIMIT_AUTH: RateLimitConfig = {
  maxRequests: 10,
  windowSeconds: 60,
};

/** AI interpretation rate limit: 5 requests per minute (expensive API calls) */
export const RATE_LIMIT_AI: RateLimitConfig = {
  maxRequests: 5,
  windowSeconds: 60,
};
