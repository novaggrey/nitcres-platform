import { afterEach, describe, expect, it } from "vitest";
import {
  checkDemoRateLimit,
  DEMO_RATE_LIMIT_MAX_ATTEMPTS,
  DEMO_RATE_LIMIT_WINDOW_MS,
  resetDemoRateLimitForTests,
} from "./demoRateLimit";

describe("demo access rate limiter", () => {
  afterEach(() => resetDemoRateLimitForTests());

  it("allows the configured number of attempts and blocks the next one", () => {
    const now = 1_000_000;
    for (let attempt = 1; attempt <= DEMO_RATE_LIMIT_MAX_ATTEMPTS; attempt += 1) {
      const result = checkDemoRateLimit("127.0.0.1", now);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(DEMO_RATE_LIMIT_MAX_ATTEMPTS - attempt);
    }

    const blocked = checkDemoRateLimit("127.0.0.1", now);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBe(Math.ceil(DEMO_RATE_LIMIT_WINDOW_MS / 1000));
  });

  it("resets the client window after expiry", () => {
    const now = 2_000_000;
    for (let attempt = 0; attempt < DEMO_RATE_LIMIT_MAX_ATTEMPTS; attempt += 1) {
      checkDemoRateLimit("10.0.0.2", now);
    }

    const afterWindow = checkDemoRateLimit("10.0.0.2", now + DEMO_RATE_LIMIT_WINDOW_MS + 1);
    expect(afterWindow.allowed).toBe(true);
    expect(afterWindow.remaining).toBe(DEMO_RATE_LIMIT_MAX_ATTEMPTS - 1);
  });
});
