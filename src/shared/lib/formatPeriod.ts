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
 */
export const formatPeriod = (periodEndTs: number): string => {
  // Both values are UTC: unix timestamp (seconds) and Date.now() (ms → seconds)
  const remainingSec = periodEndTs - Math.floor(Date.now() / 1000);

  if (remainingSec <= 0) return "0 minutes";

  const days = Math.floor(remainingSec / DAY);
  const hours = Math.floor((remainingSec % DAY) / HOUR);
  const minutes = Math.floor((remainingSec % HOUR) / MINUTE);

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
