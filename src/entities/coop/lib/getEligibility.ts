import type { CoopUser } from "../model/schemas";

export interface Eligibility {
  isEligible: boolean;
  hasBalance: boolean;
  hasLockPeriod: boolean;
}

export function getEligibility(user: CoopUser | undefined): Eligibility {
  const hasBalance =
    !!user && (user.balance > 0 || user.bytes_balance > 0);

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 365);
  const hasLockPeriod =
    !!user &&
    typeof user.unlock_date === "string" &&
    user.unlock_date >= minDate.toISOString().slice(0, 10);

  return {
    isEligible: hasBalance && hasLockPeriod,
    hasBalance,
    hasLockPeriod,
  };
}
