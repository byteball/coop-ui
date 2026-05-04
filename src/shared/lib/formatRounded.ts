/**
 * Formats a number with locale-aware separators, capped at the given number
 * of fractional digits. Trailing zeroes are stripped (minimumFractionDigits = 0).
 *
 * Use this for displaying token amounts where you want a stable upper bound on
 * decimals but don't need to pad short values.
 */
export function formatRounded(value: number, decimals: number): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}
