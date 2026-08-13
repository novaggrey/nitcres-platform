export const POLICY_HORIZONS = [12, 36, 60] as const;

export function clampRiskScore(score: number) {
  return Math.min(100, Math.max(0, Math.round(score)));
}

export function riskBandForScore(score: number) {
  const bounded = clampRiskScore(score);
  if (bounded >= 85) return "critical" as const;
  if (bounded >= 65) return "high" as const;
  if (bounded >= 35) return "medium" as const;
  return "low" as const;
}

export function policyHorizonMonths(horizons: Array<{ months: number }>) {
  return horizons.map((item) => item.months).join(",") === POLICY_HORIZONS.join(",");
}

export function uwiLeadNotice() {
  return "Investigative lead only — not a conclusion of non-compliance. Human validation is required.";
}
