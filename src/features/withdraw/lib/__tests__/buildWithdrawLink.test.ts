import { describe, it, expect } from "vitest";

import { buildWithdrawLink } from "../buildWithdrawLink";

function decodeData(link: string): Record<string, unknown> | null {
  const url = new URL(link);
  const b64 = url.searchParams.get("base64data");
  if (!b64) return null;
  return JSON.parse(Buffer.from(b64, "base64").toString("utf8")) as Record<
    string,
    unknown
  >;
}

describe("buildWithdrawLink", () => {
  it("returns a valid obyte link with the bounce fee in base asset", () => {
    const link = buildWithdrawLink();
    expect(link).toContain("obyte");
    expect(link).toContain("asset=base");
    expect(link).toContain("amount=10000");
  });

  it("encodes { withdraw: 1 } as the trigger data", () => {
    const data = decodeData(buildWithdrawLink());
    expect(data?.withdraw).toBe(1);
  });

  it("appends from_address when provided", () => {
    const addr = "MFGABCDEFGHIJKLMNOPQRSTUVWXYZ2345";
    const link = buildWithdrawLink({ fromAddress: addr });
    expect(link).toContain(`from_address=${addr}`);
  });

  it("omits from_address when not provided", () => {
    expect(buildWithdrawLink()).not.toContain("from_address");
  });
});
