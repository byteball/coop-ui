import { describe, it, expect } from "vitest";

import { getProfileField } from "../getProfileField";

describe("getProfileField", () => {
  it("returns null for null/undefined profile", () => {
    expect(getProfileField(null, "username")).toBeNull();
    expect(getProfileField(undefined, "username")).toBeNull();
  });

  it("returns null for missing key", () => {
    expect(getProfileField({}, "username")).toBeNull();
  });

  it("returns the string value when present", () => {
    expect(getProfileField({ username: "alice" }, "username")).toBe("alice");
  });

  it("treats empty strings as missing", () => {
    expect(getProfileField({ username: "" }, "username")).toBeNull();
  });

  it("coerces finite numbers to strings (Obyte sometimes sends numeric user_id)", () => {
    expect(getProfileField({ user_id: 12345 }, "user_id")).toBe("12345");
    expect(getProfileField({ user_id: 0 }, "user_id")).toBe("0");
  });

  it("rejects non-finite numbers", () => {
    expect(getProfileField({ user_id: NaN }, "user_id")).toBeNull();
    expect(getProfileField({ user_id: Infinity }, "user_id")).toBeNull();
  });

  it("rejects non-string/non-number shapes", () => {
    expect(getProfileField({ extra: true }, "extra")).toBeNull();
    expect(getProfileField({ extra: { x: 1 } }, "extra")).toBeNull();
    expect(getProfileField({ extra: [1, 2] }, "extra")).toBeNull();
    expect(getProfileField({ extra: null }, "extra")).toBeNull();
  });
});
