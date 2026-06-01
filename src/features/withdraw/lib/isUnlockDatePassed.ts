/**
 * Mirrors the AA's withdraw gate:
 *   require(timestamp_to_string(timestamp, 'date') >= $user.unlock_date)
 *
 * The AA compares UTC date strings ("YYYY-MM-DD"), and the stored `unlock_date`
 * is itself produced by `timestamp_to_string(..., 'date')` (also UTC), so we
 * compare UTC date strings here too to match the contract exactly.
 *
 * @param unlockDate AA-stored "YYYY-MM-DD" string, or `false` if never locked.
 * @param now Optional reference time (ms since epoch). Defaults to `Date.now()`.
 * @returns true once the lock period has ended and a withdraw is allowed.
 */
export function isUnlockDatePassed(
  unlockDate: string | false,
  now: number = Date.now(),
): boolean {
  if (!unlockDate) return false;
  const today = new Date(now).toISOString().slice(0, 10);
  return today >= unlockDate;
}
