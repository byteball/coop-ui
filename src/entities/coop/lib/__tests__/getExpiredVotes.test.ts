import { describe, it, expect } from "vitest";

import { VOTE_LIFETIME } from "#/shared/config/appConfig";
import { getExpiredVotes } from "../getExpiredVotes";

describe("getExpiredVotes", () => {
  const now = 1_000_000_000;

  it("includes votes at or beyond the lifetime boundary", () => {
    const vars = {
      vote_A_B: { votes: 5, ts: now - VOTE_LIFETIME }, // exactly expired
      vote_C_D: { votes: 5, ts: now - VOTE_LIFETIME - 1 }, // older
    };
    const result = getExpiredVotes(vars, now);
    expect(result.map((v) => v.fromAddress).sort()).toEqual(["A", "C"]);
  });

  it("excludes votes that are not yet expired", () => {
    const vars = {
      vote_A_B: { votes: 5, ts: now - VOTE_LIFETIME + 1 },
      vote_C_D: { votes: 5, ts: now },
    };
    expect(getExpiredVotes(vars, now)).toEqual([]);
  });

  it("excludes zero-vote entries even when old", () => {
    const vars = {
      vote_A_B: { votes: 0, ts: now - VOTE_LIFETIME * 2 },
    };
    expect(getExpiredVotes(vars, now)).toEqual([]);
  });
});
