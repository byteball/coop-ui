import type { CoopAaState, CoopUser } from "../model/schemas";
import { computePendingEmissions } from "./computePendingEmissions";
import type { EmissionParams } from "./computePendingEmissions";

/**
 * Mirrors AA's `$update_emissions` + `$update_user` for `liquid_balance`.
 * Returns the live claimable amount (in atomic units), accounting for emissions
 * accrued since the user's last interaction.
 */
export function computeLiveLiquidBalance(
  user: CoopUser,
  state: CoopAaState,
  params: EmissionParams,
  ceilingPrice: number,
  nowSec: number = Math.floor(Date.now() / 1000),
): number {
  const stored = user.liquid_balance ?? 0;
  const { pendingLiquid } = computePendingEmissions(
    user,
    state,
    params,
    ceilingPrice,
    nowSec,
  );
  return stored + pendingLiquid;
}
