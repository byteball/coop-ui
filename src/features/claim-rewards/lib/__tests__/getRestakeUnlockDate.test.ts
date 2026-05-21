import { describe, it, expect } from "vitest";

import { getRestakeUnlockDate } from "../getRestakeUnlockDate";

const YEAR_MS = 365 * 24 * 3600 * 1000;
const NOW = new Date("2026-05-21T12:00:00Z").getTime();

function atMidnight(ms: number): number {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

describe("getRestakeUnlockDate", () => {
  it("returns null when restakePercent is 0 (nothing is restaked)", () => {
    expect(getRestakeUnlockDate("2026-06-01", 0, NOW)).toBeNull();
  });

  it("returns null when restakePercent is negative", () => {
    expect(getRestakeUnlockDate("2026-06-01", -5, NOW)).toBeNull();
  });

  it("returns null when current unlock date is already further than today + 1 year", () => {
    const farFuture = new Date(NOW + YEAR_MS + 30 * 24 * 3600 * 1000);
    const iso = farFuture.toISOString().slice(0, 10);
    expect(getRestakeUnlockDate(iso, 50, NOW)).toBeNull();
  });

  it("returns today + 1 year when current unlock date is sooner", () => {
    const result = getRestakeUnlockDate("2026-06-01", 50, NOW);
    expect(result).not.toBeNull();
    expect(result!.getTime()).toBe(atMidnight(NOW + YEAR_MS));
  });

  it("returns today + 1 year when user has never locked (unlock_date is false)", () => {
    const result = getRestakeUnlockDate(false, 100, NOW);
    expect(result).not.toBeNull();
    expect(result!.getTime()).toBe(atMidnight(NOW + YEAR_MS));
  });
});
