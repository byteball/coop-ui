import { generateLink } from "#/shared/lib/generateLink";
import { env } from "#/shared/config/env";
import { BOUNCE_FEE } from "#/shared/config/appConfig";

interface BuildClaimRewardsLinkParams {
  restakePercent: number;
}

export function buildClaimRewardsLink({
  restakePercent,
}: BuildClaimRewardsLinkParams): string | null {
  if (!Number.isInteger(restakePercent)) return null;
  if (restakePercent < 0 || restakePercent > 100) return null;

  const data: Record<string, number> = { claim: 1 };
  if (restakePercent > 0) {
    data.restake_percent = restakePercent;
  }

  return generateLink({
    amount: BOUNCE_FEE,
    aa: env.VITE_AA_ADDRESS,
    asset: "base",
    data,
  });
}
