const YEAR_SECONDS = 365 * 24 * 3600;

/**
 * Calculates the GBYTE→COOP ceiling price.
 * Formula from AA: `2^((now - launch_ts) / year)`
 *
 * @param launchTs — AA launch unix timestamp (seconds)
 * @returns ceiling price (COOP per GBYTE)
 */
export const getCeilingPrice = (launchTs: number): number => {
  const nowSec = Math.floor(Date.now() / 1000);
  return Math.pow(2, (nowSec - launchTs) / YEAR_SECONDS);
};
