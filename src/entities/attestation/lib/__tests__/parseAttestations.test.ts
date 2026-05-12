import { describe, it, expect } from "vitest";

import { attestors } from "#/shared/config/appConfig";

import {
  parseRawAttestations,
  parseAttestations,
  emptyAttestations,
} from "../parseAttestations";

const TELEGRAM_ATTESTOR: string = attestors.telegramAttestors[0];
const DISCORD_ATTESTOR: string = (
  attestors.discordAttestors as readonly string[]
).find((a) => !(attestors.telegramAttestors as readonly string[]).includes(a))!;
const REAL_NAME_ATTESTOR: string = attestors.realNameAttestors[0];
const UNKNOWN_ATTESTOR = "UNKNOWNUNKNOWNUNKNOWNUNKNOWNUNKN";

describe("parseRawAttestations", () => {
  it("returns empty array for non-arrays", () => {
    expect(parseRawAttestations(null)).toEqual([]);
    expect(parseRawAttestations(undefined)).toEqual([]);
    expect(parseRawAttestations({})).toEqual([]);
    expect(parseRawAttestations("oops")).toEqual([]);
    expect(parseRawAttestations(42)).toEqual([]);
  });

  it("returns empty array for empty input", () => {
    expect(parseRawAttestations([])).toEqual([]);
  });

  it("keeps valid attestations and drops malformed ones", () => {
    const result = parseRawAttestations([
      { attestor_address: TELEGRAM_ATTESTOR, profile: { username: "alice" } },
      { attestor_address: 123, profile: { username: "bob" } }, // bad: not a string
      { profile: { username: "no-addr" } }, // bad: missing attestor_address
      { attestor_address: DISCORD_ATTESTOR }, // bad: missing profile
      null,
      { attestor_address: REAL_NAME_ATTESTOR, profile: {} },
    ]);
    expect(result).toHaveLength(2);
    expect(result[0].attestor_address).toBe(TELEGRAM_ATTESTOR);
    expect(result[1].attestor_address).toBe(REAL_NAME_ATTESTOR);
  });

  it("accepts profile with non-string values (regression — obyte can return numeric user_id)", () => {
    const result = parseRawAttestations([
      {
        attestor_address: TELEGRAM_ATTESTOR,
        profile: { username: "alice", user_id: 12345678 },
      },
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].profile).toMatchObject({
      username: "alice",
      user_id: 12345678,
    });
  });

  it("accepts profile with extra unknown fields", () => {
    const result = parseRawAttestations([
      {
        attestor_address: REAL_NAME_ATTESTOR,
        profile: {
          first_name: "Alice",
          last_name: "Smith",
          country: "US",
          profile_hash: "abc",
        },
      },
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].profile.first_name).toBe("Alice");
  });
});

describe("parseAttestations", () => {
  it("returns all-null for empty input", () => {
    expect(parseAttestations([])).toEqual({
      telegram: null,
      discord: null,
      realName: null,
      displayName: null,
    });
  });

  it("picks telegram profile when telegram attestor present", () => {
    const result = parseAttestations([
      { attestor_address: TELEGRAM_ATTESTOR, profile: { username: "alice" } },
    ]);
    expect(result.telegram).toEqual({ username: "alice" });
    expect(result.discord).toBeNull();
    expect(result.realName).toBeNull();
    expect(result.displayName).toBe("alice");
  });

  it("picks discord profile when only discord attestor present", () => {
    const result = parseAttestations([
      { attestor_address: DISCORD_ATTESTOR, profile: { username: "bob#1234" } },
    ]);
    expect(result.telegram).toBeNull();
    expect(result.discord).toEqual({ username: "bob#1234" });
    expect(result.displayName).toBe("bob#1234");
  });

  it("picks real-name profile when only real-name attestor present", () => {
    const result = parseAttestations([
      {
        attestor_address: REAL_NAME_ATTESTOR,
        profile: { username: "Carol Smith", first_name: "Carol" },
      },
    ]);
    expect(result.realName).toMatchObject({ username: "Carol Smith" });
    expect(result.displayName).toBe("Carol Smith");
  });

  it("displayName follows priority: telegram > discord > real-name", () => {
    const result = parseAttestations([
      { attestor_address: REAL_NAME_ATTESTOR, profile: { username: "real" } },
      { attestor_address: DISCORD_ATTESTOR, profile: { username: "disc" } },
      { attestor_address: TELEGRAM_ATTESTOR, profile: { username: "tg" } },
    ]);
    expect(result.displayName).toBe("tg");
  });

  it("falls through to next source when higher-priority profile lacks string username", () => {
    const result = parseAttestations([
      // telegram has non-string username → skipped for displayName
      {
        attestor_address: TELEGRAM_ATTESTOR,
        profile: { username: 42 as unknown as string },
      },
      { attestor_address: DISCORD_ATTESTOR, profile: { username: "disc" } },
    ]);
    expect(result.telegram).not.toBeNull();
    expect(result.displayName).toBe("disc");
  });

  it("returns null displayName when usernames are missing or empty", () => {
    const result = parseAttestations([
      { attestor_address: TELEGRAM_ATTESTOR, profile: { username: "" } },
      { attestor_address: REAL_NAME_ATTESTOR, profile: { first_name: "X" } },
    ]);
    expect(result.displayName).toBeNull();
  });

  it("ignores attestations from unknown attestors", () => {
    const result = parseAttestations([
      { attestor_address: UNKNOWN_ATTESTOR, profile: { username: "spam" } },
    ]);
    expect(result.telegram).toBeNull();
    expect(result.discord).toBeNull();
    expect(result.realName).toBeNull();
    expect(result.displayName).toBeNull();
  });

  it("first matching attestation per category wins (later duplicates ignored)", () => {
    const result = parseAttestations([
      { attestor_address: TELEGRAM_ATTESTOR, profile: { username: "first" } },
      { attestor_address: TELEGRAM_ATTESTOR, profile: { username: "second" } },
    ]);
    expect(result.telegram).toEqual({ username: "first" });
  });
});

describe("emptyAttestations", () => {
  it("returns a fresh all-null record", () => {
    const a = emptyAttestations();
    const b = emptyAttestations();
    expect(a).toEqual({
      telegram: null,
      discord: null,
      realName: null,
      displayName: null,
    });
    expect(a).not.toBe(b);
  });
});
