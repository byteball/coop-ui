import { getVoteExpiry } from "./getVoteExpiry";

/**
 * Whether a vote cast at `ts` has expired as of `nowTs` (both UTC unix
 * seconds, so the comparison is timezone-independent). Single source of the
 * expiration rule — mirrors the AA's `timestamp - $vote.ts >= $vote_lifetime`.
 */
export function isVoteExpired(
  ts: number,
  nowTs: number = Math.floor(Date.now() / 1000),
): boolean {
  return getVoteExpiry(ts) <= nowTs;
}
