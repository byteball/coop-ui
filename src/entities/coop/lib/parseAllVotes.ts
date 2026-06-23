const VOTE_PREFIX = "vote_";

export interface VoteEntry {
  fromAddress: string;
  toAddress: string;
  votes: number;
  strength?: number;
  ts: number;
}

/**
 * Single source of truth for reading votes out of the raw AA state vars.
 *
 * Vote vars are named `vote_<from>_<to>`. Obyte addresses contain no
 * underscore, so the part after the `vote_` prefix splits into exactly two
 * pieces on the first `_`. The per-address helpers (`extractVotesGiven` /
 * `extractVotesReceived`) and the expired-vote filter all build on this.
 */
export function parseAllVotes(vars: Record<string, unknown>): VoteEntry[] {
  const entries: VoteEntry[] = [];

  for (const key in vars) {
    if (!key.startsWith(VOTE_PREFIX)) continue;

    const rest = key.slice(VOTE_PREFIX.length);
    const sep = rest.indexOf("_");
    if (sep <= 0 || sep >= rest.length - 1) continue;

    const val = vars[key] as {
      votes: number;
      strength?: number;
      ts: number;
    } | null;
    if (!val || typeof val.votes !== "number" || typeof val.ts !== "number")
      continue;

    entries.push({
      fromAddress: rest.slice(0, sep),
      toAddress: rest.slice(sep + 1),
      votes: val.votes,
      strength: typeof val.strength === "number" ? val.strength : undefined,
      ts: val.ts,
    });
  }

  return entries;
}
