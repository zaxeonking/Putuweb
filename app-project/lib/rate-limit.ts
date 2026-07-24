import "server-only";

/**
 * Minimal in-memory rate limiter for the login endpoint.
 *
 * Note: this state lives in the Node process, so it resets on redeploy and
 * is per-instance if you later run multiple server instances behind a load
 * balancer. That's an acceptable tradeoff for a single-admin site; if this
 * app ever scales beyond one instance, swap this for a shared store
 * (Upstash Redis, etc.) behind the same function signatures below.
 */

const WINDOW_MS = 15 * 60 * 1000; // 15 minute window
const MAX_ATTEMPTS = 5;

interface Bucket {
  count: number;
  firstAttemptAt: number;
  blockedUntil?: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket) {
    buckets.set(key, { count: 0, firstAttemptAt: now });
    return { allowed: true };
  }

  if (bucket.blockedUntil && now < bucket.blockedUntil) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((bucket.blockedUntil - now) / 1000),
    };
  }

  if (now - bucket.firstAttemptAt > WINDOW_MS) {
    // Window expired, reset.
    buckets.set(key, { count: 0, firstAttemptAt: now });
    return { allowed: true };
  }

  return { allowed: true };
}

/** Call after a failed login attempt to increment the counter. */
export function recordFailedAttempt(key: string): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { count: 0, firstAttemptAt: now };

  bucket.count += 1;

  if (bucket.count >= MAX_ATTEMPTS) {
    bucket.blockedUntil = now + WINDOW_MS;
  }

  buckets.set(key, bucket);

  if (bucket.blockedUntil) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((bucket.blockedUntil - now) / 1000),
    };
  }

  return { allowed: true };
}

/** Call after a successful login to clear the counter for that key. */
export function clearRateLimit(key: string) {
  buckets.delete(key);
}

/**
 * Generic throttle for public form submissions (contact, feedback, etc).
 * Unlike the login limiter above, this counts every submission attempt,
 * not just failures — the goal is to slow down spam/bots, not lock out
 * users who made a typo.
 */
const submissionBuckets = new Map<string, Bucket>();
const SUBMISSION_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_SUBMISSIONS = 8;

export function checkSubmissionLimit(key: string): RateLimitResult {
  const now = Date.now();
  const bucket = submissionBuckets.get(key);

  if (!bucket) {
    submissionBuckets.set(key, { count: 1, firstAttemptAt: now });
    return { allowed: true };
  }

  if (bucket.blockedUntil && now < bucket.blockedUntil) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((bucket.blockedUntil - now) / 1000),
    };
  }

  if (now - bucket.firstAttemptAt > SUBMISSION_WINDOW_MS) {
    submissionBuckets.set(key, { count: 1, firstAttemptAt: now });
    return { allowed: true };
  }

  bucket.count += 1;
  if (bucket.count > MAX_SUBMISSIONS) {
    bucket.blockedUntil = now + SUBMISSION_WINDOW_MS;
    submissionBuckets.set(key, bucket);
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((bucket.blockedUntil - now) / 1000),
    };
  }

  submissionBuckets.set(key, bucket);
  return { allowed: true };
}
