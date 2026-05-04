import { describe, it, expect } from "vitest";

import { buildClaimRewardsLink } from "../buildClaimRewardsLink";

function decodeData(link: string): Record<string, unknown> | null {
  const url = new URL(link);
  const b64 = url.searchParams.get("base64data");
  if (!b64) return null;
  return JSON.parse(Buffer.from(b64, "base64").toString("utf8")) as Record<
    string,
    unknown
  >;
}

describe("buildClaimRewardsLink", () => {
  it("returns null when restakePercent is below 0", () => {
    expect(buildClaimRewardsLink({ restakePercent: -1 })).toBeNull();
  });

  it("returns null when restakePercent is above 100", () => {
    expect(buildClaimRewardsLink({ restakePercent: 101 })).toBeNull();
  });

  it("returns null when restakePercent is not an integer", () => {
    expect(buildClaimRewardsLink({ restakePercent: 12.5 })).toBeNull();
  });

  it("returns a valid obyte link for restakePercent=0", () => {
    const link = buildClaimRewardsLink({ restakePercent: 0 });
    expect(link).not.toBeNull();
    expect(link).toContain("obyte");
    expect(link).toContain("asset=base");
    expect(link).toContain("amount=10000");
  });

  it("omits restake_percent field when restakePercent=0", () => {
    const link = buildClaimRewardsLink({ restakePercent: 0 })!;
    const data = decodeData(link);
    expect(data?.claim).toBe(1);
    expect("restake_percent" in (data as object)).toBe(false);
  });

  it("includes restake_percent field when restakePercent > 0", () => {
    const link = buildClaimRewardsLink({ restakePercent: 50 })!;
    const data = decodeData(link);
    expect(data?.claim).toBe(1);
    expect(data?.restake_percent).toBe(50);
  });

  it("supports restakePercent=100", () => {
    const link = buildClaimRewardsLink({ restakePercent: 100 })!;
    const data = decodeData(link);
    expect(data?.restake_percent).toBe(100);
  });

  it("supports restakePercent=1 (boundary)", () => {
    const link = buildClaimRewardsLink({ restakePercent: 1 })!;
    const data = decodeData(link);
    expect(data?.restake_percent).toBe(1);
  });
});
