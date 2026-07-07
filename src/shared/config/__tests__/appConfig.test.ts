import { describe, it, expect } from "vitest";

import {
  paramDefs,
  defaultParams,
  governanceParams,
  variablesSchema,
} from "../appConfig";

describe("paramDefs-derived exports", () => {
  it("defaultParams contains exactly the paramDefs keys, with matching default values", () => {
    const defKeys = Object.keys(paramDefs).sort();
    const defaultKeys = Object.keys(defaultParams).sort();
    expect(defaultKeys).toEqual(defKeys);

    for (const key of defKeys) {
      // Casts: we just established keys are identical.
      const k = key as keyof typeof paramDefs;
      expect(defaultParams[k]).toBe(paramDefs[k].default);
    }
  });

  it("governanceParams lists every paramDef with matching name and type", () => {
    const fromGov = governanceParams.map((p) => p.name).sort();
    const fromDefs = Object.keys(paramDefs).sort();
    expect(fromGov).toEqual(fromDefs);

    for (const entry of governanceParams) {
      expect(entry.type).toBe(paramDefs[entry.name].type);
    }
  });

  it("known param shapes match expectations (regression — types are load-bearing for UI)", () => {
    expect(paramDefs.referral_reward.type).toBe("integer");
    expect(paramDefs.min_balance_instead_of_real_name.type).toBe("integer");
    expect(paramDefs.messaging_attestors.type).toBe("string");
    expect(paramDefs.real_name_attestors.type).toBe("string");
    expect(paramDefs.daily_locked_reward.type).toBe("number");
    expect(paramDefs.by_votes_share.type).toBe("number");
  });

  it("exposes the AA max for daily reward params to the governance UI", () => {
    expect(paramDefs.daily_locked_reward.max).toBe(0.1);
    expect(paramDefs.daily_liquid_reward.max).toBe(0.1);
    expect(paramDefs.by_votes_share).not.toHaveProperty("max");

    expect(
      governanceParams.find((p) => p.name === "daily_locked_reward")?.max,
    ).toBe(0.1);
    expect(
      governanceParams.find((p) => p.name === "daily_liquid_reward")?.max,
    ).toBe(0.1);
  });

  it("variablesSchema accepts an empty object (all fields optional)", () => {
    expect(variablesSchema.safeParse({}).success).toBe(true);
  });

  it("variablesSchema accepts a partial override", () => {
    const result = variablesSchema.safeParse({
      daily_locked_reward: 0.02,
      messaging_attestors: "ADDR1:ADDR2",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.daily_locked_reward).toBe(0.02);
      expect(result.data.messaging_attestors).toBe("ADDR1:ADDR2");
    }
  });

  it("variablesSchema rejects wrong type per param (string-typed param given a number)", () => {
    const result = variablesSchema.safeParse({
      messaging_attestors: 42,
    });
    expect(result.success).toBe(false);
  });

  it("variablesSchema rejects wrong type per param (number-typed param given a string)", () => {
    const result = variablesSchema.safeParse({
      daily_locked_reward: "0.01",
    });
    expect(result.success).toBe(false);
  });
});
