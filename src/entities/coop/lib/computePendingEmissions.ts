import type { CoopAaState, CoopUser } from "../model/schemas";

export interface EmissionParams {
  daily_locked_reward: number;
  daily_liquid_reward: number;
  bytes_reducer: number;
  by_votes_share: number;
}

export interface PendingEmissions {
  pendingLocked: number;
  pendingLiquid: number;
}

/**
 * Mirrors AA's `$update_emissions` + `$update_user` to compute the emissions
 * that have accrued for a user since their last interaction but are not yet
 * credited to their `balance`/`liquid_balance`/`locked_rewards`/`liquid_rewards`.
 *
 * Returns both locked and liquid pending amounts (atomic units).
 */
export function computePendingEmissions(
  user: CoopUser,
  state: CoopAaState,
  params: EmissionParams,
  ceilingPrice: number,
  nowSec: number = Math.floor(Date.now() / 1000),
): PendingEmissions {
  if (!user.votes || user.votes <= 0) {
    return { pendingLocked: 0, pendingLiquid: 0 };
  }

  const elapsedDays = Math.max(0, (nowSec - state.ts) / 86400);
  const s =
    state.total_locked +
    (state.total_locked_bytes / ceilingPrice) * params.bytes_reducer;

  const newLockedEmissions = s * params.daily_locked_reward * elapsedDays;
  const newLiquidEmissions = s * params.daily_liquid_reward * elapsedDays;

  let liveLockedPerVote = state.locked_emissions_per_vote;
  let liveLockedPerVb = state.locked_emissions_per_vb;
  let liveLiquidPerVote = state.liquid_emissions_per_vote;
  let liveLiquidPerVb = state.liquid_emissions_per_vb;
  if (state.total_votes > 0 && state.total_votes_bal > 0) {
    liveLockedPerVote += newLockedEmissions / state.total_votes;
    liveLockedPerVb += newLockedEmissions / state.total_votes_bal;
    liveLiquidPerVote += newLiquidEmissions / state.total_votes;
    liveLiquidPerVb += newLiquidEmissions / state.total_votes_bal;
  }

  const dLockedPerVote =
    liveLockedPerVote - user.last_locked_emissions_per_vote;
  const dLockedPerVb = liveLockedPerVb - user.last_locked_emissions_per_vb;
  const dLiquidPerVote =
    liveLiquidPerVote - user.last_liquid_emissions_per_vote;
  const dLiquidPerVb = liveLiquidPerVb - user.last_liquid_emissions_per_vb;

  const v = params.by_votes_share * user.votes;
  const vb = (1 - params.by_votes_share) * user.votes * user.total_balance;

  return {
    pendingLocked: v * dLockedPerVote + vb * dLockedPerVb,
    pendingLiquid: v * dLiquidPerVote + vb * dLiquidPerVb,
  };
}
