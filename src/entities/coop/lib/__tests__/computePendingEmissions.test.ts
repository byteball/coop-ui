import { describe, it, expect } from "vitest";

import { computePendingEmissions } from "../computePendingEmissions";
import type { EmissionParams } from "../computePendingEmissions";
import type { CoopAaState, CoopUser } from "../../model/schemas";

function makeUser(overrides: Partial<CoopUser> = {}): CoopUser {
  return {
    balance: 0,
    bytes_balance: 0,
    total_balance: 0,
    unlock_date: "2030-01-01",
    reg_date: "2026-01-01",
    reg_ts: 1700000000,
    last_ts: 1700000000,
    last_locked_emissions_per_vote: 0,
    last_liquid_emissions_per_vote: 0,
    last_locked_emissions_per_vb: 0,
    last_liquid_emissions_per_vb: 0,
    liquid_balance: 0,
    votes: 0,
    ...overrides,
  };
}

const baseState: CoopAaState = {
  total_locked: 0,
  total_locked_bytes: 0,
  locked_emissions: 0,
  liquid_emissions: 0,
  locked_emissions_per_vote: 0,
  liquid_emissions_per_vote: 0,
  locked_emissions_per_vb: 0,
  liquid_emissions_per_vb: 0,
  total_votes: 0,
  total_votes_bal: 0,
  ts: 1700000000,
};

const params: EmissionParams = {
  daily_locked_reward: 0.01,
  daily_liquid_reward: 0.001,
  bytes_reducer: 0.75,
  by_votes_share: 0.5,
};

describe("computePendingEmissions", () => {
  it("returns zeros when user has no votes", () => {
    const user = makeUser({ votes: 0 });
    const result = computePendingEmissions(
      user,
      baseState,
      params,
      1,
      baseState.ts + 86400,
    );
    expect(result).toEqual({ pendingLocked: 0, pendingLiquid: 0 });
  });

  it("returns zeros when user.votes is undefined", () => {
    const user = makeUser({ votes: undefined });
    const result = computePendingEmissions(
      user,
      baseState,
      params,
      1,
      baseState.ts + 86400,
    );
    expect(result).toEqual({ pendingLocked: 0, pendingLiquid: 0 });
  });

  it("returns zeros when nowSec equals state.ts and accumulators match user.last_*", () => {
    const user = makeUser({ votes: 100, total_balance: 1000 });
    const result = computePendingEmissions(user, baseState, params, 1, baseState.ts);
    expect(result).toEqual({ pendingLocked: 0, pendingLiquid: 0 });
  });

  it("accrues both locked and liquid emissions over elapsed days", () => {
    const user = makeUser({
      total_balance: 1000,
      votes: 100,
    });
    const state: CoopAaState = {
      ...baseState,
      total_locked: 1000,
      total_votes: 100,
      total_votes_bal: 100 * 1000,
    };
    const ceilingPrice = 1;
    const elapsedDays = 1;
    const nowSec = state.ts + elapsedDays * 86400;

    const s =
      state.total_locked +
      (state.total_locked_bytes / ceilingPrice) * params.bytes_reducer;
    const newLocked = s * params.daily_locked_reward * elapsedDays;
    const newLiquid = s * params.daily_liquid_reward * elapsedDays;
    const expectedLockedPerVote = newLocked / state.total_votes;
    const expectedLockedPerVb = newLocked / state.total_votes_bal;
    const expectedLiquidPerVote = newLiquid / state.total_votes;
    const expectedLiquidPerVb = newLiquid / state.total_votes_bal;

    const v = params.by_votes_share * user.votes!;
    const vb = (1 - params.by_votes_share) * user.votes! * user.total_balance;
    const expectedLocked =
      v * expectedLockedPerVote + vb * expectedLockedPerVb;
    const expectedLiquid =
      v * expectedLiquidPerVote + vb * expectedLiquidPerVb;

    const result = computePendingEmissions(
      user,
      state,
      params,
      ceilingPrice,
      nowSec,
    );
    expect(result.pendingLocked).toBeCloseTo(expectedLocked, 9);
    expect(result.pendingLiquid).toBeCloseTo(expectedLiquid, 9);

    // Liquid emission rate is 1/10 of locked → pending liquid should match.
    expect(result.pendingLiquid).toBeCloseTo(result.pendingLocked / 10, 9);
  });

  it("subtracts user.last_*_per_* baselines from state accumulators (no elapsed time)", () => {
    const user = makeUser({
      total_balance: 500,
      votes: 50,
      last_locked_emissions_per_vote: 2,
      last_locked_emissions_per_vb: 0.001,
      last_liquid_emissions_per_vote: 0.2,
      last_liquid_emissions_per_vb: 0.0001,
    });
    const state: CoopAaState = {
      ...baseState,
      locked_emissions_per_vote: 5,
      locked_emissions_per_vb: 0.003,
      liquid_emissions_per_vote: 0.5,
      liquid_emissions_per_vb: 0.0003,
      total_votes: 200,
      total_votes_bal: 5000,
    };

    const result = computePendingEmissions(user, state, params, 1, state.ts);

    const v = params.by_votes_share * user.votes!;
    const vb = (1 - params.by_votes_share) * user.votes! * user.total_balance;
    const expectedLocked = v * (5 - 2) + vb * (0.003 - 0.001);
    const expectedLiquid = v * (0.5 - 0.2) + vb * (0.0003 - 0.0001);

    expect(result.pendingLocked).toBeCloseTo(expectedLocked, 9);
    expect(result.pendingLiquid).toBeCloseTo(expectedLiquid, 9);
  });

  it("does not move per_vote/per_vb when total_votes is zero (no division-by-zero)", () => {
    const user = makeUser({
      total_balance: 100,
      votes: 5,
      last_locked_emissions_per_vote: 1,
      last_liquid_emissions_per_vote: 0.1,
    });
    const state: CoopAaState = {
      ...baseState,
      total_locked: 1000,
      locked_emissions_per_vote: 1,
      liquid_emissions_per_vote: 0.1,
      total_votes: 0,
      total_votes_bal: 0,
    };
    // Even though elapsed days > 0, per_vote/per_vb shouldn't change because
    // there are no total_votes to distribute across. So pending = 0.
    const result = computePendingEmissions(
      user,
      state,
      params,
      1,
      state.ts + 86400 * 30,
    );
    expect(result.pendingLocked).toBe(0);
    expect(result.pendingLiquid).toBe(0);
  });

  it("includes bytes_balance in the emissions denominator via bytes_reducer", () => {
    const user = makeUser({
      total_balance: 0,
      votes: 1,
    });
    const state: CoopAaState = {
      ...baseState,
      total_locked: 0,
      total_locked_bytes: 800,
      total_votes: 1,
      total_votes_bal: 1,
    };
    const ceilingPrice = 2;
    const elapsedDays = 10;
    const nowSec = state.ts + elapsedDays * 86400;

    // s = 0 + 800/2 * 0.75 = 300
    const s = (state.total_locked_bytes / ceilingPrice) * params.bytes_reducer;
    const newLocked = s * params.daily_locked_reward * elapsedDays;
    const newLiquid = s * params.daily_liquid_reward * elapsedDays;
    // vb leg is zero (total_balance = 0), so pending = by_votes_share * 1 * new*
    const expectedLocked = params.by_votes_share * 1 * newLocked;
    const expectedLiquid = params.by_votes_share * 1 * newLiquid;

    const result = computePendingEmissions(
      user,
      state,
      params,
      ceilingPrice,
      nowSec,
    );
    expect(result.pendingLocked).toBeCloseTo(expectedLocked, 9);
    expect(result.pendingLiquid).toBeCloseTo(expectedLiquid, 9);
  });

  it("reproduces the EJC… testnet snapshot (the bug-report case)", () => {
    // Real on-chain values captured for user EJC4A7WQGHEZEKW6RLO7F26SAR4LAQBU.
    // The expected ~40 390 raw locked-reward figure is what should be displayed
    // as pending despite stored locked_rewards being 0.
    const user = makeUser({
      total_balance: 149_391_361.607338,
      votes: 36667.7276970642,
      bytes_balance: 200_000_000,
      last_locked_emissions_per_vote: 96.2393770719105,
      last_liquid_emissions_per_vote: 9.62393770719105,
      last_locked_emissions_per_vb: 4.82184965089355e-7,
      last_liquid_emissions_per_vb: 4.82184965089355e-8,
      last_ts: 1778075620,
    });
    const state: CoopAaState = {
      total_locked: 4_316_499.07528453,
      total_locked_bytes: 1_061_000_000,
      locked_emissions: 14_888_058.1935506,
      liquid_emissions: 1_488_805.81935506,
      locked_emissions_per_vote: 97.4448375193319,
      liquid_emissions_per_vote: 9.74448375193319,
      locked_emissions_per_vb: 4.88862913148191e-7,
      liquid_emissions_per_vb: 4.88862913148191e-8,
      total_votes: 225_122.368963383,
      total_votes_bal: 40_645_141_224_794.6,
      ts: 1778078563,
    };
    // No elapsed time beyond state.ts — we just want to verify the
    // accumulator-delta math against the captured snapshot.
    const result = computePendingEmissions(user, state, params, 2, state.ts);

    // Sanity: locked emission rate is 10x liquid → pending should follow.
    expect(result.pendingLiquid).toBeCloseTo(result.pendingLocked / 10, 6);
    // Order-of-magnitude check matches the back-of-envelope estimate (~40 390).
    expect(result.pendingLocked).toBeGreaterThan(30_000);
    expect(result.pendingLocked).toBeLessThan(60_000);
  });
});
