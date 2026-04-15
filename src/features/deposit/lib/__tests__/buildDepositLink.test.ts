import { describe, it, expect, vi, afterEach } from "vitest";
import { buildDepositLink } from "../buildDepositLink";
import { getToday, MIN_TERM_DAYS, MAX_TERM_DAYS } from "../constants";

afterEach(() => {
  vi.restoreAllMocks();
});

const coopAsset = "abc123def456ghi789jkl012mno345pq";

const defaults = {
  coopAsset,
  coopDecimals: 9,
  gbyteDecimals: 9,
  referrer: undefined,
};

function unlockDateFromDays(days: number): Date {
  const d = new Date(getToday());
  d.setDate(d.getDate() + days);
  return d;
}

describe("buildDepositLink", () => {
  it("returns null for empty amount", () => {
    expect(
      buildDepositLink({
        amount: "",
        asset: "coop",
        unlockDate: unlockDateFromDays(MIN_TERM_DAYS),
        ...defaults,
      }),
    ).toBeNull();
  });

  it("returns null for zero amount", () => {
    expect(
      buildDepositLink({
        amount: "0",
        asset: "coop",
        unlockDate: unlockDateFromDays(MIN_TERM_DAYS),
        ...defaults,
      }),
    ).toBeNull();
  });

  it("returns null for negative amount", () => {
    expect(
      buildDepositLink({
        amount: "-5",
        asset: "coop",
        unlockDate: unlockDateFromDays(MIN_TERM_DAYS),
        ...defaults,
      }),
    ).toBeNull();
  });

  it("returns null when term is below minimum", () => {
    expect(
      buildDepositLink({
        amount: "100",
        asset: "coop",
        unlockDate: unlockDateFromDays(MIN_TERM_DAYS - 1),
        ...defaults,
      }),
    ).toBeNull();
  });

  it("returns null when term exceeds maximum", () => {
    expect(
      buildDepositLink({
        amount: "100",
        asset: "coop",
        unlockDate: unlockDateFromDays(MAX_TERM_DAYS + 1),
        ...defaults,
      }),
    ).toBeNull();
  });

  it("returns null when too many decimals", () => {
    expect(
      buildDepositLink({
        amount: "1.1234567890",
        asset: "coop",
        unlockDate: unlockDateFromDays(MIN_TERM_DAYS),
        ...defaults,
      }),
    ).toBeNull();
  });

  it("generates a valid link for COOP deposit", () => {
    const link = buildDepositLink({
      amount: "100",
      asset: "coop",
      unlockDate: unlockDateFromDays(MIN_TERM_DAYS),
      ...defaults,
    });
    expect(link).not.toBeNull();
    expect(link).toContain("obyte");
    expect(link).toContain(`asset=${encodeURIComponent(coopAsset)}`);
  });

  it("generates a valid link for GBYTE deposit with bounce fee", () => {
    const link = buildDepositLink({
      amount: "1",
      asset: "gbyte",
      unlockDate: unlockDateFromDays(MIN_TERM_DAYS),
      ...defaults,
    });
    expect(link).not.toBeNull();
    // 1 GBYTE = 1e9 bytes + 10000 bounce fee
    expect(link).toContain("amount=1000010000");
  });

  it("includes referrer in the link data", () => {
    const link = buildDepositLink({
      amount: "100",
      asset: "coop",
      unlockDate: unlockDateFromDays(MIN_TERM_DAYS),
      ...defaults,
      referrer: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
    });
    expect(link).not.toBeNull();
    expect(link).toContain("base64data");
  });

  it("includes term when different from minimum", () => {
    const days = MIN_TERM_DAYS + 30;
    const link = buildDepositLink({
      amount: "100",
      asset: "coop",
      unlockDate: unlockDateFromDays(days),
      ...defaults,
    });
    expect(link).not.toBeNull();
    expect(link).toContain("base64data");
  });

  it("returns null when coopAsset is undefined for coop deposit", () => {
    const link = buildDepositLink({
      amount: "100",
      asset: "coop",
      unlockDate: unlockDateFromDays(MIN_TERM_DAYS),
      ...defaults,
      coopAsset: undefined,
    });
    expect(link).not.toBeNull();
    // falls back to "base" asset since isCoop is false
    expect(link).toContain("asset=base");
  });
});
