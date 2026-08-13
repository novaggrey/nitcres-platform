import { describe, expect, it } from "vitest";
import { matchesSyntheticSearch } from "../client/src/lib/search";

describe("matchesSyntheticSearch", () => {
  it("matches invoice numbers and descriptions case-insensitively", () => {
    expect(matchesSyntheticSearch("syn-inv-2201", ["SYN-INV-2201", "Industrial packaging services"])).toBe(true);
    expect(matchesSyntheticSearch("PACKAGING", ["SYN-INV-2201", "Industrial packaging services"])).toBe(true);
  });

  it("rejects empty queries and unrelated values", () => {
    expect(matchesSyntheticSearch("", ["SYN-INV-2201"])).toBe(false);
    expect(matchesSyntheticSearch("unknown", ["SYN-INV-2201", "Industrial packaging services"])).toBe(false);
  });
});
