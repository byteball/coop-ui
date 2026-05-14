import { useCoopState } from "#/entities/coop";
import { useAssetInfo } from "#/entities/token";
import { attestationLinks, obyteCommunityUrls } from "#/shared/config/appConfig";
import { toLocalString } from "#/shared/lib/toLocalString";

export function useFaqInputs() {
  const { constants, getParam } = useCoopState();
  const { coopDecimals, coopSymbol } = useAssetInfo(constants?.asset);

  const byVotesShare = getParam("by_votes_share");
  const dailyLocked = getParam("daily_locked_reward");

  return {
    telegramBot: attestationLinks.telegram,
    discordBot: attestationLinks.discord,
    realNameBot: attestationLinks.realName,
    telegramCommunity: obyteCommunityUrls.telegram,
    discordCommunity: obyteCommunityUrls.discord,
    symbol: coopSymbol,
    minBalance: toLocalString(
      getParam("min_balance_instead_of_real_name") / 10 ** coopDecimals,
    ),
    dailyLockedPct: toLocalString(dailyLocked * 100),
    dailyLiquidPct: toLocalString(getParam("daily_liquid_reward") * 100),
    byVotesPct: toLocalString(byVotesShare * 100),
    byVotesAndBalancePct: toLocalString((1 - byVotesShare) * 100),
    bytesReducerPct: toLocalString(getParam("bytes_reducer") * 100),
    lockedGrowthMultiplier: toLocalString(
      Math.round(Math.pow(1 + dailyLocked, 365) * 10) / 10,
    ),
    referralReward: toLocalString(
      getParam("referral_reward") / 10 ** coopDecimals,
    ),
    referrerCoopPct: toLocalString(
      getParam("referrer_coop_deposit_reward_share") * 100,
    ),
    referrerBytesPct: toLocalString(
      getParam("referrer_bytes_deposit_reward_share") * 100,
    ),
  };
}
