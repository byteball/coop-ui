import { getExpiredVotes } from "#/entities/coop";

const MAX_DELETIONS = 5; // matches the foreach(..., 5, ...) limit in coop.oscript

/**
 * Builds the optional `delete_expired_votes` payload to piggy-back on a vote
 * transaction. Picks a random batch of unrelated expired votes so cleanup
 * work is amortized across the user base.
 *
 * Excludes every vote involving the voter or the user they are voting for, so
 * neither address can appear as a key or value in the cleanup payload.
 *
 * The AA payload is a `{ from_address: to_address }` map: keys are unique, so
 * at most one expired vote per voter is cleaned per transaction. Returns
 * `undefined` when there is nothing to clean.
 */
export function buildDeleteExpiredVotes({
  vars,
  voterAddress,
  forAddress,
  nowTs = Math.floor(Date.now() / 1000),
  max = MAX_DELETIONS,
}: {
  vars: Record<string, unknown>;
  voterAddress: string;
  forAddress: string;
  nowTs?: number;
  max?: number;
}): Record<string, string> | undefined {
  const excludedAddresses = new Set([voterAddress, forAddress]);
  const candidates = getExpiredVotes(vars, nowTs).filter(
    (v) =>
      !excludedAddresses.has(v.fromAddress) &&
      !excludedAddresses.has(v.toAddress),
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
    // Object keys are unique: keep only the first (random) expired vote per voter.
    if (vote.fromAddress in result) continue;
    result[vote.fromAddress] = vote.toAddress;
    count++;
  }

  return count > 0 ? result : undefined;
}
