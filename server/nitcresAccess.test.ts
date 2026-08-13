import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function context(platformRole: "admin" | "auditor" | "risk_analyst" | "customs_officer" | "policy_analyst"): TrpcContext {
  return {
    user: {
      id: 7,
      openId: "synthetic-test-user",
      name: "Synthetic Test User",
      email: "synthetic@example.test",
      loginMethod: "test",
      role: "user",
      platformRole,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("NITCRES role boundaries", () => {
  it("blocks customs officers from policy simulation retrieval", async () => {
    const caller = appRouter.createCaller(context("customs_officer"));
    await expect(caller.intelligence.simulations()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("blocks policy analysts from risk overrides", async () => {
    const caller = appRouter.createCaller(context("policy_analyst"));
    await expect(caller.intelligence.overrideRisk({ taxpayerId: 1, score: 50, reason: "Synthetic review adjustment" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("requires a reason before a human override is accepted", async () => {
    const caller = appRouter.createCaller(context("risk_analyst"));
    await expect(caller.intelligence.overrideRisk({ taxpayerId: 1, score: 50, reason: "  " })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
