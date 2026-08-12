import { getExpiredVotes } from "#/entities/coop";

const MAX_DELETIONS = 5; // matches the foreach(..., 5, ...) limit in coop.oscript

/**
 * Builds the optional `delete_expired_votes` payload to piggy-back on a vote
 * transaction. Picks a random batch of unrelated expired votes so cleanup
 * work is amortized across the user base.
 *
 * Excludes every vote involving the voter. Votes cast by other users for the
 * current recipient remain eligible for cleanup.
 *
 * The AA payload is a `{ from_address: to_address }` map, so it can include at
 * most one expired vote per sender. Returns `undefined` when there is nothing
 * to clean.
 */
export function buildDeleteExpiredVotes({
  vars,
  voterAddress,
  nowTs = Math.floor(Date.now() / 1000),
  max = MAX_DELETIONS,
}: {
  vars: Record<string, unknown>;
  voterAddress: string;
  nowTs?: number;
  max?: number;
}): Record<string, string> | undefined {
  const candidates = getExpiredVotes(vars, nowTs).filter(
    (v) =>
      v.fromAddress !== voterAddress && v.toAddress !== voterAddress,
  );

  // Fisher–Yates shuffle so the deletions we pick are random across own + others.
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  const result: Record<string, string> = {};
  let count = 0;
  for (const vote of candidates) {
    if (count >= max) break;
    if (vote.fromAddress in result) continue;
    result[vote.fromAddress] = vote.toAddress;
    count++;
  }

  return count > 0 ? result : undefined;
}
