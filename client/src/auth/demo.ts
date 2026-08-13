export const DEMO_EMAIL = "demo@nitcres.local";
export const DEMO_PASSWORD = "NITCRES-DEMO-2026";
export const DEMO_SESSION_KEY = "nitcres-demo-session";

export function isDemoSession() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(DEMO_SESSION_KEY) === "1";
}

export function startDemoSession() {
  window.localStorage.setItem(DEMO_SESSION_KEY, "1");
}

export function endDemoSession() {
  window.localStorage.removeItem(DEMO_SESSION_KEY);
}

export async function completeLogout(logout: () => Promise<unknown> | unknown, onDemoCleared: () => void) {
  endDemoSession();
  onDemoCleared();
  await logout();
}
