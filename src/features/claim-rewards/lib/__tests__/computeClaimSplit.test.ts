import { describe, it, expect } from "vitest";

import { computeClaimSplit } from "../computeClaimSplit";

describe("computeClaimSplit", () => {
  it("sends everything to claim when restakePercent is 0", () => {
    expect(computeClaimSplit(1_000_000, 0)).toEqual({
      claimedAtomic: 1_000_000,
      restakedAtomic: 0,
    });
  });

  it("sends everything to lock when restakePercent is 100", () => {
    expect(computeClaimSplit(1_000_000, 100)).toEqual({
      claimedAtomic: 0,
      restakedAtomic: 1_000_000,
    });
  });

  it("splits evenly at 50%", () => {
    expect(computeClaimSplit(1_000_000, 50)).toEqual({
      claimedAtomic: 500_000,
      restakedAtomic: 500_000,
    });
  });

  it("floors the claimed portion (mirrors AA)", () => {
    // 999 * 0.75 = 749.25 → floor → 749 claimed, 250 restaked
    expect(computeClaimSplit(999, 25)).toEqual({
      claimedAtomic: 749,
      restakedAtomic: 250,
    });
  });

  it("preserves the total: claimed + restaked === liquidAtomic", () => {
    for (const liquid of [1, 7, 999, 1_000_001, 123_456_789]) {
      for (const pct of [0, 1, 17, 33, 50, 66, 99, 100]) {
        const { claimedAtomic, restakedAtomic } = computeClaimSplit(
          liquid,
          pct,
        );
        expect(claimedAtomic + restakedAtomic).toBe(liquid);
      }
    }
  });

  it("returns zeros for zero liquid", () => {
    expect(computeClaimSplit(0, 50)).toEqual({
      claimedAtomic: 0,
      restakedAtomic: 0,
    });
  });

  it("handles a 1-atomic-unit balance", () => {
    // floor(1 * 0.5) = 0 claimed, 1 restaked
    expect(computeClaimSplit(1, 50)).toEqual({
      claimedAtomic: 0,
      restakedAtomic: 1,
    });
  });
});
