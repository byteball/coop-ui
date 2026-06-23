import { describe, it, expect } from "vitest";

import { VOTE_LIFETIME } from "#/shared/config/appConfig";
import { isVoteExpired } from "../isVoteExpired";

describe("isVoteExpired", () => {
  const now = 1_000_000_000;

  it("is true at and beyond the lifetime boundary", () => {
    expect(isVoteExpired(now - VOTE_LIFETIME, now)).toBe(true);
    expect(isVoteExpired(now - VOTE_LIFETIME - 1, now)).toBe(true);
  });

  it("is false before the boundary", () => {
    expect(isVoteExpired(now - VOTE_LIFETIME + 1, now)).toBe(false);
    expect(isVoteExpired(now, now)).toBe(false);
  });
});
