import type { AppParamName } from "#/shared/config/appConfig";

const overrides: Partial<Record<AppParamName, string>> = {
  // Add overrides here if needed, e.g.:
  // by_votes_share: "Emission share by votes",
  referrer_coop_deposit_reward_share: "Referrer COOP deposit reward share",
};

/** Converts a snake_case param name to a readable label: "daily_locked_reward" → "Daily locked reward" */
export function formatParamName(name: AppParamName): string {
  if (overrides[name]) return overrides[name];
  const words = name.split("_").join(" ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}
