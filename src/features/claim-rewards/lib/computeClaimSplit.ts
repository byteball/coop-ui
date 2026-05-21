export interface ClaimSplit {
  claimedAtomic: number;
  restakedAtomic: number;
}

/**
 * Mirrors the AA's claim split (coop.oscript):
 *   $claimed_amount = floor($user.liquid_balance * (1 - $restake_percent/100))
 *   $restaked_amount = $user.liquid_balance - $claimed_amount  (atomic remainder)
 *
 * `liquidAtomic` and the returned amounts are in atomic (smallest) units.
 */
export function computeClaimSplit(
  liquidAtomic: number,
  restakePercent: number,
): ClaimSplit {
  const claimedAtomic = Math.floor(liquidAtomic * (1 - restakePercent / 100));
  const restakedAtomic = liquidAtomic - claimedAtomic;
  return { claimedAtomic, restakedAtomic };
}
