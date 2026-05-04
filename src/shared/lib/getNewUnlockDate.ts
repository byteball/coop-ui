const YEAR_MS = 365 * 24 * 3600 * 1000;

/**
 * Mirrors the AA's unlock-date extension on restake/claim:
 *   $new_unlock_date = today + 1 year
 *   if ($new_unlock_date > $user.unlock_date) $user.unlock_date = $new_unlock_date
 *
 * I.e. unlock never goes backwards. Returns a Date at local midnight, suitable
 * for `formatDateShort`.
 *
 * @param currentUnlockDate AA-stored date string ("YYYY-MM-DD") or `false` if
 *   the user has never locked.
 * @param now Optional reference time (ms since epoch). Defaults to `Date.now()`.
 */
export function getNewUnlockDate(
  currentUnlockDate: string | false,
  now: number = Date.now(),
): Date {
  const inOneYear = new Date(now + YEAR_MS);
  inOneYear.setHours(0, 0, 0, 0);
  if (!currentUnlockDate) return inOneYear;
  const current = new Date(currentUnlockDate);
  current.setHours(0, 0, 0, 0);
  return current > inOneYear ? current : inOneYear;
}
