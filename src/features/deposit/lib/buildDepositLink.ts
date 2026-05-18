import { generateLink } from "#/shared/lib/generateLink";
import { tooManyDecimals } from "#/shared/lib/tooManyDecimals";
import { diffDays } from "#/shared/lib/diffDays";
import { env } from "#/shared/config/env";

import {
  MIN_TERM_DAYS,
  MAX_TERM_DAYS,
  BOUNCE_FEE,
  getToday,
} from "./constants";

interface BuildDepositLinkParams {
  amount: string;
  asset: string;
  unlockDate: Date;
  coopAsset: string | undefined;
  coopDecimals: number;
  gbyteDecimals: number;
  referrer: string | undefined;
  fromAddress?: string;
}

export function buildDepositLink({
  amount,
  asset,
  unlockDate,
  coopAsset,
  coopDecimals,
  gbyteDecimals,
  referrer,
  fromAddress,
}: BuildDepositLinkParams): string | null {
  const num = Number(amount);
  if (!amount || isNaN(num) || num <= 0) return null;

  const decimals = asset === "coop" ? coopDecimals : gbyteDecimals;
  if (tooManyDecimals(amount, decimals)) return null;

  const parsedAmount = Math.round(num * 10 ** decimals);
  const term = diffDays(getToday(), unlockDate);

  if (term < MIN_TERM_DAYS || term > MAX_TERM_DAYS) return null;

  const data: Record<string, string | number> = { deposit: 1 };

  data.term = term;

  if (referrer) {
    data.ref = referrer;
  }

  const isCoop = asset === "coop" && coopAsset;

  return generateLink({
    amount: isCoop ? parsedAmount : parsedAmount + BOUNCE_FEE,
    aa: env.VITE_AA_ADDRESS,
    asset: isCoop ? coopAsset : "base",
    data,
    from_address: fromAddress,
  });
}
