// @vitest-environment jsdom

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { setCoopVars, coopStore } from "../store";
import { useLiveUserBalances } from "../useLiveUserBalances";
import type { CoopUser, CoopAaState, CoopConstants } from "../schemas";

const YEAR_SEC = 365 * 86400;
const NOW_SEC = Math.floor(Date.now() / 1000);

function makeUser(overrides: Partial<CoopUser> = {}): CoopUser {
  return {
    balance: 0,
    bytes_balance: 0,
    total_balance: 0,
    unlock_date: "2030-01-01",
    reg_date: "2026-01-01",
    reg_ts: NOW_SEC - YEAR_SEC,
    last_ts: NOW_SEC,
    last_locked_emissions_per_vote: 0,
    last_liquid_emissions_per_vote: 0,
    last_locked_emissions_per_vb: 0,
    last_liquid_emissions_per_vb: 0,
    liquid_balance: 0,
    votes: 0,
    ...overrides,
  };
}

const constants: CoopConstants = {
  asset: "ASSET",
  governance_aa: "GOV",
  launch_ts: NOW_SEC - YEAR_SEC,
};

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
  ts: NOW_SEC,
};

const baseVariables = {
  daily_locked_reward: 0.01,
  daily_liquid_reward: 0.001,
  bytes_reducer: 0.75,
  by_votes_share: 0.5,
  referrer_coop_deposit_reward_share: 0.01,
  referrer_bytes_deposit_reward_share: 0.01,
  referral_reward: 1,
  min_balance_instead_of_real_name: 50_000_000_000,
  messaging_attestors: "",
  real_name_attestors: "",
};

beforeEach(() => {
  act(() => {
    setCoopVars({
      constants,
      state: baseState,
      variables: baseVariables,
    });
  });
});

afterEach(() => {
  act(() => {
    coopStore.setState(() => ({ status: "idle", vars: {} }));
  });
});

describe("useLiveUserBalances", () => {
  it("returns stored balances when user has no votes (no pending)", () => {
    const user = makeUser({
      balance: 100,
      total_balance: 100,
      liquid_balance: 5,
      votes: 0,
    });
    const { result } = renderHook(() => useLiveUserBalances(user));

    expect(result.current.pendingLocked).toBe(0);
    expect(result.current.pendingLiquid).toBe(0);
    expect(result.current.liveBalance).toBe(100);
    expect(result.current.liveTotalBalance).toBe(100);
    expect(result.current.liveLiquidBalance).toBe(5);
  });

  it("falls back to stored values when coop state is not loaded yet", () => {
    act(() => {
      coopStore.setState(() => ({ status: "idle", vars: {} }));
    });
    const user = makeUser({
      balance: 10,
      total_balance: 20,
      liquid_balance: 3,
    });
    const { result } = renderHook(() => useLiveUserBalances(user));

    expect(result.current.liveBalance).toBe(10);
    expect(result.current.liveTotalBalance).toBe(20);
    expect(result.current.liveLiquidBalance).toBe(3);
  });

  it("adds pending emissions to live balances when user has votes", () => {
    const elapsed = 86400; // 1 day
    act(() => {
      setCoopVars({
        constants,
        state: {
          ...baseState,
          total_locked: 1_000_000,
          total_votes: 100,
          total_votes_bal: 1_000_000,
          ts: NOW_SEC - elapsed,
        },
        variables: baseVariables,
      });
    });

    const user = makeUser({
      balance: 1000,
      total_balance: 1000,
      liquid_balance: 0,
      votes: 100,
    });
    const { result } = renderHook(() => useLiveUserBalances(user));

    // 1 day at 1% locked + 0.1% liquid; user owns all the voting weight, so
    // they receive the full daily emission split 50/50 between by-votes and
    // by-votes-balance pools.
    expect(result.current.pendingLocked).toBeGreaterThan(0);
    expect(result.current.pendingLiquid).toBeGreaterThan(0);
    expect(result.current.pendingLiquid).toBeCloseTo(
      result.current.pendingLocked / 10,
      6,
    );
    expect(result.current.liveBalance).toBe(
      user.balance + result.current.pendingLocked,
    );
    expect(result.current.liveTotalBalance).toBe(
      user.total_balance + result.current.pendingLocked,
    );
    expect(result.current.liveLiquidBalance).toBe(
      (user.liquid_balance ?? 0) + result.current.pendingLiquid,
    );
  });
});
