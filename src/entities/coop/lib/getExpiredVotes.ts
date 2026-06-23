import { parseAllVotes } from "./parseAllVotes";
import type { VoteEntry } from "./parseAllVotes";
import { isVoteExpired } from "./isVoteExpired";

/** Filters all votes down to the ones that have expired. */
export function getExpiredVotes(
  vars: Record<string, unknown>,
  nowTs: number = Math.floor(Date.now() / 1000),
): VoteEntry[] {
  return parseAllVotes(vars).filter(
    (v) => v.votes > 0 && isVoteExpired(v.ts, nowTs),
  );
}
