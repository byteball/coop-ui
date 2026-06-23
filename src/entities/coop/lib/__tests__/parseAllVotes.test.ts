import { describe, it, expect } from "vitest";

import { parseAllVotes } from "../parseAllVotes";

describe("parseAllVotes", () => {
  it("parses every vote_<from>_<to> entry", () => {
    const vars = {
      vote_A_B: { votes: 5, ts: 100 },
      vote_C_D: { votes: 7, strength: 2, ts: 200 },
    };
    const result = parseAllVotes(vars);
    expect(result).toHaveLength(2);
    const ab = result.find((v) => v.fromAddress === "A");
    expect(ab).toMatchObject({ fromAddress: "A", toAddress: "B", votes: 5 });
    const cd = result.find((v) => v.fromAddress === "C");
    expect(cd).toMatchObject({
      fromAddress: "C",
      toAddress: "D",
      votes: 7,
      strength: 2,
    });
  });

  it("splits on the first underscore (from/to are full addresses)", () => {
    const vars = { vote_VOTER1_TARGET2: { votes: 1, ts: 1 } };
    const [v] = parseAllVotes(vars);
    expect(v.fromAddress).toBe("VOTER1");
    expect(v.toAddress).toBe("TARGET2");
  });

  it("ignores keys without the vote_ prefix", () => {
    const vars = {
      user_A: { total_balance: 100 },
      m_address_x: "ADDR",
      state: {},
    };
    expect(parseAllVotes(vars)).toEqual([]);
  });

  it("ignores null / invalid entries (missing votes or ts, non-numeric)", () => {
    const vars = {
      vote_A_B: { votes: 5, ts: 1 },
      vote_C_D: null,
      vote_E_F: { ts: 2 }, // no votes
      vote_G_H: { votes: 3 }, // no ts
      vote_I_J: { votes: "bad", ts: 3 },
    };
    const result = parseAllVotes(vars);
    expect(result).toHaveLength(1);
    expect(result[0].fromAddress).toBe("A");
  });

  it("leaves strength undefined when absent or non-numeric", () => {
    const vars = {
      vote_A_B: { votes: 5, ts: 1 },
      vote_C_D: { votes: 5, strength: "low", ts: 1 },
    };
    const result = parseAllVotes(vars);
    expect(result.every((v) => v.strength === undefined)).toBe(true);
  });
});
