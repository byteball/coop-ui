import { describe, it, expect, vi, beforeEach } from "vitest";

import client from "#/shared/api/obyte";
import { storageKey } from "#/shared/lib/storageKey";
import { attestationsQueryOptions } from "../useAttestations";

vi.mock("#/shared/api/obyte", () => ({
  default: {
    api: {
      getAttestations: vi.fn(),
    },
  },
}));

describe("attestationsQueryOptions", () => {
  const testAddress = "TESTADDRESS1234567890123456789012";
  const testStorageKey = storageKey("attestations_v2_" + testAddress);
  const storageMap = new Map<string, string>();

  beforeEach(() => {
    storageMap.clear();
    vi.clearAllMocks();

    vi.stubGlobal("localStorage", {
      getItem: vi.fn((key: string) => storageMap.get(key) ?? null),
      setItem: vi.fn((key: string, val: string) => storageMap.set(key, val)),
      removeItem: vi.fn((key: string) => storageMap.delete(key)),
      clear: vi.fn(() => storageMap.clear()),
    });
  });

  it("returns empty attestations when address is undefined", async () => {
    const options = attestationsQueryOptions(undefined);
    const result = await options.queryFn!({} as never);
    expect(result).toEqual({
      telegram: null,
      discord: null,
      realName: null,
      displayName: null,
    });
    expect(client.api.getAttestations).not.toHaveBeenCalled();
  });

  it("fetches from client API, parses, caches in localStorage, and returns parsed result", async () => {
    vi.mocked(client.api.getAttestations).mockResolvedValueOnce([
      {
        unit: "MOCK_UNIT_HASH",
        attestor_address: "JBW7HT5CRBSF7J7RD26AYLQG6GZDPFPS",
        profile: { username: "alice_tg" },
      },
    ]);

    const options = attestationsQueryOptions(testAddress);
    const result = await options.queryFn!({} as never);

    expect(client.api.getAttestations).toHaveBeenCalledTimes(1);
    expect(client.api.getAttestations).toHaveBeenCalledWith({
      address: testAddress,
    });
    expect(result.displayName).toBe("alice_tg");
    expect(result.telegram).toEqual({ username: "alice_tg" });

    // Verify written to localStorage
    const cachedRaw = localStorage.getItem(testStorageKey);
    expect(cachedRaw).toBeTruthy();
    expect(JSON.parse(cachedRaw!).data.displayName).toBe("alice_tg");
  });

  it("returns cached data on subsequent call without hitting client API", async () => {
    localStorage.setItem(
      testStorageKey,
      JSON.stringify({
        data: {
          telegram: { username: "cached_user" },
          discord: null,
          realName: null,
          displayName: "cached_user",
        },
        ts: Date.now(),
      }),
    );

    const options = attestationsQueryOptions(testAddress);
    const result = await options.queryFn!({} as never);

    expect(client.api.getAttestations).not.toHaveBeenCalled();
    expect(result.displayName).toBe("cached_user");
  });

  it("throws error and does NOT write to localStorage when client API fails", async () => {
    vi.mocked(client.api.getAttestations).mockRejectedValueOnce(
      new Error("WebSocket disconnected"),
    );

    const options = attestationsQueryOptions(testAddress);

    await expect(options.queryFn!({} as never)).rejects.toThrow(
      "WebSocket disconnected",
    );

    const cachedRaw = localStorage.getItem(testStorageKey);
    expect(cachedRaw).toBeNull();
  });
});
