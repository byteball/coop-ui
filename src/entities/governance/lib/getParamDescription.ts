import * as m from "#/paraglide/messages";
import type { AppParamName } from "#/shared/config/appConfig";

const descriptions: Record<AppParamName, () => string> = {
  daily_locked_reward: m.governance_desc_daily_locked_reward,
  daily_liquid_reward: m.governance_desc_daily_liquid_reward,
  bytes_reducer: m.governance_desc_bytes_reducer,
  by_votes_share: m.governance_desc_by_votes_share,
  referrer_coop_deposit_reward_share:
    m.governance_desc_referrer_coop_deposit_reward_share,
  referrer_bytes_deposit_reward_share:
    m.governance_desc_referrer_bytes_deposit_reward_share,
  referral_reward: m.governance_desc_referral_reward,
  min_balance_instead_of_real_name:
    m.governance_desc_min_balance_instead_of_real_name,
  messaging_attestors: m.governance_desc_messaging_attestors,
  real_name_attestors: m.governance_desc_real_name_attestors,
};

export function getParamDescription(name: AppParamName): string {
  return descriptions[name]();
}
