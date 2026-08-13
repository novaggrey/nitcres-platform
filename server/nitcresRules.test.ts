import { describe, expect, it } from "vitest";
import { clampRiskScore, policyHorizonMonths, riskBandForScore, uwiLeadNotice } from "./nitcresRules";

describe("NITCRES domain safeguards", () => {
  it("keeps every risk score on the strict 0–100 scale", () => {
    expect(clampRiskScore(-12)).toBe(0);
    expect(clampRiskScore(42.6)).toBe(43);
    expect(clampRiskScore(140)).toBe(100);
  });

  it("maps risk scores to explainable severity bands", () => {
    expect(riskBandForScore(20)).toBe("low");
    expect(riskBandForScore(50)).toBe("medium");
    expect(riskBandForScore(70)).toBe("high");
    expect(riskBandForScore(95)).toBe("critical");
  });

  it("accepts exactly 12-, 36-, and 60-month policy horizons", () => {
    expect(policyHorizonMonths([{ months: 12 }, { months: 36 }, { months: 60 }])).toBe(true);
    expect(policyHorizonMonths([{ months: 12 }, { months: 24 }, { months: 60 }])).toBe(false);
    expect(policyHorizonMonths([{ months: 12 }, { months: 36 }])).toBe(false);
  });

  it("frames UWI outputs as leads rather than conclusions", () => {
    expect(uwiLeadNotice()).toContain("Investigative lead only");
    expect(uwiLeadNotice()).toContain("Human validation");
  });
});
