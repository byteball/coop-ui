import { generateLink } from "#/shared/lib/generateLink";
import { tooManyDecimals } from "#/shared/lib/tooManyDecimals";
import { env } from "#/shared/config/env";

interface BuildReplaceLinkParams {
  amount: string;
  coopAsset: string | undefined;
  coopDecimals: number;
  fromAddress?: string;
}

export function buildReplaceLink({
  amount,
  coopAsset,
  coopDecimals,
  fromAddress,
}: BuildReplaceLinkParams): string | null {
  if (!coopAsset) return null;
  const num = Number(amount);
  if (!amount || isNaN(num) || num <= 0) return null;
  if (tooManyDecimals(amount, coopDecimals)) return null;

  const parsedAmount = Math.round(num * 10 ** coopDecimals);
  if (parsedAmount <= 0) return null;

  return generateLink({
    amount: parsedAmount,
    aa: env.VITE_AA_ADDRESS,
    asset: coopAsset,
    data: { replace: 1 },
    from_address: fromAddress,
  });
}
