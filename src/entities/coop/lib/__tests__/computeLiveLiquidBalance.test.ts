import { describe, it, expect } from "vitest";

import { computeLiveLiquidBalance } from "../computeLiveLiquidBalance";
import type { CoopUser } from "../../model/schemas";

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

const baseState = {
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

const params = {
  daily_locked_reward: 0.01,
  daily_liquid_reward: 0.001,
  bytes_reducer: 0.75,
  by_votes_share: 0.5,
};

describe("computeLiveLiquidBalance", () => {
  it("returns stored liquid_balance when user has no votes", () => {
    const user = makeUser({ liquid_balance: 42, votes: 0 });
    const result = computeLiveLiquidBalance(
      user,
      baseState,
      params,
      1,
      1700000000,
    );
    expect(result).toBe(42);
  });

  it("returns 0 when user has no votes and no stored liquid", () => {
    const user = makeUser({ votes: 0 });
    const result = computeLiveLiquidBalance(
      user,
      baseState,
      params,
      1,
      1700000000,
    );
    expect(result).toBe(0);
  });

  it("falls back to stored when user.votes is undefined", () => {
    const user = makeUser({ liquid_balance: 7, votes: undefined });
    const result = computeLiveLiquidBalance(
      user,
      baseState,
      params,
      1,
      1700000000,
    );
    expect(result).toBe(7);
  });

  it("accrues live emissions over elapsed days using per_vote and per_vb deltas", () => {
    // Setup: user holds all 100 votes, total_votes_bal matches user contribution.
    const user = makeUser({
      total_balance: 1000,
      votes: 100,
      liquid_balance: 0,
    });
    const state = {
      ...baseState,
      total_locked: 1000, // s = 1000 * 0.001/day
      total_locked_bytes: 0,
      total_votes: 100,
      total_votes_bal: 100 * 1000,
      ts: 1700000000,
    };
    const ceilingPrice = 1;
    const elapsedSec = 86400; // 1 day
    const nowSec = state.ts + elapsedSec;

    // Manually mirror AA math:
    const s =
      state.total_locked +
      (state.total_locked_bytes / ceilingPrice) * params.bytes_reducer;
    const newLiqEmissions = s * params.daily_liquid_reward * 1; // 1 day
    const expectedPerVote = newLiqEmissions / state.total_votes;
    const expectedPerVb = newLiqEmissions / state.total_votes_bal;
    const expected =
      params.by_votes_share * user.votes! * expectedPerVote +
      (1 - params.by_votes_share) *
        user.votes! *
        user.total_balance *
        expectedPerVb;

    const result = computeLiveLiquidBalance(
      user,
      state,
      params,
      ceilingPrice,
      nowSec,
    );
    expect(result).toBeCloseTo(expected, 9);
  });

  it("subtracts user.last_*_per_* baselines from state accumulators", () => {
    const user = makeUser({
      total_balance: 500,
      votes: 50,
      liquid_balance: 100,
      last_liquid_emissions_per_vote: 0.2,
      last_liquid_emissions_per_vb: 0.0001,
    });
    const state = {
      ...baseState,
      liquid_emissions_per_vote: 0.5,
      liquid_emissions_per_vb: 0.0003,
      total_votes: 200,
      total_votes_bal: 5000,
      ts: 1700000000,
    };

    // No elapsed time → no new emissions, only the accumulator delta matters.
    const result = computeLiveLiquidBalance(user, state, params, 1, state.ts);
    const dPerVote = 0.5 - 0.2;
    const dPerVb = 0.0003 - 0.0001;
    const expected =
      100 +
      params.by_votes_share * 50 * dPerVote +
      (1 - params.by_votes_share) * 50 * 500 * dPerVb;
    expect(result).toBeCloseTo(expected, 9);
  });

  it("handles state with zero total_votes (no division-by-zero)", () => {
    const user = makeUser({
      total_balance: 100,
      votes: 0,
      liquid_balance: 5,
    });
    // total_votes/total_votes_bal both 0 — emissions accrue but don't get
    // distributed via per_vote/per_vb yet. User has no votes anyway → returns stored.
    const state = {
      ...baseState,
      total_locked: 1000,
      total_votes: 0,
      total_votes_bal: 0,
    };
    const result = computeLiveLiquidBalance(
      user,
      state,
      params,
      1,
      state.ts + 86400,
    );
    expect(result).toBe(5);
  });

  it("includes bytes_balance in the emissions denominator via bytes_reducer", () => {
    const user = makeUser({
      total_balance: 0,
      votes: 1,
      liquid_balance: 0,
    });
    const state = {
      ...baseState,
      total_locked: 0,
      total_locked_bytes: 800, // s = 0 + 800/2 * 0.75 = 300
      total_votes: 1,
      total_votes_bal: 1,
      ts: 1700000000,
    };
    const ceilingPrice = 2;
    const elapsedDays = 10;
    const nowSec = state.ts + elapsedDays * 86400;

    const s = (state.total_locked_bytes / ceilingPrice) * params.bytes_reducer;
    const newLiqEmissions = s * params.daily_liquid_reward * elapsedDays;
    // dPerVote = newLiqEmissions / 1; dPerVb = newLiqEmissions / 1
    // total_balance is 0 → vb leg is zero
    const expected = params.by_votes_share * 1 * newLiqEmissions;

    const result = computeLiveLiquidBalance(
      user,
      state,
      params,
      ceilingPrice,
      nowSec,
    );
    expect(result).toBeCloseTo(expected, 9);
  });
});
