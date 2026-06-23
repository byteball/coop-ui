import { VOTE_LIFETIME } from "#/shared/config/appConfig";

/** UTC unix-seconds timestamp at which a vote cast at `ts` expires. */
export function getVoteExpiry(ts: number): number {
  return ts + VOTE_LIFETIME;
}
