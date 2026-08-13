export const DEMO_LOGIN_EMAIL = "demo@nitcres.local";
export const DEMO_LOGIN_PASSWORD = "NITCRES-DEMO-2026";
export const DEMO_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
export const DEMO_RATE_LIMIT_MAX_ATTEMPTS = 5;

type RateLimitEntry = { count: number; resetAt: number };
const attempts = new Map<string, RateLimitEntry>();

function pruneExpired(now: number) {
  attempts.forEach((entry, key) => {
    if (entry.resetAt <= now) attempts.delete(key);
  });
}

export function checkDemoRateLimit(key: string, now = Date.now()) {
  pruneExpired(now);
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    const resetAt = now + DEMO_RATE_LIMIT_WINDOW_MS;
    attempts.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: DEMO_RATE_LIMIT_MAX_ATTEMPTS - 1, retryAfterSeconds: 0 };
  }

  if (current.count >= DEMO_RATE_LIMIT_MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0, retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000) };
  }

  current.count += 1;
  return { allowed: true, remaining: DEMO_RATE_LIMIT_MAX_ATTEMPTS - current.count, retryAfterSeconds: 0 };
}

export function resetDemoRateLimitForTests() {
  attempts.clear();
}
