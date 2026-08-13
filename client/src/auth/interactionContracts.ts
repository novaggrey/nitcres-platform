export type DemoRole = "admin" | "auditor" | "risk_analyst" | "customs_officer" | "policy_analyst";

export const DASHBOARD_PATH = "/";
export const LOGIN_PATH = "/login";

export function shouldOpenLogin(authLoading: boolean, authenticated: boolean, demoActive: boolean): boolean {
  return !authLoading && !authenticated && !demoActive;
}

export function canUseDashboard(authenticated: boolean, demoActive: boolean): boolean {
  return authenticated || demoActive;
}

export function isDemoRole(value: string | null): value is DemoRole {
  return value === "admin" || value === "auditor" || value === "risk_analyst" || value === "customs_officer" || value === "policy_analyst";
}

export function confirmableLogoutState(open: boolean, confirmed: boolean): "closed" | "awaiting-confirmation" | "confirmed" {
  if (confirmed) return "confirmed";
  return open ? "awaiting-confirmation" : "closed";
}

export const WORKSPACE_BY_NAV_LABEL = {
  Overview: "Overview",
  "Data Integration": "Data Integration",
  "Risk Engine": "Risk Engine",
  "Lifestyle & UWI": "Lifestyle & UWI",
  "VAT Graph": "VAT Graph Analytics",
  "Customs Intelligence": "Customs Intelligence",
  "Transfer Pricing": "Transfer Pricing",
  "Audit Operations": "Audit Operations",
  "Tax Gap": "Tax Gap",
  "Policy Lab": "Policy Lab",
} as const;

export function workspaceForNavLabel(label: keyof typeof WORKSPACE_BY_NAV_LABEL): string {
  return WORKSPACE_BY_NAV_LABEL[label];
}
