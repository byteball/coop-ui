import { getNewUnlockDate } from "#/entities/coop";

/**
 * Returns the unlock date that the AA will set on a claim-with-restake, or
 * `null` if the AA would leave it unchanged.
 *
 * Mirrors coop.oscript:
 *   if ($restaked_amount) {
 *     $new_unlock_date = today + 1 year;
 *     if ($new_unlock_date > $user.unlock_date) $user.unlock_date = $new_unlock_date;
 *   }
 *
 * So the date only changes when some portion is restaked AND today + 1 year is
 * later than the existing unlock date.
 */
export function getRestakeUnlockDate(
  currentUnlockDate: string | false,
  restakePercent: number,
  now: number = Date.now(),
): Date | null {
  if (restakePercent <= 0) return null;
  const next = getNewUnlockDate(currentUnlockDate, now);
  const currentMs = currentUnlockDate
    ? new Date(currentUnlockDate).setHours(0, 0, 0, 0)
    : 0;
  return next.getTime() === currentMs ? null : next;
}
