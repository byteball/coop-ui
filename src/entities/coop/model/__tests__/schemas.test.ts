import { describe, it, expect } from "vitest";

import {
  parseCoopUser,
  coopConstantsSchema,
  aaResponseMessageSchema,
} from "../schemas";

function makeUser(overrides: Record<string, unknown> = {}) {
  return {
    balance: 0,
    bytes_balance: 0,
    total_balance: 0,
    unlock_date: "2027-01-01",
    reg_date: "2026-01-01",
    reg_ts: 1700000000,
    last_ts: 1700000000,
    last_locked_emissions_per_vote: 0,
    last_liquid_emissions_per_vote: 0,
    last_locked_emissions_per_vb: 0,
    last_liquid_emissions_per_vb: 0,
    ...overrides,
  };
}

describe("parseCoopUser", () => {
  it("accepts a fully-formed CoopUser", () => {
    const user = parseCoopUser(makeUser({ total_balance: 100 }));
    expect(user).toBeDefined();
    expect(user?.total_balance).toBe(100);
  });

  it("accepts unlock_date as the literal false (never locked)", () => {
    const user = parseCoopUser(makeUser({ unlock_date: false }));
    expect(user?.unlock_date).toBe(false);
  });

  it("accepts user with all optional fields populated", () => {
    const user = parseCoopUser(
      makeUser({
        liquid_balance: 10,
        votes: 5,
        ref: "REFERRERADDRESSREFERRERADDRESSAB",
        no_referrer_deposit_reward: true,
        referral_rewards: 100,
        referred_users: 2,
        locked_rewards: 50,
        liquid_rewards: 25,
      }),
    );
    expect(user?.votes).toBe(5);
    expect(user?.ref).toBe("REFERRERADDRESSREFERRERADDRESSAB");
    expect(user?.no_referrer_deposit_reward).toBe(true);
  });

  it("rejects non-object input", () => {
    expect(parseCoopUser(null)).toBeUndefined();
    expect(parseCoopUser(undefined)).toBeUndefined();
    expect(parseCoopUser("nope")).toBeUndefined();
    expect(parseCoopUser(42)).toBeUndefined();
    expect(parseCoopUser([])).toBeUndefined();
  });

  it("rejects when a required field is missing", () => {
    const incomplete = makeUser();
    delete (incomplete as Record<string, unknown>).balance;
    expect(parseCoopUser(incomplete)).toBeUndefined();
  });

  it("rejects when a required field has wrong type", () => {
    expect(parseCoopUser(makeUser({ total_balance: "100" }))).toBeUndefined();
    expect(parseCoopUser(makeUser({ reg_ts: "abc" }))).toBeUndefined();
  });

  it("rejects when unlock_date is true (only string or literal false allowed)", () => {
    expect(parseCoopUser(makeUser({ unlock_date: true }))).toBeUndefined();
  });

  it("strips unknown extra fields", () => {
    const user = parseCoopUser(makeUser({ rogue_field: "should-be-stripped" }));
    expect(user).toBeDefined();
    expect((user as Record<string, unknown>).rogue_field).toBeUndefined();
  });
});

describe("coopConstantsSchema", () => {
  it("accepts well-formed constants", () => {
    const result = coopConstantsSchema.safeParse({
      asset: "ASSET123",
      launch_ts: 1700000000,
      governance_aa: "AAADDRESSAAADDRESSAAADDRESSAAA01",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing fields", () => {
    expect(
      coopConstantsSchema.safeParse({
        asset: "ASSET",
        launch_ts: 1,
      }).success,
    ).toBe(false);
  });

  it("rejects wrong types", () => {
    expect(
      coopConstantsSchema.safeParse({
        asset: "ASSET",
        launch_ts: "1700000000",
        governance_aa: "AA",
      }).success,
    ).toBe(false);
  });
});

describe("aaResponseMessageSchema", () => {
  it("accepts a well-formed light/aa_response message", () => {
    const result = aaResponseMessageSchema.safeParse([
      "justsaying",
      {
        subject: "light/aa_response",
        body: {
          updatedStateVars: {
            AAADDRESS: {
              user_X: { value: { balance: 100 } },
            },
          },
        },
      },
    ]);
    expect(result.success).toBe(true);
  });

  it("accepts a message with no body", () => {
    const result = aaResponseMessageSchema.safeParse([
      "justsaying",
      { subject: "light/heartbeat" },
    ]);
    expect(result.success).toBe(true);
  });

  it("rejects when message is not a tuple", () => {
    expect(aaResponseMessageSchema.safeParse(null).success).toBe(false);
    expect(aaResponseMessageSchema.safeParse({}).success).toBe(false);
    expect(
      aaResponseMessageSchema.safeParse(["one-element-only"]).success,
    ).toBe(false);
  });

  it("rejects when first element is not a string", () => {
    expect(
      aaResponseMessageSchema.safeParse([42, { subject: "x" }]).success,
    ).toBe(false);
  });

  it("rejects malformed updatedStateVars shape", () => {
    expect(
      aaResponseMessageSchema.safeParse([
        "justsaying",
        {
          subject: "light/aa_response",
          body: {
            updatedStateVars: {
              AA: {
                key: "should-be-an-object-with-value",
              },
            },
          },
        },
      ]).success,
    ).toBe(false);
  });

  it("preserves arbitrary value types inside updatedStateVars", () => {
    const result = aaResponseMessageSchema.safeParse([
      "justsaying",
      {
        subject: "light/aa_response",
        body: {
          updatedStateVars: {
            AA: {
              total_locked: { value: 1234 },
              constants: { value: { asset: "x" } },
            },
          },
        },
      },
    ]);
    expect(result.success).toBe(true);
  });
});
