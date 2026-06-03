// Simple in-memory sliding-window rate limiter for a single-process deployment.
// Not suitable for multi-instance (use Redis-backed limiter instead).
//
// A separate bucket is kept per (key, ip) pair. Old timestamps outside the
// window are pruned on every check so memory doesn't grow unbounded.

interface Bucket {
  timestamps: number[];
}

const buckets = new Map<string, Bucket>();

export interface RateLimitOptions {
  maxRequests: number; // allowed requests per window
  windowMs: number;    // window size in milliseconds
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAfterMs: number; // ms until the oldest request falls out of the window
}

export function checkRateLimit(
  key: string,
  ip: string,
  opts: RateLimitOptions,
): RateLimitResult {
  const bucketKey = `${key}:${ip}`;
  const now = Date.now();
  const windowStart = now - opts.windowMs;

  const bucket = buckets.get(bucketKey) ?? { timestamps: [] };

  // Remove timestamps outside the current window
  bucket.timestamps = bucket.timestamps.filter((t) => t > windowStart);

  if (bucket.timestamps.length >= opts.maxRequests) {
    const oldest = bucket.timestamps[0];
    return {
      allowed: false,
      remaining: 0,
      resetAfterMs: oldest + opts.windowMs - now,
    };
  }

  bucket.timestamps.push(now);
  buckets.set(bucketKey, bucket);

  return {
    allowed: true,
    remaining: opts.maxRequests - bucket.timestamps.length,
    resetAfterMs: opts.windowMs,
  };
}

// Extract the best available IP from a Next.js request.
// Falls back to "unknown" if no IP is resolvable (e.g. local dev).
export function getClientIp(request: Request): string {
  const headers = request instanceof Request ? request.headers : null;
  if (!headers) return "unknown";
  return (
    headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}
