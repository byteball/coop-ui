import { describe, it, expect } from "vitest";

import { VOTE_LIFETIME } from "#/shared/config/appConfig";
import { buildDeleteExpiredVotes } from "../buildDeleteExpiredVotes";

const NOW = 1_000_000_000;
const EXPIRED_TS = NOW - VOTE_LIFETIME - 1;
const FRESH_TS = NOW - 1;

describe("buildDeleteExpiredVotes", () => {
  it("returns undefined when there are no expired votes", () => {
    const vars = {
      vote_X_Y: { votes: 5, ts: FRESH_TS },
    };
    expect(
      buildDeleteExpiredVotes({
        vars,
        voterAddress: "VOTER",
        forAddress: "FOR",
        nowTs: NOW,
      }),
    ).toBeUndefined();
  });

  it("excludes the vote being extended (voter -> for) and the self-vote (voter -> voter)", () => {
    const vars = {
      vote_VOTER_FOR: { votes: 5, ts: EXPIRED_TS }, // being extended now
      vote_VOTER_VOTER: { votes: 9, ts: EXPIRED_TS }, // self-vote, refreshed now
    };
    expect(
      buildDeleteExpiredVotes({
        vars,
        voterAddress: "VOTER",
        forAddress: "FOR",
        nowTs: NOW,
      }),
    ).toBeUndefined();
  });

  it("includes the voter's other expired votes and other users' expired votes", () => {
    const vars = {
      vote_VOTER_FOR: { votes: 5, ts: EXPIRED_TS }, // excluded (extended)
      vote_VOTER_OTHER: { votes: 5, ts: EXPIRED_TS }, // own, different target -> allowed
      vote_ALICE_BOB: { votes: 5, ts: EXPIRED_TS }, // someone else -> allowed
    };
    const result = buildDeleteExpiredVotes({
      vars,
      voterAddress: "VOTER",
      forAddress: "FOR",
      nowTs: NOW,
    })!;
    expect(result.VOTER).toBe("OTHER");
    expect(result.ALICE).toBe("BOB");
    expect("FOR" in result).toBe(false);
  });

  it("never exceeds max entries", () => {
    const vars: Record<string, unknown> = {};
    for (let i = 0; i < 12; i++) {
      vars[`vote_FROM${i}_TO${i}`] = { votes: 5, ts: EXPIRED_TS };
    }
    const result = buildDeleteExpiredVotes({
      vars,
      voterAddress: "VOTER",
      forAddress: "FOR",
      nowTs: NOW,
    })!;
    expect(Object.keys(result).length).toBe(5); // default max

    const limited = buildDeleteExpiredVotes({
      vars,
      voterAddress: "VOTER",
      forAddress: "FOR",
      nowTs: NOW,
      max: 3,
    })!;
    expect(Object.keys(limited).length).toBe(3);
  });

  it("keeps at most one expired vote per from_address (map keys are unique)", () => {
    const vars = {
      vote_ALICE_BOB: { votes: 5, ts: EXPIRED_TS },
      vote_ALICE_CAROL: { votes: 5, ts: EXPIRED_TS },
    };
    const result = buildDeleteExpiredVotes({
      vars,
      voterAddress: "VOTER",
      forAddress: "FOR",
      nowTs: NOW,
    })!;
    expect(Object.keys(result)).toEqual(["ALICE"]);
    expect(["BOB", "CAROL"]).toContain(result.ALICE);
  });

  it("ignores not-yet-expired votes", () => {
    const vars = {
      vote_ALICE_BOB: { votes: 5, ts: FRESH_TS }, // not expired
      vote_CAROL_DAVE: { votes: 5, ts: EXPIRED_TS }, // expired
    };
    const result = buildDeleteExpiredVotes({
      vars,
      voterAddress: "VOTER",
      forAddress: "FOR",
      nowTs: NOW,
    })!;
    expect(Object.keys(result)).toEqual(["CAROL"]);
  });
});
