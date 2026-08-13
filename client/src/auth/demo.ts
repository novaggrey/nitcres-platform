export type DemoRole = "admin" | "auditor" | "risk_analyst" | "customs_officer" | "policy_analyst";

export const DEMO_EMAIL = "demo@nitcres.local";
export const DEMO_PASSWORD = "NITCRES-DEMO-2026";
export const DEMO_SESSION_KEY = "nitcres-demo-session";
export const DEMO_ROLE_KEY = "nitcres-demo-role";

export function isDemoSession() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(DEMO_SESSION_KEY) === "1";
}

export function getDemoRole(): DemoRole {
  if (typeof window === "undefined") return "admin";
  const role = window.localStorage.getItem(DEMO_ROLE_KEY);
  return role === "auditor" || role === "risk_analyst" || role === "customs_officer" || role === "policy_analyst" ? role : "admin";
}

export function startDemoSession(role: DemoRole = "admin") {
  window.localStorage.setItem(DEMO_SESSION_KEY, "1");
  window.localStorage.setItem(DEMO_ROLE_KEY, role);
}

export function endDemoSession() {
  window.localStorage.removeItem(DEMO_SESSION_KEY);
  window.localStorage.removeItem(DEMO_ROLE_KEY);
}

export async function completeLogout(logout: () => Promise<unknown> | unknown, onDemoCleared: () => void) {
  endDemoSession();
  onDemoCleared();
  await logout();
}
