import { useEffect, useState } from "react";

import { computePendingEmissions } from "../lib/computePendingEmissions";
import type { CoopUser } from "./schemas";
import { useCoopState } from "./useCoopState";

export interface LiveUserBalances {
  pendingLocked: number;
  pendingLiquid: number;
  /** Locked COOP balance (atomic units), including pending locked emissions. */
  liveBalance: number;
  /** Total balance (locked COOP + reduced bytes), including pending. */
  liveTotalBalance: number;
  /** Claimable liquid balance (atomic units), including pending liquid. */
  liveLiquidBalance: number;
}

/**
 * Mirrors the AA's `$update_user` to compute "live" balances on the client —
 * stored fields plus emissions accrued since the user's last interaction. Ticks
 * once a minute so values keep drifting visually even when no AA response
 * arrives (matches the cadence of governance Countdown).
 */
export function useLiveUserBalances(user: CoopUser): LiveUserBalances {
  const { getAaState, getParam, getCeilingPrice } = useCoopState();

  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const aaState = getAaState();
  const ceilingPrice = getCeilingPrice();

  const stored = {
    pendingLocked: 0,
    pendingLiquid: 0,
    liveBalance: user.balance,
    liveTotalBalance: user.total_balance,
    liveLiquidBalance: user.liquid_balance ?? 0,
  };
  if (!aaState || ceilingPrice === undefined) return stored;

  const pending = computePendingEmissions(
    user,
    aaState,
    {
      daily_locked_reward: getParam("daily_locked_reward"),
      daily_liquid_reward: getParam("daily_liquid_reward"),
      bytes_reducer: getParam("bytes_reducer"),
      by_votes_share: getParam("by_votes_share"),
    },
    ceilingPrice,
  );

  return {
    pendingLocked: pending.pendingLocked,
    pendingLiquid: pending.pendingLiquid,
    liveBalance: user.balance + pending.pendingLocked,
    liveTotalBalance: user.total_balance + pending.pendingLocked,
    liveLiquidBalance: (user.liquid_balance ?? 0) + pending.pendingLiquid,
  };
}
