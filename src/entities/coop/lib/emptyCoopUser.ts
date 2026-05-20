import type { CoopUser } from "../model/schemas";

/**
 * Zero-initialized `CoopUser` used as a placeholder when a wallet has never
 * interacted with the AA (no `user_<addr>` state var yet). Centralized so adding
 * a required field to the schema only changes one site instead of every page
 * that wants a "blank" user.
 */
export function emptyCoopUser(): CoopUser {
  return {
    balance: 0,
    bytes_balance: 0,
    total_balance: 0,
    unlock_date: false,
    reg_date: "",
    reg_ts: 0,
    last_ts: 0,
    last_locked_emissions_per_vote: 0,
    last_liquid_emissions_per_vote: 0,
    last_locked_emissions_per_vb: 0,
    last_liquid_emissions_per_vb: 0,
  };
}
