import { describe, it, expect } from "vitest";

import type { CoopUser } from "#/entities/coop";

import { resolveEffectiveReferrer } from "../resolveEffectiveReferrer";

const REFERRER = "REFERRERREFERRERREFERRERREFERREF";
const SELF = "SELFSELFSELFSELFSELFSELFSELFSELF";

function makeGetUser(users: Record<string, Partial<CoopUser>>) {
  return (address: string): CoopUser | undefined =>
    users[address] as CoopUser | undefined;
}

describe("resolveEffectiveReferrer", () => {
  it("returns undefined when no stored referrer", () => {
    const getUser = makeGetUser({ [REFERRER]: { balance: 100 } });
    expect(resolveEffectiveReferrer(null, SELF, getUser)).toBeUndefined();
    expect(resolveEffectiveReferrer(undefined, SELF, getUser)).toBeUndefined();
  });

  it("returns undefined when stored referrer equals connected address (self-referral)", () => {
    const getUser = makeGetUser({ [SELF]: { balance: 100 } });
    expect(resolveEffectiveReferrer(SELF, SELF, getUser)).toBeUndefined();
  });

  it("returns undefined when referrer is not present in stateVars", () => {
    const getUser = makeGetUser({ [SELF]: { balance: 100 } });
    expect(resolveEffectiveReferrer(REFERRER, SELF, getUser)).toBeUndefined();
  });

  it("returns undefined when current user already has a ref recorded", () => {
    const getUser = makeGetUser({
      [REFERRER]: { balance: 100 },
      [SELF]: { balance: 50, ref: "SOMEONEELSESOMEONEELSESOMEONEEL1" },
    });
    expect(resolveEffectiveReferrer(REFERRER, SELF, getUser)).toBeUndefined();
  });

  it("returns the stored referrer when all checks pass", () => {
    const getUser = makeGetUser({
      [REFERRER]: { balance: 100 },
      [SELF]: { balance: 50 },
    });
    expect(resolveEffectiveReferrer(REFERRER, SELF, getUser)).toBe(REFERRER);
  });

  it("returns the stored referrer when no wallet is connected", () => {
    const getUser = makeGetUser({ [REFERRER]: { balance: 100 } });
    expect(resolveEffectiveReferrer(REFERRER, null, getUser)).toBe(REFERRER);
    expect(resolveEffectiveReferrer(REFERRER, undefined, getUser)).toBe(
      REFERRER,
    );
  });

  it("returns the stored referrer when current user exists but has no ref yet", () => {
    const getUser = makeGetUser({
      [REFERRER]: { balance: 100 },
      [SELF]: { balance: 50, ref: undefined },
    });
    expect(resolveEffectiveReferrer(REFERRER, SELF, getUser)).toBe(REFERRER);
  });
});
