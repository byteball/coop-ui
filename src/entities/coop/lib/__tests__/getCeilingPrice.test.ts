import { describe, it, expect, vi, afterEach } from "vitest";
import { getCeilingPrice } from "../getCeilingPrice";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getCeilingPrice", () => {
  it("returns 1 when launch_ts equals now", () => {
    const nowSec = 1700000000;
    vi.spyOn(Date, "now").mockReturnValue(nowSec * 1000);
    expect(getCeilingPrice(nowSec)).toBeCloseTo(1);
  });

  it("returns 2 after exactly 1 year", () => {
    const nowSec = 1700000000;
    const yearSeconds = 365 * 24 * 3600;
    vi.spyOn(Date, "now").mockReturnValue(nowSec * 1000);
    expect(getCeilingPrice(nowSec - yearSeconds)).toBeCloseTo(2, 5);
  });

  it("returns 4 after exactly 2 years", () => {
    const nowSec = 1700000000;
    const yearSeconds = 365 * 24 * 3600;
    vi.spyOn(Date, "now").mockReturnValue(nowSec * 1000);
    expect(getCeilingPrice(nowSec - 2 * yearSeconds)).toBeCloseTo(4, 5);
  });

  it("returns ~1.414 after half a year", () => {
    const nowSec = 1700000000;
    const halfYear = (365 * 24 * 3600) / 2;
    vi.spyOn(Date, "now").mockReturnValue(nowSec * 1000);
    expect(getCeilingPrice(nowSec - halfYear)).toBeCloseTo(Math.SQRT2, 4);
  });

  it("returns value less than 1 for future launch_ts", () => {
    const nowSec = 1700000000;
    vi.spyOn(Date, "now").mockReturnValue(nowSec * 1000);
    expect(getCeilingPrice(nowSec + 1000)).toBeLessThan(1);
  });
});
