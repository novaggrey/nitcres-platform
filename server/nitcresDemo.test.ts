import { describe, expect, it } from "vitest";
import { DEMO_EMAIL, DEMO_PASSWORD, DEMO_SESSION_KEY } from "../client/src/auth/demo";

describe("NITCRES demo login contract", () => {
  it("uses clearly synthetic, non-production credentials", () => {
    expect(DEMO_EMAIL).toBe("demo@nitcres.local");
    expect(DEMO_PASSWORD).toBe("NITCRES-DEMO-2026");
    expect(DEMO_SESSION_KEY).toBe("nitcres-demo-session");
    expect(DEMO_EMAIL).toContain(".local");
  });
});
