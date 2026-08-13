import { afterEach, describe, expect, it } from "vitest";
import { completeLogout, DEMO_SESSION_KEY, endDemoSession, isDemoSession, startDemoSession } from "../client/src/auth/demo";

type DemoStorage = { getItem: (key: string) => string | null; setItem: (key: string, value: string) => void; removeItem: (key: string) => void };

function installDemoStorage() {
  const values = new Map<string, string>();
  const storage: DemoStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
  (globalThis as typeof globalThis & { window?: { localStorage: DemoStorage } }).window = { localStorage: storage };
  return storage;
}

describe("demo session logout", () => {
  afterEach(() => {
    delete (globalThis as typeof globalThis & { window?: unknown }).window;
  });

  it("clears the synthetic session state used by the logout action", () => {
    const storage = installDemoStorage();
    startDemoSession();
    expect(storage.getItem(DEMO_SESSION_KEY)).toBe("1");
    expect(isDemoSession()).toBe(true);

    endDemoSession();

    expect(storage.getItem(DEMO_SESSION_KEY)).toBeNull();
    expect(isDemoSession()).toBe(false);
  });

  it("runs the dashboard logout contract and updates the UI callback", async () => {
    installDemoStorage();
    startDemoSession();
    let uiCleared = false;
    let authLogoutCalled = false;

    await completeLogout(
      async () => {
        authLogoutCalled = true;
      },
      () => {
        uiCleared = true;
      },
    );

    expect(authLogoutCalled).toBe(true);
    expect(uiCleared).toBe(true);
    expect(isDemoSession()).toBe(false);
  });
});
