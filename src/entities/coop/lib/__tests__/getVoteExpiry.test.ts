import { describe, it, expect } from "vitest";

import { VOTE_LIFETIME } from "#/shared/config/appConfig";
import { getVoteExpiry } from "../getVoteExpiry";

describe("getVoteExpiry", () => {
  it("adds the lifetime to the cast timestamp", () => {
    const ts = 1_000_000_000;
    expect(getVoteExpiry(ts)).toBe(ts + VOTE_LIFETIME);
  });
});
