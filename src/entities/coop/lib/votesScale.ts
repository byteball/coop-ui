export function getVotesDivisor(coopDecimals: number): number {
  return Math.sqrt(10 ** coopDecimals);
}
