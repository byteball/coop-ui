import { generateLink } from "#/shared/lib/generateLink";
import { env } from "#/shared/config/env";
import { BOUNCE_FEE } from "#/shared/config/appConfig";

interface BuildWithdrawLinkParams {
  fromAddress?: string;
}

/**
 * Builds the `obyte:` deep link for a full withdrawal. The AA pays back the
 * entire locked position (bytes + COOP + liquid) and zeroes the account, so the
 * trigger only needs to carry the bounce fee and `{ withdraw: 1 }`.
 */
export function buildWithdrawLink({
  fromAddress,
}: BuildWithdrawLinkParams = {}): string {
  return generateLink({
    amount: BOUNCE_FEE,
    aa: env.VITE_AA_ADDRESS,
    asset: "base",
    data: { withdraw: 1 },
    from_address: fromAddress,
  });
}
