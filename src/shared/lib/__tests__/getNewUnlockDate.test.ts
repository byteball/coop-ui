import { describe, it, expect } from "vitest";

import { getNewUnlockDate } from "../getNewUnlockDate";

const DAY_MS = 24 * 3600 * 1000;
const YEAR_MS = 365 * DAY_MS;

function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

describe("getNewUnlockDate", () => {
  it("returns now + 1 year when user has never locked (false)", () => {
    const now = new Date("2026-05-04T12:00:00").getTime();
    const result = getNewUnlockDate(false, now);
    expect(ymd(result)).toBe("2027-05-04");
  });

  it("returns now + 1 year when current unlock is in the past", () => {
    const now = new Date("2026-05-04T12:00:00").getTime();
    const result = getNewUnlockDate("2025-01-01", now);
    expect(ymd(result)).toBe("2027-05-04");
  });

  it("returns now + 1 year when current unlock is sooner than +1y", () => {
    const now = new Date("2026-05-04T12:00:00").getTime();
    const result = getNewUnlockDate("2026-12-01", now);
    expect(ymd(result)).toBe("2027-05-04");
  });

  it("returns existing unlock when it is further than +1 year", () => {
    const now = new Date("2026-05-04T12:00:00").getTime();
    const result = getNewUnlockDate("2030-01-01", now);
    expect(ymd(result)).toBe("2030-01-01");
  });

  it("normalizes time to local midnight", () => {
    const now = new Date("2026-05-04T23:59:59").getTime();
    const result = getNewUnlockDate(false, now);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });

  it("uses Date.now() by default when no `now` is passed", () => {
    const before = Date.now();
    const result = getNewUnlockDate(false);
    const after = Date.now();
    // Should be within [before+1y, after+1y] when stripped of midnight rounding
    expect(result.getTime()).toBeGreaterThanOrEqual(
      new Date(before + YEAR_MS).setHours(0, 0, 0, 0),
    );
    expect(result.getTime()).toBeLessThanOrEqual(
      new Date(after + YEAR_MS).setHours(0, 0, 0, 0),
    );
  });
});
