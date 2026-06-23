const MINUTE = 60;
const HOUR = 3600;
const DAY = 86400;

function plural(unit: string, value: number): string {
  return value === 1 ? unit : `${unit}s`;
}

/**
 * Formats the remaining time until a UTC unix-timestamp (seconds)
 * into a human-readable string like "3 days 4h 12m".
 *
 * Pure arithmetic over UTC timestamps — no timezone or locale dependencies.
 *
 * With `collapseDays`, anything a day or more away is shown as whole days only
 * ("3 days"); below a day it falls back to hours and minutes ("4h 12m").
 */
export const formatPeriod = (
  periodEndTs: number,
  { collapseDays = false }: { collapseDays?: boolean } = {},
): string => {
  // Both values are UTC: unix timestamp (seconds) and Date.now() (ms → seconds)
  const remainingSec = periodEndTs - Math.floor(Date.now() / 1000);

  if (remainingSec <= 0) return "0 minutes";

  const days = Math.floor(remainingSec / DAY);
  const hours = Math.floor((remainingSec % DAY) / HOUR);
  const minutes = Math.floor((remainingSec % HOUR) / MINUTE);

  if (collapseDays && days >= 1) return `${days} ${plural("day", days)}`;

  const parts: string[] = [];
  if (days) parts.push(`${days} ${plural("day", days)}`);
  if (hours) parts.push(`${hours}h`);
  if (minutes || !parts.length) {
    parts.push(
      parts.length ? `${minutes}m` : `${minutes} ${plural("minute", minutes)}`,
    );
  }

  return parts.join(" ");
};
