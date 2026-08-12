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

  it("excludes every vote involving the voter or the user being voted for", () => {
    const vars = {
      vote_VOTER_FOR: { votes: 5, ts: EXPIRED_TS },
      vote_VOTER_OTHER: { votes: 5, ts: EXPIRED_TS },
      vote_OTHER_VOTER: { votes: 5, ts: EXPIRED_TS },
      vote_FOR_OTHER: { votes: 5, ts: EXPIRED_TS },
      vote_OTHER_FOR: { votes: 5, ts: EXPIRED_TS },
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

  it("includes expired votes unrelated to the voter and recipient", () => {
    const vars = {
      vote_VOTER_OTHER: { votes: 5, ts: EXPIRED_TS }, // excluded by voter
      vote_OTHER_FOR: { votes: 5, ts: EXPIRED_TS }, // excluded by recipient
      vote_ALICE_BOB: { votes: 5, ts: EXPIRED_TS }, // unrelated -> allowed
    };
    const result = buildDeleteExpiredVotes({
      vars,
      voterAddress: "VOTER",
      forAddress: "FOR",
      nowTs: NOW,
    })!;
    expect(result.ALICE).toBe("BOB");
    expect(Object.keys(result)).toEqual(["ALICE"]);
    expect(Object.values(result)).toEqual(["BOB"]);
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
