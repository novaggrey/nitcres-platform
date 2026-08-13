import { describe, expect, it } from "vitest";
import {
  canUseDashboard,
  confirmableLogoutState,
  shouldOpenLogin,
  workspaceForNavLabel,
  isDemoRole,
} from "../client/src/auth/interactionContracts";
import { endDemoSession, getDemoRole, startDemoSession } from "../client/src/auth/demo";

describe("NITCRES interaction contracts", () => {
  it("protects the dashboard and opens login only after auth loading completes", () => {
    expect(shouldOpenLogin(true, false, false)).toBe(false);
    expect(shouldOpenLogin(false, false, false)).toBe(true);
    expect(canUseDashboard(false, true)).toBe(true);
    expect(canUseDashboard(true, false)).toBe(true);
  });

  it("supports and persists every simple demo role", () => {
    const roles = ["admin", "auditor", "risk_analyst", "customs_officer", "policy_analyst"] as const;
    const store = new Map<string, string>();
    const originalWindow = globalThis.window;
    Object.defineProperty(globalThis, "window", { configurable: true, value: { localStorage: {
      setItem: (key: string, value: string) => store.set(key, value),
      getItem: (key: string) => store.get(key) ?? null,
      removeItem: (key: string) => store.delete(key),
    } } });

    for (const role of roles) {
      startDemoSession(role);
      expect(isDemoRole(getDemoRole())).toBe(true);
      expect(getDemoRole()).toBe(role);
    }

    endDemoSession();
    Object.defineProperty(globalThis, "window", { configurable: true, value: originalWindow });
  });

  it("models cancelable and confirmable logout states", () => {
    expect(confirmableLogoutState(false, false)).toBe("closed");
    expect(confirmableLogoutState(true, false)).toBe("awaiting-confirmation");
    expect(confirmableLogoutState(true, true)).toBe("confirmed");
  });

  it("maps each primary navigation label to a real workspace", () => {
    expect(workspaceForNavLabel("Overview")).toBe("Overview");
    expect(workspaceForNavLabel("VAT Graph")).toBe("VAT Graph Analytics");
    expect(workspaceForNavLabel("Policy Lab")).toBe("Policy Lab");
    expect(workspaceForNavLabel("Audit Operations")).toBe("Audit Operations");
  });
});
