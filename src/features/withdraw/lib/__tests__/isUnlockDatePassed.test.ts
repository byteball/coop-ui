import { describe, it, expect } from "vitest";

import { isUnlockDatePassed } from "../isUnlockDatePassed";

// Fixed reference instant: 2026-06-01T12:00:00Z
const NOW = Date.UTC(2026, 5, 1, 12, 0, 0);

describe("isUnlockDatePassed", () => {
  it("returns false when the user has never locked (unlock_date === false)", () => {
    expect(isUnlockDatePassed(false, NOW)).toBe(false);
  });

  it("returns false when the unlock date is in the future", () => {
    expect(isUnlockDatePassed("2026-06-02", NOW)).toBe(false);
    expect(isUnlockDatePassed("2027-01-01", NOW)).toBe(false);
  });

  it("returns true when the unlock date is today (>= comparison, matches AA)", () => {
    expect(isUnlockDatePassed("2026-06-01", NOW)).toBe(true);
  });

  it("returns true when the unlock date is in the past", () => {
    expect(isUnlockDatePassed("2025-06-01", NOW)).toBe(true);
    expect(isUnlockDatePassed("2026-05-31", NOW)).toBe(true);
  });

  it("compares against the UTC date of `now`", () => {
    // 2026-06-01T00:30:00Z is still 2026-06-01 in UTC even though some local
    // zones would already read 2026-06-02.
    const justAfterMidnightUtc = Date.UTC(2026, 5, 1, 0, 30, 0);
    expect(isUnlockDatePassed("2026-06-01", justAfterMidnightUtc)).toBe(true);
    expect(isUnlockDatePassed("2026-06-02", justAfterMidnightUtc)).toBe(false);
  });
});
